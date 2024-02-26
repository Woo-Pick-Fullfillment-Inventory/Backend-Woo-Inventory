import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import logger from "./create-logger.js";
dotenv.config();

export const createVerifyBasicAuthHeaderToken = (
  jwtToken: string,
): string | undefined => {
  const token = jwtToken.split(" ")[1];
  if (!token) {
    logger.log("error", "no authorization token");
    return undefined;
  }
  if (!process.env["JWT_SECRET"]) {
    logger.log("error", `JWT_SECRET ${process.env["JWT_SECRET"]} is not defined`);
    return undefined;
  }
  const decodedToken = jwt.verify(token, process.env["JWT_SECRET"]) as {
    userId: string;
  };
  return decodedToken.userId;
};
