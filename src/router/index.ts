import express, { Router } from "express";
import oauth from "./oauth";
const AppRouter: Router = express.Router();

AppRouter.use("/auth", oauth);

export default AppRouter;
