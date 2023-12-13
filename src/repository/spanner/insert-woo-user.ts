import assert from "node:assert";

import database from "./index.js";

type UserModel = {
    woo_user_id: string;
    woo_token: string;
    woo_secret: string;
  };

export async function insertWooUser(user: UserModel): Promise<boolean> {
  const result = await database.table("woo_users").insert({
    woo_user_id: user.woo_user_id,
    woo_token: user.woo_token,
    woo_secret: user.woo_secret,
  });
  assert (result.length === 1, "Expected exactly one row to be affected");
  return true;
}