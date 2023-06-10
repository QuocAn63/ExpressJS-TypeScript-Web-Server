import { NextFunction, Request, Response } from "express";
import { google } from "googleapis";
import userModel from "../models/user";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IResponseData } from "../types/response";
import axios from "axios";
import { validationResult } from "express-validator";

const githubAuthorizeUrl = "https://github.com/login/oauth/authorize";
export const oauth2Client = new google.auth.OAuth2(
  "743433801669-j169dda6jeac7uu97a1rgrpqev40jmhm.apps.googleusercontent.com",
  "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",
  "http://localhost:3001/api/auth/google/callback"
);

let refreshTokens: {
  [key: string]: { accessToken: string; refreshToken: string };
} = {};

interface ITokenPayload extends JwtPayload {
  id: string;
}

export type JWTTokenPayload = ITokenPayload | null;

interface IRequestWithOauthCallback extends Request {
  loginMethod: "google" | "github" | "facebook";
  user: string;
}

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    switch (error.type) {
      case "field":
        return { path: error.path, msg: error.msg };
      case "unknown_fields":
        return { unknowField: error.fields, msg: error.msg };
      default:
        return error;
    }
  },
});

const findOrCreateUser = async (
  method: "google" | "github" | "facebook",
  platformId: string,
  platformName: string | null | undefined
) => {
  const userResponse = await userModel.findOne({ [method + "Id"]: platformId });

  let userData =
    userResponse === null
      ? await userModel.create({
          [method + "Id"]: platformId,
          name: platformName,
        })
      : userResponse;

  return { method, user: userData };
};

const generateAuthTokens = (
  userId: string
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    {
      id: userId,
    },
    process.env.SECRET_ACCESS_KEY as string,
    { expiresIn: process.env.ACCESS_TOKEN_LIFE }
  );

  const refreshToken = jwt.sign(
    {
      id: userId,
    },
    process.env.SECRET_REFRESH_KEY as string,
    { expiresIn: process.env.REFRESH_TOKEN_LIFE }
  );

  return { accessToken, refreshToken };
};

export const login = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const result = myValidationResult(req).array({ onlyFirstError: true });

    if (result.length !== 0) {
      throw { message: "Validation error", status: 401, detail: result };
    }

    // temporary fix
    let reqWithOauthCallback = req as IRequestWithOauthCallback;
    let userId: string;
    const { user, loginMethod } = reqWithOauthCallback;

    if (user && loginMethod) {
      userId = user;
    } else {
      const { username, password } = reqWithOauthCallback.body;

      const userResponse = await userModel.findOne({ username });

      if (userResponse === null)
        throw { message: "User not found", status: 404 };

      const isPasswordValid = await bcrypt.compare(
        password,
        userResponse.password
      );

      if (!isPasswordValid)
        throw { message: "Password is not correct", status: 403 };

      userId = userResponse._id.toString();
    }

    const { accessToken, refreshToken } = generateAuthTokens(userId);

    refreshTokens[refreshToken] = { accessToken, refreshToken };

    return res.status(200).json({
      message: "Login success",
      data: { accessToken, refreshToken },
    });
  } catch (err: any) {
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const result = myValidationResult(req).array({ onlyFirstError: true });

    if (result.length !== 0) {
      throw { message: "Validation error", status: 401, detail: result };
    }

    const { username, password, repassword } = req.body;

    if (password !== repassword)
      throw { message: "Password confirm not match" };

    const encryptedPassword = await bcrypt.hash(password, 10);

    const userCreationResponse = await userModel.create({
      username,
      password: encryptedPassword,
    });

    return res.status(200).json({
      message: "Registeration success",
      data: userCreationResponse._id,
    });
  } catch (err: any) {
    next(err);
  }
};

export const handleGoogleLoginRequest = async (req: Request, res: Response) => {
  const scope = "https://www.googleapis.com/auth/userinfo.profile";

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope,
    include_granted_scopes: true,
  });

  res.status(301).redirect(authorizationUrl);
};

export const handleGoogleLoginCallback = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    // temporary fix
    let reqWithOauthCallback = req as IRequestWithOauthCallback;

    let q = reqWithOauthCallback.query;

    if (q.error) throw { message: q.error };

    let { tokens } = await oauth2Client.getToken(q.code as string);
    oauth2Client.setCredentials(tokens);

    const auth = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await auth.userinfo.get();

    if (!data.id) throw { message: "Can not get data from google" };

    const { method, user } = await findOrCreateUser(
      "google",
      data.id,
      data.name
    );

    reqWithOauthCallback.user = user._id.toString();
    reqWithOauthCallback.loginMethod = method;

    next();
  } catch (err) {
    next(err);
  }
};

export const regenerateToken = (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) throw { message: "No token provided" };
    if (refreshTokens[refreshToken] === undefined)
      throw { message: "Refresh token not exist" };

    const tokenDecoded = jwt.decode(refreshToken) as JWTTokenPayload;

    if (!tokenDecoded) throw { message: "Token decoded is null" };

    const newToken = jwt.sign(
      { id: tokenDecoded.id },
      process.env.SECRET_ACCESS_KEY as string,
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );

    refreshTokens[refreshToken].accessToken = newToken;

    return res.status(200).json({ message: "Token refreshed", data: newToken });
  } catch (err: any) {
    err.message = err.message || "Error when regenerating token";

    next(err);
  }
};

export const handleGithubLoginRequest = (req: Request, res: Response) => {
  let redirectUri =
    githubAuthorizeUrl +
    `?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURI(
      "http://localhost:3001/api/auth/github/callback"
    )}`;
  res.redirect(redirectUri);
};

export const handleGithubLoginCallback = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    let reqWithOauthCallback = req as IRequestWithOauthCallback;
    const { code } = reqWithOauthCallback.query;

    const resp = await axios.post(
      `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
      {},
      { headers: { Accept: "application/json" } }
    );

    const { access_token } = resp.data;
    if (!access_token) {
      throw { message: "No access token" };
    }
    const { data } = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    if (!data.id) throw { message: "Can not get data from github" };

    const { method, user } = await findOrCreateUser(
      "github",
      data.id,
      data.name
    );

    reqWithOauthCallback.user = user._id.toString();
    reqWithOauthCallback.loginMethod = method;

    next();
  } catch (err: any) {
    next(err);
  }
};

export const handleFacebookLoginRequest = (req: Request, res: Response) => {
  const redirectURL = "https://www.facebook.com/v17.0/dialog/oauth";

  return res.redirect(
    redirectURL +
      `?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_SECRET_CLIENT}&state=${process.env.FACEBOOK_STATE}`
  );
};

export const handleFacebookLoginCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.query;
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const result = myValidationResult(req).array({ onlyFirstError: true });

    if (result.length !== 0) {
      throw { message: "Validation error", status: 401, detail: result };
    }
    const { password, newpassword } = req.body;
    const userId = res.locals.user;

    const userResponse = await userModel.findById(userId);

    if (userResponse === null) {
      throw { message: "Can not find user", status: 401 };
    }

    const isCorrectPw = await bcrypt.compare(password, userResponse.password);

    if (!isCorrectPw) {
      throw { message: "Password not match", status: 401 };
    }

    const newPasswordEncrypted = await bcrypt.hash(newpassword, 10);
    const updateUserResult = await userModel.findByIdAndUpdate(userId, {
      password: newPasswordEncrypted,
    });

    if (!updateUserResult) {
      throw { message: "Update password failed", status: 400 };
    }

    return res
      .status(200)
      .json({ message: "Password updated", data: updateUserResult.id });
  } catch (err) {
    next(err);
  }
};
