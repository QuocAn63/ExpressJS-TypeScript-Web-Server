import { NextFunction, Request, Response } from "express";
import { IResponseData } from "../interfaces/response.interface";
import { IRequestWithUser } from "../interfaces/request.interface";
import productModel from "../models/product";
import { userType } from "../models/user";
import HttpException from "../exceptions/httpException";

export default class ProductController {
  public async getProducts(
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) {
    try {
      const { name, price, minPrice, maxPrice, date, rating, status } =
        req.query;
      const user = req.user;
      const isAuthorized = user?.roles.includes("admin");
      const query = productModel.find();
      const sortOptions = {
        value: ["asc", "desc"],
        time: ["newest", "oldest"],
      };

      if (name && typeof name === "string") query.byName(name);
      if (
        price &&
        typeof price === "string" &&
        sortOptions.value.includes(price)
      )
        query.sortByPrice(price as "desc" | "asc");
      if (
        minPrice &&
        typeof minPrice === "string" &&
        Number.parseInt(minPrice) >= 0
      )
        query.minPrice(minPrice);
      if (
        minPrice &&
        typeof maxPrice === "string" &&
        Number.parseInt(maxPrice) >= 0
      )
        query.minPrice(maxPrice);
      if (date && typeof date === "string" && sortOptions.time.includes(date))
        query.sortByDate(date as "newest" | "oldest");
      // if(rating && typeof rating === "string" && sortOptions.value.includes(rating))
      if (
        isAuthorized &&
        status &&
        typeof status === "string" &&
        ["visible", "invinsible", "all"].includes(status)
      )
        query.byStatus(status as "visible" | "invinsible" | "all");

      const fetchProductsResponse = await query.exec();

      return res.status(200).json({ data: fetchProductsResponse });
    } catch (err) {
      next(err);
    }
  }

  public async likeProduct(
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) {
    try {
      const user = req.user as userType;
      const { slug } = req.params;

      const fetchUpdateProductResponse = await productModel.likeOrUnlikeProduct(
        slug,
        user.id
      );

      if (!fetchUpdateProductResponse.modifiedCount)
        throw new HttpException(404, "Can not update product");

      return res.status(200).json({ message: "Updated" });
    } catch (err) {
      next(err);
    }
  }
}
