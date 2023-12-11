import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";

import authRouter from "./business/authentication/index.js";
import webhookRouter from "./webhook/index.js";

import type {
  Express,
  NextFunction,
  Request,
  Response,
} from "express";

dotenv.config();

const app: Express = express();

const PORT = process.env["SERVICE_PORT"] || 8080;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/webhook", webhookRouter);
app.use("/api/v1", authRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("This is the backend service of Woo Pick Inventory");
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(500));
});

// TODO: add cors