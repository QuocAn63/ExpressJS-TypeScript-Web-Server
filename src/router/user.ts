import { Router } from "express";
import { UserController } from "../controllers/user";
import { Routes } from "../interfaces/routes.interface";
import authorizationMiddleware from "../middlewares/auth.middleware";
import uploadMiddleware from "../middlewares/upload.middleware";
import bodyValidator from "../validations";
import validationMiddleware from "../middlewares/validate.middleware";

export default class UserRoute implements Routes {
  public isApiPath = true;
  public path = "/users";
  public router = Router();
  private userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(
      "/profile",
      authorizationMiddleware(false, "user", "admin"),
      this.userController.getUserProfile
    );
    this.router.put(
      "/:username",
      authorizationMiddleware(false, "admin", "user"),
      bodyValidator.userValidationRules("name", "dob", "phonenumber", "gender"),
      validationMiddleware,
      uploadMiddleware.single("avatar"),
      this.userController.updateUserInfo
    );
    this.router.patch(
      "/:username/changepw",
      authorizationMiddleware(false, "admin", "user"),
      bodyValidator.authValidationRules(
        "password",
        "passwordconfirm",
        "newpassword"
      ),
      validationMiddleware,
      this.userController.changeUserPassword
    );
    this.router.get("/:username", this.userController.getUserByUsername);
    this.router.delete(
      "/:username",
      authorizationMiddleware(false, "admin"),
      this.userController.deleteUser
    );
    this.router.get("/", this.userController.getUsers);
  }
}
