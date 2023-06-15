import { Router } from "express";
import { UserController } from "../../controllers/user";
import { Routes } from "../../interfaces/routes.interface";

// const router = express.Router();

// router.get("/users/:username", getUser);
// router.put("/users/:username");
// router.get("/users", getAllUsers);

export default class UserRoute implements Routes {
  public isApiPath = true;
  public path = "/users";
  public router = Router();
  private userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get("/:username", this.userController.getUserByUsername);
    this.router.get("/", this.userController.getUsers);
  }
}
