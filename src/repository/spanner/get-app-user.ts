import { assert } from "node:console";

import database from "./index.js";

type AppUser = {
  app_user_id: string;
  app_username: string;
  app_email: string;
  app_password: string;
  app_url: string;
  authenticated: boolean;
};

export async function getExistingAppUserByEmail(email: string): Promise<boolean> {
  const sqlQuery = "SELECT * FROM app_users WHERE app_email = @email";

  const params = { email };

  const [ rows ] = await database.run({
    sql: sqlQuery,
    params,
  });
  return rows.length === 0 ? true : false;
}

export async function getExistingAppUserByEmailandPassword(email: string, password: string): Promise<string | undefined> {
  const sqlQuery = "SELECT * FROM app_users WHERE app_email = @email and app_password = @password";

  const params = {
    email,
    password,
  };

  const [ rows ] = await database.run({
    sql: sqlQuery,
    params,
  });
  const result: AppUser[] = rows as AppUser[];
  assert(result.length === 1, "expect one user with this email and password");
  if (result[0] === undefined) return undefined;
  return result[0].app_user_id;
}

export async function getExistingAppUserByUsernamelandPassword(username: string, password: string): Promise<string | undefined> {
  const sqlQuery = "SELECT * FROM app_users WHERE app_username = @username and app_password = @password";

  const params = {
    username,
    password,
  };

  const [ rows ] = await database.run({
    sql: sqlQuery,
    params,
  });
  const result: AppUser[] = rows as AppUser[];
  assert(result.length === 1, "expect one user with this username and password");
  if (result[0] === undefined) return undefined;
  return result[0].app_user_id;
}