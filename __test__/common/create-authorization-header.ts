import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const secret = process.env["JWT_SECRET"] || "secret";

export const createAuthorizationHeader = (user_id: string): string => {
  return `Bearer ${jwt.sign({ user_id }, secret)}`;
};
