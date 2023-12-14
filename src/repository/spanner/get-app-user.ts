import { fromJsonArrayToObject } from "../../util/fromJsonArrayToObject.js";

import type { SpannerClientWooAppUsers } from "./index.js";

type AppUserSpannerType = {
  app_user_id: string;
  app_email: string;
  app_password: string;
  app_url: string;
  authenticated: boolean;
};

const isResultAppUserSpannerType = (result: unknown): result is AppUserSpannerType => result!== undefined;

export const getAppUserByEmailFactory = (spanner: SpannerClientWooAppUsers) => {
  return async (email: string): Promise<AppUserSpannerType | undefined> => {
    const sqlQuery = "SELECT * FROM app_users WHERE app_email = @email";

    const params = { email };

    const [ rows ] = await spanner.database.run({
      sql: sqlQuery,
      params,
    });
    const appUser = fromJsonArrayToObject(rows);
    if (appUser === undefined) return undefined;
    if (!isResultAppUserSpannerType(appUser)) return undefined;
    return appUser;
  };
};