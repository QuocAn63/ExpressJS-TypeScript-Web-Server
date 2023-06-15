import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { IResponseData } from "../interfaces/response.interface";
import userModel from "../models/user";
import HttpException from "../exceptions/httpException";
import { IRequestWithUser } from "../interfaces/request.interface";

export class UserController {
  public getUsers = async (
    req: Request,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { username, name, date, limit } = req.query;
      const query = userModel.find();

      if (username && typeof username === "string") {
        query.byUserName(username);
      }

      if (name && typeof name === "string") {
        query.byName(name);
      }

      if (date && typeof date === "string") {
        switch (date) {
          case "desc":
            query.sort({ createdAt: -1 });
            break;
          case "asc":
            query.sort({ createdAt: 1 });
        }
      }

      query.limit(
        limit && typeof limit === "string" ? Number.parseInt(limit) : 20
      );

      const userResponse = await query.exec();

      return res.status(200).json({ data: userResponse });
    } catch (err) {
      next(err);
    }
  };

  public getUserByUsername = async (
    req: Request,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { username } = req.params;

      const fetchUserResponse = await userModel
        .findOne({ username }, { password: 0 })
        .exec();

      if (!fetchUserResponse) throw new HttpException(404, "User not found");

      return res.status(200).json({ data: fetchUserResponse });
    } catch (err) {
      next(err);
    }
  };

  public changeUserPassword = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { username, password, newpassword } = req.params;
      const user = req.user;
      const saltRounds = process.env.PW_SALT_ROUNDS || 10;

      if (username !== user?.username || user?.roles !== "admin")
        throw new HttpException(401, "Failed to authorize");

      if (!user.password)
        throw new HttpException(
          401,
          "Can not change password with Oauth login account"
        );

      const isPwValid = await bcrypt.compare(password, user.password);

      if (!isPwValid) throw new HttpException(401, "Password is not correct");

      const newPw = await bcrypt.hash(newpassword, saltRounds);

      const fetchUpdateUserResponse = await userModel.findByIdAndUpdate(
        user.id,
        { password: newPw }
      );

      if (!fetchUpdateUserResponse)
        throw new HttpException(500, "Failed when update user password");

      return res
        .status(200)
        .json({
          message: "Password updated",
          data: fetchUpdateUserResponse.id,
        });
    } catch (err) {
      next(err);
    }
  };
}
