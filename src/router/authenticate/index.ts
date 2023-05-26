import express, { Request, Response } from "express";
import {
  handleGoogleLoginCallback,
  handleGoogleLoginRequest,
} from "../../controllers/authenticate";

const router = express.Router();

router.get("/google/callback", handleGoogleLoginCallback);

router.get("/login/google", handleGoogleLoginRequest);
router.post("/login", (req: Request, res: Response) => {
  return res.send("You accessed login route");
});

router.post("/register", (req: Request, res: Response) => {
  return res.send("You accessed register route");
});

export default router;
