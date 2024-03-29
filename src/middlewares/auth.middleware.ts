import { NextFunction, Response } from "express";
import { IResponseData } from "../interfaces/response.interface";
import { IRequestWithUser } from "../interfaces/request.interface";
import HttpException from "../exceptions/httpException";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_KEY } from "../config";
import { DataStoredInToken, UserRoles } from "../interfaces/auth.interface";
import userModel from "../models/user";

export const getAuthorization = (req: IRequestWithUser): string | null => {
  const cookie =
    req.cookies["token"] ||
    req.header("Authorization")?.split("Bearer ")[1] ||
    null;

  return cookie;
};

const authorizationMiddleware =
  (isPublic = false, ...params: UserRoles[]) =>
  async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const authorization = getAuthorization(req);

      if (authorization) {
        const { payload } = jwt.verify(
          authorization as string,
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
        const isUserDisactived = !fetchUserResponse.isActived;

        if (!isUserAccessAuthorized)
          return next(new HttpException(403, "Unauthorized action"));

        if (isUserDisactived)
          return next(new HttpException(403, "User disactived"));

        req.user = fetchUserResponse;

        next();
      } else {
        if (!isPublic)
          next(new HttpException(401, "Missing authentication token"));
        next();
      }
    } catch (err) {
      next(new HttpException(401, "Token expired"));
    }
  };

export default authorizationMiddleware;
