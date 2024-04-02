import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const verifyAuthorizationHeader = (
  authorizationHeader: string | undefined,
): string => {
  if (!authorizationHeader) throw new Error("no authorization header found");

  const token = authorizationHeader.split(" ")[1];
  if (!token || !process.env["JWT_SECRET"])
    throw new Error("no token or secret found");

  return (
    jwt.verify(token, process.env["JWT_SECRET"]) as {
      userId: string;
    }
  ).userId;
};
