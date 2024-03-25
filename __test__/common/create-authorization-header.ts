import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const createAuthorizationHeader = (userId: string): string => {
  return `Bearer ${jwt.sign({ userId }, process.env["JWT_SECRET"] as string)}`;
};