import { StatusCodes } from "http-status-codes";

import { validateTypeFactory } from "../../util/ajvValidator.js";
import { createErrorResponse } from "../../util/errorReponse.js";

import type {
  Request,
  Response,
} from "express";

const createUrlRequestBodySchema = {
  type: "object",
  properties: {
    appURL: { type: "string" },
    username: { type: "string" },
    password: { type: "string" },
  },
  required: [
    "appURL",
    "username",
    "password",
  ],
  additionalProperties: false,
};

const SERVICE_ERRORS = {
  invalidRequest: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/createURL-failed",
    title: "invalid request",
  },
};

const createUrl = (req: Request, res: Response) => {
  if (!validateTypeFactory(req.body, createUrlRequestBodySchema)) {
    throw createErrorResponse(res, SERVICE_ERRORS.invalidRequest);
  }

  res.status(200).send("create URL done");
};

export default createUrl;
