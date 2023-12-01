import assert from "assert";

import database from "./index.js";

export async function updateAuthenticatedStatus(appUserId: string, isAuthenticated: boolean): Promise<boolean> {
  const query = "UPDATE app_users SET authenticated = $1 WHERE app_user_id = $2";
  const values = [
    isAuthenticated,
    appUserId,
  ];

  try {
    const result = await database.query(query, values);
    assert(result.rowCount === 1, "Expected exactly one row to be affected");
    return (result.rowCount === 1);
  } catch (error) {
    return false;
  }
}