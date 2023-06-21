import { Router } from "express";
import { AuthController } from "../controllers/authenticate";
import { Routes } from "../interfaces/routes.interface";
import bodyValidator from "../validations";
import validationMiddleware from "../middlewares/validate.middleware";

/**
 * @swagger
 * /example:
 *      post:
 *          summary: Send the text to the server
 *          tags:
 *              - ExampleEndpoints
 *          description: Send a message to the server and get a response added to the original text.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              responseText:
 *                                  type: string
 *                                  example: This is some example string! This is an endpoint
 *          responses:
 *              201:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  text:
 *                                      type: string
 *                                      example: This is some example string!
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */

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

    this.router.post(
      "/register",
      bodyValidator.authValidationRules(
        "username",
        "password",
        "passwordconfirm"
      ),
      validationMiddleware,
      this.authController.register
    );
    this.router.post(
      "/token",
      bodyValidator.authValidationRules("token"),
      validationMiddleware,
      this.authController.refreshAccessToken
    );
  }
}

const route = new AuthRoute();
