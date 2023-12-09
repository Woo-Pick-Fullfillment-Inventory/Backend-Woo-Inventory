import assert from "node:assert";

import database from "./index.js";

type UserModel = {
    app_user_id: string;
    woo_user_id: string;
  };

export async function insertAppUserToWooUser(user: UserModel): Promise<boolean> {
  try {
    const result = await database.table("app_users_to_woo_users").insert({
      app_user_id: user.app_user_id,
      woo_user_id: user.woo_user_id,
    });
    assert (result.length === 1, "Expected exactly one row to be affected");
    return result.length === 1;
  } catch (error) {
    return false;
  }
}