import type { SpannerClientWooAppUsers } from ".";

type UserModel = {
    app_user_id: string;
    woo_user_id: string;
  };
export const insertAppUserToWooUserFactory = (spanner: SpannerClientWooAppUsers) => {
  return async (user: UserModel): Promise<boolean> => {
    const result = await spanner.database.table("app_users_to_woo_users").insert({
      app_user_id: user.app_user_id,
      woo_user_id: user.woo_user_id,
    });
    if (result.length !== 1) return false;
    return true;
  };
};