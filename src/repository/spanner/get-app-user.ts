import database from "./index.js";
import logger from "../../modules/logger.js";

export async function getAppUser(email: string): Promise<boolean> {
  try {
    const sqlQuery = "SELECT * FROM app_users WHERE app_email = @email";

    const params = { email };

    const [ rows ] = await database.run({
      sql: sqlQuery,
      params,
    });
    return rows.length === 1;
  } catch (error) {
    logger.error("getAppUser with email and username", error);
    return false;
  }
}