import { Request, Response } from "express";
import { google } from "googleapis";

export const oauth2Client = new google.auth.OAuth2(
  "743433801669-j169dda6jeac7uu97a1rgrpqev40jmhm.apps.googleusercontent.com",
  "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",
  "http://localhost:3001/api/auth/login"
);
let userCredential = null;

export const todoHome = (req: Request, res: Response) => {
  res.render("todo/index", { user: null, authMode: null });
};

export const todoLogin = (req: Request, res: Response) => {
  res.render("todo/index", { user: null, authMode: "login" });
};

export const todoRegister = (req: Request, res: Response) => {
  res.render("todo/index", { user: null, authMode: "register" });
};
