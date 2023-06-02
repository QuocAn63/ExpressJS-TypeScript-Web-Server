import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { IResponseData } from "../types/response";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  const message = err.message;
  const status = err.status | 400;

  return res.status(status).json({ message });
};
