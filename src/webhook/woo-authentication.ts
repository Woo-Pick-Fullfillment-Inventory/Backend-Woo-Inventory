/* import { randomUUID } from "crypto";
import { StatusCodes } from "http-status-codes";

import { validateTypeFactory } from "../modules/create-ajv-validator.js";
import { createErrorResponse } from "../modules/create-error-response.js";

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
    type: "/auth/woo-auth-failed",
    message: "invalid request",
  },
  databaseError: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/woo-auth-failed",
    message: "database error",
  },
};

// implement later
const wooAuthenticator = async (req: Request, res: Response) => {
  res.send("Webhook is listening...");
};

export default wooAuthenticator; */