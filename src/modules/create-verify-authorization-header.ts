import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {
  NoAuthorizedHeader,
  TokenNotFoundInHeaderError,
} from "../constants/error/header-error.constant.js";

import type { ShopType } from "../repository/mongo/index.js";

dotenv.config();

type JwtTokenType = {
  user_id: string;
  shop_type: ShopType;
};

export const verifyAuthorizationHeader = (
  authorizationHeader: string | undefined,
): JwtTokenType => {
  if (!authorizationHeader) throw new NoAuthorizedHeader();

  const token = authorizationHeader.split(" ")[1];
  if (!token) throw new TokenNotFoundInHeaderError();

  return jwt.verify(token, process.env["JWT_SECRET"] as string) as {
    user_id: string;
    shop_type: ShopType;
  };
};
