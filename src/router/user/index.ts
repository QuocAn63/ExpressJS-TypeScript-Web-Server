import { Router } from "express";
import { UserController } from "../../controllers/user";
import { Routes } from "../../interfaces/routes.interface";
import authorizationMiddleware from "../../middlewares/auth.middleware";
import uploadMiddleware from "../../middlewares/upload.middleware";

export default class UserRoute implements Routes {
  public isApiPath = true;
  public path = "/users";
  public router = Router();
  private userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.put(
      "/:username",
      authorizationMiddleware("admin", "user"),
      uploadMiddleware.single("avatar"),
      this.userController.updateUserInfo
    );
    this.router.patch(
      "/:username/changepw",
      authorizationMiddleware("admin", "user"),
      this.userController.changeUserPassword
    );
    this.router.get("/:username", this.userController.getUserByUsername);
    this.router.delete(
      "/:username",
      authorizationMiddleware("admin"),
      this.userController.deleteUser
    );
    this.router.get("/", this.userController.getUsers);
  }
}
