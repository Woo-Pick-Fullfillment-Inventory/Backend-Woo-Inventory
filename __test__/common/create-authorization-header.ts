import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const createAuthorizationHeader = (userId: string): string => {
  if (!process.env["JWT_SECRET"]) {
    throw new Error("no jwt secret found");
  }
  return `Bearer ${jwt.sign({ userId }, process.env["JWT_SECRET"])}`;
};