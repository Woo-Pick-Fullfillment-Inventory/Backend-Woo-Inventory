import assert from "node:assert";

import database from "./index.js";
import logger from "../../modules/logger.js";

type UserModel = {
    app_user_id: string;
    woo_user_id: string;
  };

export async function insertAppUserToWooUser(user: UserModel): Promise<boolean> {
  const query =
      "INSERT INTO app_users_to_woo_users (app_user_id,woo_user_id) VALUES ($1, $2)";
  const values = [
    user.app_user_id,
    user.woo_user_id,
  ];

  try {
    const result = await database.query(query, values);
    assert(result.rowCount === 1, "Expected exactly one row to be affected");
    return (result.rowCount === 1);
  } catch (error) {
    logger.error("insertAppUserToWooUser", error);
    return false;
  }
}