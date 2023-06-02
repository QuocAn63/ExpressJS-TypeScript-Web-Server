import { NextFunction, Response } from "express";
import { IRequestWithOauthCallback } from "../types";
import { IResponseData } from "../types/response";

const getUser = async (
  req: IRequestWithOauthCallback,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
  } catch (err) {}
};
