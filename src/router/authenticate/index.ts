import express from "express";
import {
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

const router = express.Router();

router.get("/google/callback", handleGoogleLoginCallback, login);
router.get("/github/callback", handleGithubLoginCallback, login);
router.get("/facebook/callback", handleFacebookLoginCallback, login);

router.get("/login/google", handleGoogleLoginRequest);
router.get("/login/github", handleGithubLoginRequest);
router.get("/login/facebook", handleFacebookLoginRequest);
router.post("/login", login);

router.post("/register", register);
router.post("/token", checkToken, regenerateToken);
export default router;
