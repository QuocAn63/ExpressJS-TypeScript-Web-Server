import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import AppRouter from "./router";

require("dotenv").config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("tiny"));

app.use("/api", AppRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
