import { Router } from "express";
import { AuthController } from "../../controllers/authenticate";
import { Routes } from "../../interfaces/routes.interface";
import bodyValidator from "../../validations";
import validationMiddleware from "../../middlewares/validate.middleware";

export default class AuthRoute implements Routes {
  public path = "/auth";
  public isApiPath = true;
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      "/google/callback",
      this.authController.handleGoogleCallback,
      this.authController.login
    );
    this.router.get(
      "/github/callback",
      this.authController.handleGithubCallback,
      this.authController.login
    );

    this.router.get(
      "/login/google",
      this.authController.requestLoginWithGoogle
    );
    this.router.get(
      "/login/github",
      this.authController.requestLoginWithGithub
    );
    this.router.post(
      "/login",
      bodyValidator.authValidationRules("username", "password"),
      validationMiddleware,
      this.authController.login
    );

    this.router.post("/register", this.authController.register);
    // this.router.post("/token", checkToken, regenerateToken);
  }
}

const route = new AuthRoute();
