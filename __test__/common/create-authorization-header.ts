import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const createAuthorizationHeader = (id: string, shopType: string): string => {
  return `Bearer ${jwt.sign({
    user_id: id,
    shop_type: shopType,
  }, process.env["JWT_SECRET"] || "secret")}`;
};
