import { NextFunction, Request, Response } from "express";
import { IResponseData } from "../types/response";
import userModel from "../models/user";

export const getAllUsers = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const queryParams = req.query;
    const query = userModel.find();
    const { username, name, date, limit } = queryParams;

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

export const getUser = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    const userResponse = await userModel
      .findOne({ username }, { password: 0 })
      .exec();

    if (!userResponse) {
      throw { message: "User not found", status: 404 };
    }

    return res.status(200).json({ data: userResponse });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response<IResponseData>,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
  } catch (err) {
    next(err);
  }
};
