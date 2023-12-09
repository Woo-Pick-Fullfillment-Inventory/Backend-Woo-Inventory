import assert from "node:assert";

import database from "./index.js";

type UserModel = {
  app_user_id: string;
  app_email: string;
  app_username: string;
  app_password: string;
  app_url: string;
  authenticated: boolean;
};

export async function insertAppUser(user: UserModel): Promise<boolean> {
  try {
    const result = await database.table("app_users").insert({
      app_user_id: user.app_user_id,
      app_email: user.app_email,
      app_username: user.app_username,
      app_password: user.app_password,
      app_url: user.app_url,
      authenticated: user.authenticated,
    });
    assert (result.length === 1, "Expected exactly one row to be affected");
    return true;
  } catch (error) {
    return false;
  }
}
