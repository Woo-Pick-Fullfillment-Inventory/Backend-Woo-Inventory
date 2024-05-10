import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const secret = process.env["JWT_SECRET"] || "secret";

export const createAuthorizationHeader = (id: string): string => {
  return `Bearer ${jwt.sign({ id }, secret)}`;
};
