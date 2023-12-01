import assert from "assert";

import database from "./index.js";

type UserModel = {
    app_user_id: string;
    app_username: string;
    app_password: string;
    app_url: string;
  };

export async function insertAppUser(user: UserModel): Promise<boolean> {
  const query =
      "INSERT INTO app_users (app_user_id, app_username, app_password, app_url) VALUES ($1, $2, $3, $4)";
  const values = [
    user.app_user_id,
    user.app_username,
    user.app_password,
    user.app_url,
  ];

  try {
    const result = await database.query(query, values);
    assert(result.rowCount === 1, "Expected exactly one row to be affected");
    return (result.rowCount === 1);
  } catch (error) {
    return false;
  }
}