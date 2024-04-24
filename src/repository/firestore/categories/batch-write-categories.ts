import type { ProductsCategoriesFirestoreType } from "../index.js";

export const batchWriteProductsCategoriesFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (categories: ProductsCategoriesFirestoreType, userId: string): Promise<void> => {
    if (categories.length > 100) throw new Error("Batch write limit exceeded");
    const batch = firestoreClient.batch();
    categories.forEach((category) => {
      const productRef = firestoreClient
        .collection("categories")
        .doc(`users-${userId}`)
        .collection("users-categories")
        .doc(category.id.toString());
      batch.set(productRef, category);
    });
    await batch.commit();
  };
};
