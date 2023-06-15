import { Request } from "express";
import { userType } from "../models/user";

export interface IRequestWithUser extends Request {
  user?: userType;
  loginMethod?: "google" | "github";
}
