import assert from "node:assert";

import database from "./index.js";
import logger from "../../modules/logger.js";

type UserModel = {
    woo_user_id: string;
    woo_token: string;
    woo_secret: string;
  };

export async function insertWooUser(user: UserModel): Promise<boolean> {
  const query =
      "INSERT INTO woo_users (woo_user_id, woo_token, woo_secret) VALUES ($1, $2, $3)";
  const values = [
    user.woo_user_id,
    user.woo_token,
    user.woo_secret,
  ];

  try {
    const result = await database.query(query, values);
    assert(result.rowCount === 1, "Expected exactly one row to be affected");
    return (result.rowCount === 1);
  } catch (error) {
    logger.error("insertWooUser", error);
    return false;
  }
}
