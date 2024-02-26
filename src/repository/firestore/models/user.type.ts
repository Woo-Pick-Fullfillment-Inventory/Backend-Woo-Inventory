export type UserAttributeType = "user_id" | "email" | "username";

type AuthenticationMethodType = "woo_credentials" | "woo_token";

export type UserFireStoreType = {
  user_id: string;
  email: string;
  username: string;
  password: string;
  store: {
    app_url: string;
  };
  woo_credentials: {
    token: string;
    secret: string;
  };
  authentication: {
    method: AuthenticationMethodType;
    isAuthorized: boolean;
  };
};