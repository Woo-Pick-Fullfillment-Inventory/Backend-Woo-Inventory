import { firestoreClient } from "../../src/repository/firestore/index.js";

export const getCollectionDocuments = async (collectionPath: string) => {
  const snapshot = await firestoreClient
    .collection(collectionPath)
    .get();

  if (snapshot.empty) throw new Error("No matching documents");

  return snapshot.docs.map(doc => doc.data());
};