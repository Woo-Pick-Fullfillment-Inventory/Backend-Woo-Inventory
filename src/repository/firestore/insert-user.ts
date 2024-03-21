import type { UserFireStoreType } from "./models/user.type.js";

export const insertUserFactory = (firestoreClient: FirebaseFirestore.Firestore) => {
  return async (user: UserFireStoreType): Promise<void> => {
    await firestoreClient.collection("users").doc(user.user_id).set(user);
    console.log("User inserted");
  };
};