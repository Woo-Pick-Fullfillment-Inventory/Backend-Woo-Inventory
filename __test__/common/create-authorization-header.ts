import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const secret = process.env["JWT_SECRET"] || "secret";

export const createAuthorizationHeader = (userId: string): string => {
  return `Bearer ${jwt.sign({ userId }, secret)}`;
};
