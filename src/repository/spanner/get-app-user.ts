import database from "./index.js";

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
    return false;
  }
}

export async function getAllAppUser(): Promise<unknown> {
  try {
    const sqlQuery = "SELECT * FROM app_users";

    const [ rows ]= await database.run({ sql: sqlQuery });
    return rows;
  } catch (error) {
    return false;
  }
}