import logger from "./logger.js";

import type {
  NextFunction,
  Request,
  Response,
} from "express";

export const handleErrorFunction = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<unknown> => {
  return Promise.resolve(fn(req, res, next)).catch((error) => {
    logger.log("error", `Error in ${req.method} request ${ req.originalUrl || req.url}:`, error);
    res.sendStatus(500);
    next(error);
  });
};