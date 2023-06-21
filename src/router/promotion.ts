import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import PromotionController from "../controllers/promotion";
import authorizationMiddleware from "../middlewares/auth.middleware";
import bodyValidator from "../validations";
import validationMiddleware from "../middlewares/validate.middleware";

export default class PromotionRoute implements Routes {
  public isApiPath = true;
  public path = "/promotions";
  public router = Router();
  private promotionController = new PromotionController();

  public constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(
      "/",
      authorizationMiddleware(false, "admin"),
      bodyValidator.promotionValidationRules(
        "title",
        "description",
        "amount",
        "percentage",
        "status"
      ),
      validationMiddleware,
      this.promotionController.createPromotion
    );
    this.router.get(
      "/",
      authorizationMiddleware(false, "admin"),
      this.promotionController.getPromotions
    );
  };
}
