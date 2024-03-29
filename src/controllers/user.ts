import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { IResponseData } from "../interfaces/response.interface";
import userModel, { userType } from "../models/user";
import HttpException from "../exceptions/httpException";
import { IRequestWithUser } from "../interfaces/request.interface";
import { getPaginationString } from "../helpers";

export class UserController {
  public getUsers = async (
    req: Request,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { username, name, date } = req.query;
      const query = userModel.find();
      const { limit, page } = getPaginationString(req);

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

      query.limit(limit);

      query.skip(limit * (page - 1));

      const userResponse = await query.exec();

      return res.status(200).json({ data: userResponse });
    } catch (err) {
      next(err);
    }
  };

  public getUserProfile = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const user = req.user as userType;

      const fetchUserResponse = await userModel.findById(user.id, {
        password: 0,
      });

      return res.status(200).json({ data: fetchUserResponse });
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
      const { limit, page } = getPaginationString(req);

      const fetchUserResponse = await userModel
        .findOne({ username }, { password: 0 })
        .limit(limit)
        .skip(limit * (page - 1))
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
      const { password, newpassword } = req.body;
      const user = req.user as userType; // the user can not be null at this time
      const saltRounds = Number.parseInt(process.env.PW_SALT_ROUNDS || "10");

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

      return res.status(200).json({
        message: "Password updated",
        data: fetchUpdateUserResponse.id,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateUserInfo = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const user = req.user as userType;
      const { username } = req.params;
      const { dob, address, gender, name, roles, status, phonenumber } =
        req.body;
      const avatar = req.file;
      const query = userModel.findOne({ username });
      const adminAuthorized = user.roles.includes("admin");
      if (user.username !== username && !adminAuthorized)
        throw new HttpException(403, "Unauthorized action");

      if (dob) query.updateOne({ dob });
      if (address) query.updateOne({ address });
      if (gender) query.updateOne({ gender });
      if (name) query.updateOne({ name });
      if (phonenumber) query.updateOne({ phonenumber });
      if (avatar) query.updateOne({ avatar: avatar.path });
      if (adminAuthorized) {
        if (roles) query.updateOne({ roles });
        if (status) query.updateOne({ isActived: status });
      }

      const fetchUpdateUserResponse = await query.exec();

      if (!fetchUpdateUserResponse)
        throw new HttpException(404, "Can not find user to update");

      console.log(fetchUpdateUserResponse);

      return res.status(200).json({
        message: "User info updated",
        data: fetchUpdateUserResponse.id,
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteUser = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const user = req.user as userType;
      const { username } = req.params;

      if (!("admin" in user.roles))
        throw new HttpException(403, "Unauthorized action");

      const fetchDeleteUserResponse = await userModel.findOneAndDelete({
        username,
      });

      if (!fetchDeleteUserResponse)
        throw new HttpException(404, "Can not find user to delete");

      return res
        .status(200)
        .json({ message: "User deleted", data: fetchDeleteUserResponse.id });
    } catch (err) {
      next(err);
    }
  };
}
