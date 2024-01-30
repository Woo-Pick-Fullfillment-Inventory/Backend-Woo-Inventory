type AuthenticationMethodType = "woo_credentials" | "woo_token";

type UserFireStoreType = {
  user_id: string;
  store: {
    app_url: string;
  }
  email: string;
  username: string;
  password: string;
  woo_credentials: {
    token: string;
    secret: string;
  }
  authentication: {
    method: AuthenticationMethodType;
    isAuthorized: boolean;
  }
};

export const insertUserFactory = (db: FirebaseFirestore.Firestore) => {
  return async (user: UserFireStoreType): Promise<void> => {
    await db.collection("users").doc(user.user_id).set(user);
  };
};