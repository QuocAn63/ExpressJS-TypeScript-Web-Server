import { NextFunction, Response } from "express";
import { IRequestWithUser } from "../interfaces/request.interface";
import { IResponseData } from "../interfaces/response.interface";
import { sortOptions } from "./product";
import { promotionModel, promotionType } from "../models/product";
import HttpException from "../exceptions/httpException";
import { getPaginationString } from "../helpers";

export default class PromotionController {
  public getPromotions = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { date, type, percentage, amount, expired } = req.query;
      const { limit, page } = getPaginationString(req);
      console.log(limit, page);
      const query = promotionModel.find();
      if (date && typeof date === "string" && sortOptions.time.includes(date))
        query.sortByDate(date as "newest" | "oldest");
      if (
        type &&
        typeof type === "string" &&
        ["percentage", "amount"].includes(type)
      )
        query.byType(type as "percentage" | "amount");
      if (
        percentage &&
        typeof percentage === "string" &&
        sortOptions.value.includes(percentage)
      )
        query.sortByPercentage(percentage as "desc" | "asc");
      if (
        amount &&
        typeof amount === "string" &&
        sortOptions.value.includes(amount)
      )
        query.sortByAmount(amount as "desc" | "asc");
      if (expired && typeof expired === "boolean") query.byStatus(expired);

      const fetchPromotionResponse = await query
        .limit(limit)
        .skip(limit * (page - 1))
        .exec();

      return res.status(200).json({ data: fetchPromotionResponse });
    } catch (err) {
      next(err);
    }
  };

  public createPromotion = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { title, description, percentage, amount, expiredIn } = req.body;
      let newPromotion: any = { title, description, expiredIn };

      if (percentage) newPromotion = { ...newPromotion, percentage };
      if (amount) newPromotion = { ...newPromotion, amount };

      const fetchCreatePromotionResponse = await promotionModel.create(
        newPromotion
      );

      if (!fetchCreatePromotionResponse)
        throw new HttpException(500, "Can not create promotion");

      return res.status(200).json({
        message: "Promotion created",
        data: fetchCreatePromotionResponse.id,
      });
    } catch (err) {
      next(err);
    }
  };
}
