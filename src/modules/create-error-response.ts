import type { Response } from "express";

 type ErrorResponseType = {
  statusCode: number;
  type: string;
  title: string;
};

export const createErrorResponse = (res: Response, config: ErrorResponseType) =>
  res.status(config.statusCode).json({
    type: config.type,
    title: config.title,
  });
