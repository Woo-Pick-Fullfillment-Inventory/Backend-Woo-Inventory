import bodyParser from "body-parser";
import config from "config";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";

import authRouter from "./business/authentication/index.js";
import { database } from "../src/repository/postgres/index.js";
import webhookRouter from "../src/webhook/index.js";

import type {
  Express,
  NextFunction,
  Request,
  Response,
} from "express";

dotenv.config();

const app: Express = express();

const PORT = config.get<string>("SERVICE_PORT") || 3000;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/webhook", webhookRouter);
app.use("/api/v1", authRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("hello world");
});

app.get("/test-db", async (_req: Request, res: Response) => {
  try {
    const queryResult = await database.query("SELECT * FROM app_users");
    res.json(queryResult.rows);
  } catch (error) {
    console.error("Error running query", error);
    res.status(500).json({ error: error });
  }
});

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
