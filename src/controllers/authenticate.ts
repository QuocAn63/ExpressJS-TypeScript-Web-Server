import { NextFunction, Request, Response } from "express";
import { google } from "googleapis";
import userModel, { userType } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IResponseData } from "../interfaces/response.interface";
import axios from "axios";
import { IRequestWithUser } from "../interfaces/request.interface";
import HttpException from "../exceptions/httpException";
import {
  ACCESS_TOKEN_LIFE,
  PW_SALT_ROUNDS,
  SECRET_ACCESS_KEY,
  SECRET_REFRESH_KEY,
} from "../config";

export class AuthController {
  private googleCallbackUrl = "http://localhost:3001/api/auth/google/callback";
  private githubCallbackUrl = "http://localhost:3001/api/auth/github/callback";
  private githubAuthUrl = "https://github.com/login/oauth/authorize";
  private googleOauth2Client = new google.auth.OAuth2(
    "743433801669-j169dda6jeac7uu97a1rgrpqev40jmhm.apps.googleusercontent.com",
    "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",
    this.googleCallbackUrl
  );
  protected googleProfileApiScope =
    "https://www.googleapis.com/auth/userinfo.profile";
  private githubClientId = process.env.GITHUB_CLIENT_ID;
  private githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

  public login = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      let loggedInUser: userType;

      const { loginMethod, user } = req;

      if (loginMethod && user) loggedInUser = user;
      else {
        const { username, password } = req.body;

        const fetchUserResponse = await userModel.findOne({ username });

        if (fetchUserResponse === null)
          throw new HttpException(404, "Authenticate failed", [
            { field: "username", message: "User not found" },
          ]);

        const isValidPw = await bcrypt.compare(
          password,
          fetchUserResponse.password as string
        );

        if (!isValidPw)
          throw new HttpException(401, "Authenticate failed", [
            { field: "password", message: "Password not match" },
          ]);

        loggedInUser = fetchUserResponse;
      }

      if (!loggedInUser.isActived)
        throw new HttpException(403, "User had been disactived");

      const { accessToken, refreshToken } = this.generateAuthTokens(
        loggedInUser.id
      );

      return this.setUserSession(res, accessToken)
        .status(200)
        .json({ data: { accessToken, refreshToken } });
    } catch (err) {
      next(err);
    }
  };

  public register = async (
    req: Request,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { username, password } = req.body;
      const saltRounds = Number.parseInt(PW_SALT_ROUNDS || "10");
      const encodedPw = await bcrypt.hash(password, saltRounds);

      const fetchCreateUserResponse = await userModel.create({
        username,
        password: encodedPw,
      });

      if (!fetchCreateUserResponse)
        throw new HttpException(500, "Error when saving user");

      return res.status(200).json({
        message: "Register success",
        data: fetchCreateUserResponse.id,
      });
    } catch (err) {
      next(err);
    }
  };

  public logout = async (
    req: Request,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    return this.clearUserSession(res)
      .status(200)
      .json({ message: "Logout success" });
  };

  public requestLoginWithGoogle = async (req: Request, res: Response) => {
    const scope = this.googleProfileApiScope;
    const authorizationUrl = this.googleOauth2Client.generateAuthUrl({
      access_type: "offline",
      scope,
      include_granted_scopes: true,
    });

    res.status(301).redirect(authorizationUrl);
    res.status(200);
  };

  public handleGoogleCallback = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let q = req.query;

      if (q.error) throw new HttpException(400, "Error when connect to Google");

      let { tokens } = await this.googleOauth2Client.getToken(q.code as string);
      this.googleOauth2Client.setCredentials(tokens);

      const user = google.oauth2({
        version: "v2",
        auth: this.googleOauth2Client,
      });
      const { data } = await user.userinfo.get();

      if (!data.id) throw new HttpException(400, "Get data from google failed");

      const { loginMethod, user: fetchedUser } = await this.findOrCreateUser(
        "google",
        data.id
      );

      req.user = fetchedUser;
      req.loginMethod = loginMethod;
      next();
    } catch (err) {
      next(err);
    }
  };

  public requestLoginWithGithub = async (req: Request, res: Response) => {
    let redirectUri = `${this.githubAuthUrl}?client_id=${
      this.githubClientId
    }&redirect_uri=${encodeURI(this.githubCallbackUrl)}`;

    res.redirect(redirectUri);
  };

  public handleGithubCallback = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { code } = req.query;

      if (!code)
        throw new HttpException(400, "Can not get login code from Github");

      const {
        data: { access_token },
      } = await axios.post(
        `https://github.com/login/oauth/access_token?client_id=${this.githubClientId}&client_secret=${this.githubClientSecret}&code=${code}`,
        {},
        { headers: { Accept: "application/json" } }
      );

      if (!access_token)
        throw new HttpException(400, "Can not get access token from Github");

      const { data } = await axios.get(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
      if (!data.id)
        throw new HttpException(404, "Can not find user from Github");

      const { loginMethod, user } = await this.findOrCreateUser(
        "github",
        data.id
      );

      req.user = user;
      req.loginMethod = loginMethod;

      next();
    } catch (err) {
      next(err);
    }
  };

  public refreshAccessToken = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { token } = req.body;

      const tokenPayload = jwt.verify(token, SECRET_REFRESH_KEY as string);

      if (!tokenPayload) throw new HttpException(403, "Invalid refresh token");

      const newAccessToken = jwt.sign(
        tokenPayload,
        SECRET_ACCESS_KEY as string
      );

      return this.setUserSession(res, newAccessToken)
        .status(200)
        .json({ message: "Token refreshed" });
    } catch (err) {
      next(err);
    }
  };

  private findOrCreateUser = async (
    loginMethod: IRequestWithUser["loginMethod"],
    platformId: string,
    platformName?: string
  ): Promise<Pick<IRequestWithUser, "loginMethod" | "user">> => {
    const methodString = `${loginMethod}Id`;
    const fetchUserResponse = await userModel.findOne({
      [methodString]: platformId,
    });

    let userData =
      fetchUserResponse !== null
        ? fetchUserResponse
        : await userModel.create({
            [methodString]: platformId,
            name: platformName,
            username: platformId,
          });

    return { loginMethod, user: userData };
  };

  private generateAuthTokens = (
    userId: string
  ): {
    accessToken: string;
    refreshToken: string;
  } => {
    const accessToken = jwt.sign(
      {
        payload: { userId },
      },
      process.env.SECRET_ACCESS_KEY as string,
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );
    const refreshToken = jwt.sign(
      { payload: { userId } },
      process.env.SECRET_REFRESH_KEY as string,
      { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    );

    return { accessToken, refreshToken };
  };

  private setUserSession(res: Response, token: string) {
    const tokenLife = new Date(
      Date.now() + Number.parseInt(ACCESS_TOKEN_LIFE || "7200000")
    );

    return res.cookie("token", token, { expires: tokenLife });
  }

  private clearUserSession(res: Response) {
    return res.cookie("token", "");
  }
}
