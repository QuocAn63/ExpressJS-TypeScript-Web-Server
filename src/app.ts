import express from "express";
import { Routes } from "./interfaces/routes.interface";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler } from "./controllers/error";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(...routes: Routes[]) {
    dotenv.config();
    this.app = express();
    this.env = process.env.NODE_ENV || "development";
    this.port = process.env.PORT || 3001;

    this.initializeDatabase();
    this.initializeStaticPaths();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.intializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () =>
      console.log(`Server is running on port: ${this.port}`)
    );
  }

  private initialieViews() {
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "views"));
  }

  private initializeStaticPaths() {
    this.app.use(express.static("public"));
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "../public/uploads"))
    );
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private async initializeDatabase() {
    try {
      const connectionString = process.env.DATABASE_URI;

      if (!connectionString) throw Error("Connect to database failed");
      else {
        const { connection } = await mongoose.connect(connectionString);
        const dbName = connection.db.databaseName;
        console.log(`Connected to database ${dbName}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  private initializeRoutes(routes: Routes[]) {
    this.app.get("/", (req, res) => res.redirect("/docs"));
    routes.forEach((route) => {
      const routePath = route.isApiPath ? `/api${route.path}` : route.path;
      this.app.use(routePath, route.router);
    });
  }

  private initializeMiddlewares() {
    this.app.use(morgan("tiny"));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors({ origin: "http://localhost:3001" }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private intializeErrorHandling() {
    this.app.use(errorHandler);
  }
}
