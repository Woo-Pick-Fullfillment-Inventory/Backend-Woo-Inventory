import { StatusCodes } from "http-status-codes";
import { randomUUID } from "node:crypto";

import { getAxiosWithBasicAuth } from "../../modules/axios.js";
import { insertAppUser } from "../../repository/postgres/insert-app-user.js";
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
    "token",
  ],
  additionalProperties: false,
};

const SERVICE_ERRORS = {
  invalidRequest: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    title: "invalid request",
  },
  invalidToken: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    title: "invalid token",
  },
  databaseError: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    title: "database error",
  },
};

const signup = async (req: Request, res: Response) => {
  if (!validateTypeFactory(req.body, createUrlRequestBodySchema)) {
    throw createErrorResponse(res, SERVICE_ERRORS.invalidRequest);
  }

  const vaidateInputResult = await getAxiosWithBasicAuth(
    `${req.body.appURL}/wp-json/wc/v3/products`,
    `${Buffer.from(
      `${req.body.token.substring(0, 40)}:${req.body.token.substring(41, 81)}`,
    ).toString("base64")}`,
  );

  if (!vaidateInputResult) throw createErrorResponse(res, SERVICE_ERRORS.invalidToken);

  const isInserted = await insertAppUser({
    app_user_id: randomUUID(),
    app_username: req.body.username,
    app_password: req.body.password,
    app_url: req.body.appURL,
  });

  if (!isInserted) throw createErrorResponse(res, SERVICE_ERRORS.databaseError);

  res.status(200).send({ url: "new-url" });
};

export default signup;
