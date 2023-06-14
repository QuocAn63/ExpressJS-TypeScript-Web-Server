import express, { Router } from "express";
import {
  changePassword,
  handleFacebookLoginCallback,
  handleFacebookLoginRequest,
  handleGithubLoginCallback,
  handleGithubLoginRequest,
  handleGoogleLoginCallback,
  handleGoogleLoginRequest,
  login,
  regenerateToken,
  register,
} from "../../controllers/authenticate";
import { checkToken } from "../../middlewares/checkToken";
import validationChains from "../../validations";
import { Routes } from "../../types/routes.interface";

// const router = express.Router();

// router.get("/google/callback", handleGoogleLoginCallback, login);
// router.get("/github/callback", handleGithubLoginCallback, login);
// router.get("/facebook/callback", handleFacebookLoginCallback, login);

// router.get("/login/google", handleGoogleLoginRequest);
// router.get("/login/github", handleGithubLoginRequest);
// router.get("/login/facebook", handleFacebookLoginRequest);
// router.post(
//   "/login",
//   validationChains.authenticate("username", "password"),
//   login
// );

// router.post(
//   "/register",
//   validationChains.authenticate("username", "password", "passwordconfirm"),
//   register
// );
// router.put(
//   "/changepw",
//   validationChains.authenticate("password", "passwordconfirm", "newpassword"),
//   checkToken,
//   changePassword
// );
// router.post("/token", checkToken, regenerateToken);
// export default router;

export class AuthRoute implements Routes {
  public path = "/auth";
  public isApiPath = true;
  public router = Router();

  constructor() {
    this.router.get("/google/callback", handleGoogleLoginCallback, login);
    this.router.get("/github/callback", handleGithubLoginCallback, login);
    this.router.get("/facebook/callback", handleFacebookLoginCallback, login);

    this.router.get("/login/google", handleGoogleLoginRequest);
    this.router.get("/login/github", handleGithubLoginRequest);
    this.router.get("/login/facebook", handleFacebookLoginRequest);
    this.router.post(
      "/login",
      validationChains.authenticate("username", "password"),
      login
    );

    this.router.post(
      "/register",
      validationChains.authenticate("username", "password", "passwordconfirm"),
      register
    );
    this.router.put(
      "/changepw",
      validationChains.authenticate(
        "password",
        "passwordconfirm",
        "newpassword"
      ),
      checkToken,
      changePassword
    );
    this.router.post("/token", checkToken, regenerateToken);
  }
}
