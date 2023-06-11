import { NextFunction, Request, Response } from "express";
import { IResponseData } from "../types/response";
import userModel from "../models/user";

export const getAllUsers = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const queries = req.query;

    const usersResponse = await userModel.find();

    return res.status(200).json({ data: usersResponse });
  } catch (err) {
    next(err);
  }
};
