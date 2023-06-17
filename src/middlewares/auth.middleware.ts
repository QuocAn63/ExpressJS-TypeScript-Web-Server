import { NextFunction, Response } from "express";
import { IResponseData } from "../interfaces/response.interface";
import { IRequestWithUser } from "../interfaces/request.interface";
import HttpException from "../exceptions/httpException";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_KEY } from "../config";
import { DataStoredInToken, UserRoles } from "../interfaces/auth.interface";
import userModel from "../models/user";

const getAuthorization = (req: IRequestWithUser): string | null => {
  const cookie =
    req.cookies["Authorization"] ||
    req.header("Authorization")?.split("Bearer ")[1] ||
    null;

  return cookie;
};

const authorizationMiddleware =
  (...params: UserRoles[]) =>
  async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const authorization = getAuthorization(req);

      if (!authorization)
        return next(new HttpException(401, "Missing authentication token"));

      const { payload } = jwt.verify(
        authorization,
        SECRET_ACCESS_KEY as string
      ) as DataStoredInToken;
      const fetchUserResponse = await userModel.findOne({
        _id: payload.userId,
      });

      if (!fetchUserResponse)
        return next(
          new HttpException(404, "Can not find user with the given token")
        );

      const isUserAccessAuthorized = params.some((paramRole) =>
        fetchUserResponse.roles.includes(paramRole)
      );

      if (!isUserAccessAuthorized)
        return next(new HttpException(403, "Unauthorized action"));

      req.user = fetchUserResponse;

      next();
    } catch (err) {
      next(new HttpException(401, "Token expired"));
    }
  };

export default authorizationMiddleware;
