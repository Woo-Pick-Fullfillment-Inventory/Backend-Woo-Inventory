type UserAttributeType = "userId" | "email" | "username";

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

export const getUserByAttributeFactory = (db: FirebaseFirestore.Firestore) => {
  return async (userAttribute: UserAttributeType, value: string): Promise<UserFireStoreType> => {
    const snapshot = await db.collection("users").where(userAttribute, "==", value).get();

    if (!snapshot || !snapshot.docs[0] || !snapshot.docs[0].data()) {
      throw new Error("No User Found");
    }

    return snapshot.docs[0].data() as UserFireStoreType;
  };
};
