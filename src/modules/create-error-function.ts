import logger from "../modules/create-logger.js";

import type {
  NextFunction,
  Request,
  Response,
} from "express";

export const handleErrorFunction = (fn: (req: Request, res: Response) => Promise<unknown>) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Promise.resolve(fn(req, res));
    if (process.env["NODE_ENV"] !== "production") logger.log("info", `${req.method} ${req.url} - ${res.statusCode}`);
  }
  catch (error) {
    if (process.env["NODE_ENV"] !== "production") logger.log("info", `${req.method} ${req.url} - 500 - Internal Server Error ${error}`);
    next(error);
  }
};
