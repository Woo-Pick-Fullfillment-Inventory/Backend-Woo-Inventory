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
    logger.log("info", `${req.method} ${req.url} - ${res.statusCode}`);
  }
  catch (error) {
    logger.log("info", `${req.method} ${req.url} - 500 - Internal Server Error`);
    next(error);
  }
};
