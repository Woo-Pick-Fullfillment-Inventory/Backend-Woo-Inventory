import type { ProductsFireStoreType } from "../index.js";

export const batchWriteProductsFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (products: ProductsFireStoreType, userId: string): Promise<void> => {
    if (products.length > 100) throw new Error("Batch write limit exceeded");
    const batch = firestoreClient.batch();
    products.forEach((product) => {
      const productRef = firestoreClient
        .collection("products")
        .doc(`users-${userId}`)
        .collection("users-products")
        .doc(product.id.toString());
      batch.set(productRef, product);
    });
    await batch.commit();
  };
};
