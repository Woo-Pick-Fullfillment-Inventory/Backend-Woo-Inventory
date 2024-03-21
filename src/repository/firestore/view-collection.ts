export const viewCollectionFactory = (firestoreClient: FirebaseFirestore.Firestore) => {
  return async (collectionPath: string) => {
    const snapshot = await firestoreClient.collection(collectionPath).get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => doc.data());
  };
};
