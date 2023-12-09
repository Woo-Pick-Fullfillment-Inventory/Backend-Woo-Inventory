import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";

import authRouter from "./business/authentication/index.js";
import { getAllAppUser } from "./repository/spanner/get-app-user.js";
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

app.get("/health", async (_req: Request, res: Response) => {
  try {
    const users = await getAllAppUser();
    return res.status(200).json(users);
  }
  catch (error) {
    return res.status(500).json("hehe");
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.send("This is the backend service of Woo Pick Inventory");
});

const server = app.listen(PORT, () => console.log(`Running on ${PORT}`));
server.setTimeout(0); // Set the timeout to 60 seconds (adjust as needed)

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});
