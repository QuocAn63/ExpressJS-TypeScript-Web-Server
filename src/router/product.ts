import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import ProductController from "../controllers/product";
import authorizationMiddleware from "../middlewares/auth.middleware";

export default class ProductRoute implements Routes {
  public isApiPath = true;
  public path = "/products";
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.patch(
      "/:slug/like",
      authorizationMiddleware("user", "admin"),
      this.productController.likeProduct
    );
    this.router.get(
      "/",
      //   authorizationMiddleware("user", "admin"),
      this.productController.getProducts
    );
  }
}
