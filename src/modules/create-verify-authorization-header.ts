import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { ERRORS } from "../constants/error.constant.js";

dotenv.config();

export const verifyAuthorizationHeader = (
  authorizationHeader: string | undefined,
): string => {
  if (!authorizationHeader) throw new Error(ERRORS.NO_AUTHORIZATION_HEADER);

  const token = authorizationHeader.split(" ")[1];
  if (!token)
    throw new Error(ERRORS.NO_TOKEN_FOUND);

  return (
    jwt.verify(token, process.env["JWT_SECRET"] as string) as {
      user_id: string;
    }
  ).user_id;
};
