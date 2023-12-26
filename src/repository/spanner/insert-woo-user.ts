import type { SpannerClientWooAppUsers } from ".";

type UserModel = {
    woo_user_id: string;
    woo_token: string;
    woo_secret: string;
  };

export const insertWooUserFactory = (spanner: SpannerClientWooAppUsers) => {
  return async (user: UserModel): Promise<boolean> => {
    const result = await spanner.database.table("woo_users").insert({
      woo_user_id: user.woo_user_id,
      woo_token: user.woo_token,
      woo_secret: user.woo_secret,
    });
    if (result.length !== 1) return false;
    return true;
  };
};