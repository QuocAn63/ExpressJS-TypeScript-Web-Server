import express, { Router, Request, Response } from "express";

const router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  return res.send("You accessed login route");
});

router.post("/register", (req: Request, res: Response) => {
  return res.send("You accessed register route");
});

export default router;
