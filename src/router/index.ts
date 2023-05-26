import express, { Express, Router } from "express";
import authenticateRoute from "./authenticate";
import todoRoute from "./todo";
import homeRoute from "./home";
const apiRouter: Router = express.Router();

const appRouter = (app: Express) => {
  apiRouter.use("/auth", authenticateRoute);

  // api routes
  app.use("/api", apiRouter);
  // view routes
  app.use("/todo", todoRoute);
  app.use("/", homeRoute);
};

export default appRouter;
