import { randomUUID } from "crypto";
import { StatusCodes } from "http-status-codes";

import { insertAppUserToWooUser } from "../repository/spanner/insert-app-user-to-woo-user.js";
import { insertWooUser } from "../repository/spanner/insert-woo-user.js";
import { updateAuthenticatedStatus } from "../repository/spanner/update-authenticated-status.js";
import { validateTypeFactory } from "../util/ajvValidator.js";
import { createErrorResponse } from "../util/errorReponse.js";

import type {
  Request,
  Response,
} from "express";

const wooWebHookSchema = {
  type: "object",
  properties: {
    key_id: { type: "number" },
    user_id: { type: "string" },
    consumer_key: { type: "string" },
    consumer_secret: { type: "string" },
    key_permissions: { type: "string" },
  },
  required: [
    "key_id",
    "user_id",
    "consumer_key",
    "consumer_secret",
    "key_permissions",
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

const wooAuthenticator = async (req: Request, res: Response) => {
  console.log("hello webhook ...");
  if (!validateTypeFactory(req.body, wooWebHookSchema)) {
    throw createErrorResponse(res, SERVICE_ERRORS.invalidRequest);
  }

  const wooUserId = randomUUID();
  const isInsertedWooUserToAppUser = await insertAppUserToWooUser({
    app_user_id: req.body.user_id,
    woo_user_id: wooUserId,
  });
  if (!isInsertedWooUserToAppUser) throw createErrorResponse(res, SERVICE_ERRORS.databaseError);

  const isInsertedWooUser = await insertWooUser({
    woo_user_id: wooUserId,
    woo_token: req.body.consumer_key,
    woo_secret: req.body.consumer_secret,
  });
  if (!isInsertedWooUser) throw createErrorResponse(res, SERVICE_ERRORS.databaseError);

  const isUpdated = await updateAuthenticatedStatus(req.body.user_id, true);
  if (!isUpdated) throw createErrorResponse(res, SERVICE_ERRORS.databaseError);

  res.send("Webhook is listening...");
};

export default wooAuthenticator;