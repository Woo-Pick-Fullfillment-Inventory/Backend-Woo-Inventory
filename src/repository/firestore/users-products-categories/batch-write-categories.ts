import type { ProductsCategoriesType } from "../../woo-api/models/products.type.js";

export const batchWriteProductsCategoriesFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (categories: ProductsCategoriesType, userId: string): Promise<void> => {
    if (categories.length > 100) throw new Error("Batch write limit exceeded");
    const batch = firestoreClient.batch();
    categories.forEach((category) => {
      const productRef = firestoreClient
        .collection("users-products-categories")
        .doc(`users-${userId}-products-categories`)
        .collection("products-categories")
        .doc(category.id.toString());
      batch.set(productRef, category);
    });
    await batch.commit();
  };
};
