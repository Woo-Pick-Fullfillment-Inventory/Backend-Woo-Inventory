import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";

import authRouter from "./business/authentication/index.js";
import fileRouter from "./business/files/index.js";
import productRouter from "./business/products/index.js";
import logger from "./modules/create-logger.js";
import redisClient from "./repository/redis/index.js";
import webhookRouter from "./webhook/index.js";

import type {
  Express,
  NextFunction,
  Request,
  Response,
} from "express";

dotenv.config();

const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(webhookRouter);
app.use(authRouter);
app.use(productRouter);
app.use(fileRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("This is the backend service of Woo Pick Inventory!");
});

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

if (
  process.env["NODE_ENV"] !== "production" &&
  (!process.env["NODE_ENV"] ||
  !process.env["SERVICE_PORT"] ||
  !process.env["WOO_BASE_URL"] ||
  !process.env["JWT_SECRET"] ||
  !process.env["PROJECT_ID"] ||
  !process.env["PRODUCTS_IMAGES_BUCKET"] ||
  !process.env["FIRESTORE_EMULATOR_HOST"] ||
  !process.env["FIREBASE_STORAGE_EMULATOR_HOST"])
) {
  logger.log("error", "Some environment variables are missing or not set!");
  process.exit(1);
}

if (
  process.env["NODE_ENV"] === "production" &&
  (!process.env["SERVICE_PORT"] ||
    !process.env["JWT_SECRET"] ||
    !process.env["PROJECT_ID"] ||
    !process.env["PRODUCTS_IMAGES_BUCKET"])
) {
  logger.log("error", "Some environment variables are missing or not set for production!");
  logger.log("info", process.env);
  process.exit(1);
}

redisClient;

redisClient.set("key", "value");

app.listen(process.env["SERVICE_PORT"], () => {
  console.log(`Server is running on port ${process.env["SERVICE_PORT"]}`);
});

// TODO: add cors
