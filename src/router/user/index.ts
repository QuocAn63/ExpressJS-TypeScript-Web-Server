import { Router } from "express";
import { UserController } from "../../controllers/user";
import { Routes } from "../../interfaces/routes.interface";
import { AuthorizationMiddleware } from "../../middlewares/auth.middleware";

export default class UserRoute implements Routes {
  public isApiPath = true;
  public path = "/users";
  public router = Router();
  private userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.patch(
      "/:username/changepw",
      AuthorizationMiddleware,
      this.userController.changeUserPassword
    );
    this.router.get("/:username", this.userController.getUserByUsername);
    this.router.get("/", this.userController.getUsers);
  }
}
