import database from "./index.js";
import { fromJsonArrayToObject } from "../../util/fromJsonArrayToObject.js";

type AppUserSpannerType = {
  app_user_id: string;
  app_email: string;
  app_password: string;
  app_url: string;
  authenticated: boolean;
};

const isResultAppUserSpannerType = (result: unknown): result is AppUserSpannerType => result!== undefined;

export async function getAppUserByEmail(email: string): Promise<AppUserSpannerType | undefined> {
  const sqlQuery = "SELECT * FROM app_users WHERE app_email = @email";

  const params = { email };

  const [ rows ] = await database.run({
    sql: sqlQuery,
    params,
  });
  const appUser = fromJsonArrayToObject(rows);
  if (appUser === undefined) return undefined;
  if (!isResultAppUserSpannerType(appUser)) return undefined;
  return appUser;
}