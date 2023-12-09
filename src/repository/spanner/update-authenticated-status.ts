import assert from "assert";

import database from "./index.js";

export async function updateAuthenticatedStatus(appUserId: string, isAuthenticated: boolean): Promise<boolean> {
  const query = "UPDATE app_users SET authenticated = @isAuthenticated WHERE app_user_id = @appUserId";
  const params = {
    isAuthenticated: isAuthenticated,
    appUserId: appUserId,
  };

  try {
    const [ result ] = await database.run({
      sql: query,
      params,
    });

    const rowsAffected = result.length;
    assert(rowsAffected === 1, "Expected exactly one row to be affected");

    return true;
  } catch (error) {
    return false;
  }
}