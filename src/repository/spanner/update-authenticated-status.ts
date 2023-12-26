import type { SpannerClientWooAppUsers } from "./index.js";

export const updateAuthenticatedStatusFactory = (spanner: SpannerClientWooAppUsers) => {
  return async (appUserId: string, isAuthenticated: boolean): Promise<boolean> => {
    const query = "UPDATE app_users SET authenticated = @isAuthenticated WHERE app_user_id = @appUserId";
    const params = {
      isAuthenticated: isAuthenticated,
      appUserId: appUserId,
    };
    const [ result ] = await spanner.database.run({
      sql: query,
      params,
    });

    if (result.length !== 1) return false;
    return true;
  };
};