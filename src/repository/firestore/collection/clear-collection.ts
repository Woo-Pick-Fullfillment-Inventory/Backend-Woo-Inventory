export const clearCollectionFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (collectionPath: string): Promise<void> => {
    const collectionRef = firestoreClient.collection(collectionPath);
    const querySnapshot = await collectionRef.get();

    const batch = firestoreClient.batch();
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  };
};
