import { NextFunction, Response } from "express";
import { IResponseData } from "../interfaces/response.interface";
import { IRequestWithUser } from "../interfaces/request.interface";
import HttpException from "../exceptions/httpException";
import jwt from "jsonwebtoken";

const getAuthorization = (req: IRequestWithUser): string | null => {
  const cookie =
    req.cookies["Authorization"] ||
    req.header("Authorization")?.split("Bearer ")[1];

  return cookie || null;
};

export const AuthorizationMiddleware = async (
  req: IRequestWithUser,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const authorization = getAuthorization(req);

    if (!authorization)
      throw new HttpException(404, "Missing authentication token");

    const { payload } = jwt.verify(authorization);
  } catch (err) {}
};
