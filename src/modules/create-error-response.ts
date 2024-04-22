import type { Response } from "express";

type ErrorResponseType = {
  statusCode: number;
  type: string;
  message: string;
};

export const createErrorResponse = (res: Response, config: ErrorResponseType) =>
  res.status(config.statusCode).json({
    type: config.type,
    message: config.message,
  });
