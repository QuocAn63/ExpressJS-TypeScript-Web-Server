import express, { Express, Router } from "express";
import authenticateRoute from "./authenticate";
import todoRoute from "./todo";
import homeRoute from "./home";
import { errorHandler } from "../controllers/error";
const apiRouter: Router = express.Router();

const appRouter = (app: Express) => {
  apiRouter.use("/auth", authenticateRoute);

  // api routes
  app.use("/api", apiRouter);
  // view routes
  app.use("/todo", todoRoute);
  app.use("/", homeRoute);
  app.use(errorHandler);
};

export default appRouter;
