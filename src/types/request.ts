import { Request } from "express";
import { userType } from "../models/user";

export interface RequestWithUser extends Request {
  user: userType;
  loginMethod?: "google" | "github";
}
