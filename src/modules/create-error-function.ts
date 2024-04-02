import logger from "../modules/create-logger.js";

import type {
  NextFunction,
  Request,
  Response,
} from "express";

export const handleErrorFunction =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await Promise.resolve(fn(req, res));
        if (process.env["NODE_ENV"] !== "production")
          logger.log("info", `${req.method} ${req.url} - ${res.statusCode}`);
      } catch (error: Error | unknown) {
        if (process.env["NODE_ENV"] !== "production")
          logger.log(
            "info",
            `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** ${error}`,
          );
        next(error);
      }
    };
