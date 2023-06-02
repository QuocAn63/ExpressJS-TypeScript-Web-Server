import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTTokenPayload } from "../controllers/authenticate";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token || req.headers["x-access-token"];

    const dataDecoded = jwt.verify(
      token,
      process.env.SECRET_ACCESS_KEY as string,
      { ignoreExpiration: false }
    ) as JWTTokenPayload;

    if (dataDecoded === null)
      throw { message: "No token provided", status: 401 };

    next();
  } catch (err) {
    next({ message: "Token expired", status: 401 });
  }
};
