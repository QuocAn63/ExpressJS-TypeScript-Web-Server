import { NextFunction, Response } from "express";
import { IResponseData } from "../interfaces/response.interface";
import { IRequestWithUser } from "../interfaces/request.interface";
import productModel, { productType, promotionModel } from "../models/product";
import { userType } from "../models/user";
import HttpException from "../exceptions/httpException";
import slugify from "slugify";
import { fileType } from "../interfaces/files.interface";
import { getPaginationString } from "../helpers";

export const sortOptions = {
  value: ["asc", "desc"],
  time: ["newest", "oldest"],
};

export default class ProductController {
  public getProducts = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { name, price, minPrice, maxPrice, date, rating, status } =
        req.query;
      const { limit, page } = getPaginationString(req);
      const user = req.user;
      const isAuthorized = user?.roles.includes("admin");
      const query = productModel.find();

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

      const fetchProductsResponse = await query
        .limit(limit)
        .skip(limit * (page - 1))
        .exec()
        .then((data) => this.checkUserLiked(data, user?.id));

      return res.status(200).json({ data: fetchProductsResponse });
    } catch (err) {
      next(err);
    }
  };

  public getProduct = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;

      const fetchProductsResponse = await productModel.find({ slug });

      if (!fetchProductsResponse)
        return res.status(404).json({ message: "Product not found" });

      return res.status(200).json({ data: fetchProductsResponse });
    } catch (err) {
      next(err);
    }
  };

  public updateProduct = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;
      const { name, price, stocks, status } = req.body;
      const user = req.user as userType;
      const isAuthorized = user.roles.includes("admin");
      const files = req.files as fileType;
      const theme = files["theme"][0];
      const images = files["images"];
      const query = productModel.findOne({ slug });
      if (name && typeof name === "string") query.updateOne({ name });
      if (price && typeof price === "number") query.updateOne({ price });
      if (stocks && typeof stocks === "number") query.updateOne({ stocks });
      if (isAuthorized && status && typeof status === "string")
        query.updateOne({ status });
      if (theme) query.updateOne({ theme: theme.path });
      if (images) query.updateOne({ images: images.map((img) => img.path) });
      const fetchUpdateProductResponse = await query.exec();

      if (!fetchUpdateProductResponse)
        throw new HttpException(500, "Can not update product");

      return res.status(200).json({
        message: "Product updated",
        data: fetchUpdateProductResponse.id,
      });
    } catch (err) {
      next(err);
    }
  };

  public likeProduct = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
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
  };

  public createProduct = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const user = req.user as userType;
      const { name, price, stocks, promotion } = req.body;
      const files = req.files as fileType;
      const theme = files["theme"][0];
      const images = files["images"]
        ? files["images"].map((img) => img.path)
        : null;

      const slug = slugify(name, { lower: true, trim: true, replacement: "_" });

      const fetchCreateProductResponse = await productModel.create({
        name,
        slug,
        theme,
        images,
        price,
        stocks,
        promotion,
      });

      if (!fetchCreateProductResponse)
        throw new HttpException(500, "Can not create product");

      return res.status(200).json({
        message: "Product created",
        data: fetchCreateProductResponse.id,
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteProduct = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;
      const fetchDeleteProductResponse = await productModel.findOneAndDelete({
        slug,
      });

      if (!fetchDeleteProductResponse)
        throw new HttpException(500, "Can not delete product");

      return res.status(200).json({
        message: "Product deleted",
        data: fetchDeleteProductResponse.id,
      });
    } catch (err) {
      next(err);
    }
  };

  public addPromotionToProduct = async (
    req: IRequestWithUser,
    res: Response<IResponseData>,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;
      const { promotionId } = req.body;

      const fetchPromotionResponse = await promotionModel.findById(promotionId);

      if (!fetchPromotionResponse)
        throw new HttpException(404, "Can not find promotion to add");

      const fetchUpdateProductResponse = await productModel.findOneAndUpdate(
        { slug },
        { $set: { promotion: fetchPromotionResponse.id } }
      );

      if (!fetchUpdateProductResponse)
        throw new HttpException(404, "Can not find product to add promotion");

      return res.status(200).json({
        message: "Promotion added to product",
        data: {
          product: fetchUpdateProductResponse.id,
          promotion: fetchPromotionResponse.id,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  private checkUserLiked = (
    documents: productType | productType[],
    userId?: string
  ) => {
    if (!userId) return documents;

    const check = (document: productType) => {
      const isLiked = document.ratings.some((id: any) => {
        return id.toString() === userId;
      });

      if (isLiked) return { ...document.toObject(), userLiked: true };
      return document;
    };

    if (Array.isArray(documents)) return documents.map(check);
    return check(documents);
  };
}
