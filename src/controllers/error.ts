import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { IResponseData } from "../interfaces/response.interface";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  const message = err.message;
  const status = err.status | 400;
  const detail = err.detail;

  return res.status(status).json({ error: message, detail });
};

export class ErrorController {
  public errorHandler<ErrorRequestHandler>(
    err: any,
    req: Request,
    res: Response<IResponseData>
  ) {
    const message = err.message || "Error";
    const status = err.status || 400;
    const detail = err.detail || err;

    return res.status(status).json({ error: message, detail });
  }
}
