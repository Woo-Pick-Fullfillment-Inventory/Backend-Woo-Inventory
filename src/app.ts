import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";

import authRouter from "./business/authentication/index.js";
import fileRouter from "./business/files/index.js";
import orderRouter from "./business/orders/index.js";
import productRouter from "./business/products/index.js";
import webhookRouter from "./webhook/index.js";

import type {
  Express,
  NextFunction,
  Request,
  Response,
} from "express";

dotenv.config();

const app: Express = express();

// TODO: add cors

// TODO: add log middleware

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(webhookRouter);
app.use(authRouter);
app.use(productRouter);
app.use(fileRouter);
app.use(orderRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("This is the backend service of Woo Pick Inventory!");
});

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

export default app;
