import { StatusCodes } from "http-status-codes";
import { randomUUID } from "node:crypto";

import { databaseFactory } from "../../repository/postgres/index.js";
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
  databaseError: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/createURL-failed",
    title: "database error",
  },
};

const createUrl = async (req: Request, res: Response) => {
  if (!validateTypeFactory(req.body, createUrlRequestBodySchema)) {
    throw createErrorResponse(res, SERVICE_ERRORS.invalidRequest);
  }

  const isInserted = await databaseFactory.insertAppUser({
    app_user_id: randomUUID(),
    app_username: req.body.username,
    app_password: req.body.password,
    app_url: req.body.appURL,
  });

  if (!isInserted) throw createErrorResponse(res, SERVICE_ERRORS.databaseError);

  res.status(200).send({ url: "new-url" });
};

export default createUrl;
