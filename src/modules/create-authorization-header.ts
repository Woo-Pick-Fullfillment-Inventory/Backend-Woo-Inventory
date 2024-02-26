import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import logger from "./create-logger.js";

dotenv.config();
export const createAuthorizationHeader = (userId: string): string => {
  if (!process.env["JWT_SECRET"]) {
    logger.log("error", `JWT_SECRET ${process.env["JWT_SECRET"]} is not defined`);
    throw new Error("not jwt secret found");
  }
  return `Bearer ${jwt.sign({ userId }, process.env["JWT_SECRET"])}`;
};