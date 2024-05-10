import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {
  NoAuthorizedHeader,
  TokenNotFoundInHeaderError,
} from "../constants/error/header-error.constant";

dotenv.config();

export const verifyAuthorizationHeader = (
  authorizationHeader: string | undefined,
): string => {
  if (!authorizationHeader) throw new NoAuthorizedHeader();

  const token = authorizationHeader.split(" ")[1];
  if (!token)
    throw new TokenNotFoundInHeaderError();

  return (
    jwt.verify(token, process.env["JWT_SECRET"] as string) as {
      user_id: string;
    }
  ).user_id;
};
