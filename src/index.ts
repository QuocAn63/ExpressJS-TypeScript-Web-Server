import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import appRouter from "./router/index";
import chalk from "chalk";
import dbConnector from "./util/database/dbConnector";
import path from "path";

require("dotenv").config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("tiny"));

appRouter(app);

dbConnector();

app.listen(port, () => {
  console.log(
    chalk.bgMagentaBright(
      `[SERVER] Running and listening at http://localhost:${port}`
    )
  );
});
