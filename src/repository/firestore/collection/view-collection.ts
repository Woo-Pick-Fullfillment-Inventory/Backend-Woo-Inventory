export const viewCollectionFactory = (firestoreClient: FirebaseFirestore.Firestore) => {
  return async <T>(collectionPath: string): Promise<T[]> => {
    const snapshot = await firestoreClient.collection(collectionPath).get();
    return snapshot.docs.map(doc => doc.data()) as T[];
  };
};

export type ViewCollectionFunction = <T>(collectionPath: string) => Promise<T[]>;