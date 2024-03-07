export const updateUserLastLoginFactory = (firestoreClient: FirebaseFirestore.Firestore) => {
  return async (
    userId: string,
  ): Promise<void> => {
    const userRef = firestoreClient.collection("users").doc(userId);
    await userRef.update({ last_login: new Date().toISOString() });
  };
};

export const updateUserProductsSyncedFactory = (firestoreClient: FirebaseFirestore.Firestore) => {
  return async (
    userId: string,
  ): Promise<void> => {
    const userRef = firestoreClient.collection("users").doc(userId);
    await userRef.update({ are_products_synced: true });
  };
};