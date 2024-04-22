import type { UserUpdateAttributeType } from "../index.js";

// TODO: add type validation
export const updateUserFactory = (firestoreClient: FirebaseFirestore.Firestore) => {
  return (userAttribute: UserUpdateAttributeType) => {
    return async (userId: string, value: string | boolean): Promise<void> => {
      const userRef = firestoreClient.collection("users").doc(userId);
      await userRef.update({ [userAttribute]: value });
    };
  };
};