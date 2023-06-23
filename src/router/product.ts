import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import ProductController from "../controllers/product";
import authorizationMiddleware from "../middlewares/auth.middleware";
import uploadMiddleware from "../middlewares/upload.middleware";
import bodyValidator from "../validations";
import validationMiddleware from "../middlewares/validate.middleware";

export default class ProductRoute implements Routes {
  public isApiPath = true;
  public path = "/products";
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(
      "/",
      authorizationMiddleware(false, "admin"),
      bodyValidator.productValidationRules(
        "name",
        "description",
        "price",
        "status",
        "stocks"
      ),
      validationMiddleware,
      uploadMiddleware.fields([
        { name: "theme", maxCount: 1 },
        { name: "images", maxCount: 5 },
      ]),
      this.productController.createProduct
    );
    this.router.patch(
      "/:slug/promotion",
      authorizationMiddleware(false, "admin"),
      this.productController.addPromotionToProduct
    );
    this.router.put(
      "/:slug",
      authorizationMiddleware(false, "admin"),
      bodyValidator.productValidationRules(
        "name",
        "description",
        "price",
        "status",
        "stocks"
      ),
      validationMiddleware,
      uploadMiddleware.fields([
        { name: "theme", maxCount: 1 },
        { name: "images", maxCount: 5 },
      ]),
      this.productController.updateProduct
    );
    this.router.patch(
      "/:slug/like",
      authorizationMiddleware(false, "user", "admin"),
      this.productController.likeProduct
    );
    this.router.get(
      "/:slug",
      authorizationMiddleware(true, "user", "admin"),
      this.productController.getProduct
    );
    this.router.get(
      "/",
      authorizationMiddleware(true, "user", "admin"),
      this.productController.getProducts
    );
  }
}
