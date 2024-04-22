import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const verifyAuthorizationHeader = (
  authorizationHeader: string | undefined,
): string => {
  if (!authorizationHeader) throw new Error("no authorization header found");

  const token = authorizationHeader.split(" ")[1];
  if (!token)
    throw new Error("no token found");

  return (
    jwt.verify(token, process.env["JWT_SECRET"] as string) as {
      userId: string;
    }
  ).userId;
};
