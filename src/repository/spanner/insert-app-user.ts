import type { SpannerClientWooAppUsers } from ".";

type UserModel = {
  app_user_id: string;
  app_email: string;
  app_username: string;
  app_password: string;
  app_url: string;
  authenticated: boolean;
};
export const insertAppUserFactory = (spanner: SpannerClientWooAppUsers) => {
  return async (user: UserModel): Promise<boolean> => {
    const result = await spanner.database.table("app_users").insert({
      app_user_id: user.app_user_id,
      app_email: user.app_email,
      app_username: user.app_username,
      app_password: user.app_password,
      app_url: user.app_url,
      authenticated: user.authenticated,
    });
    if (result.length !== 1) return false;
    return true;
  };
};