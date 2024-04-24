import type { AddProductFireStoreType } from "../index.js";

export const insertProductFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (
    product: AddProductFireStoreType,
    userId: string,
  ): Promise<void> => {
    await firestoreClient
      .collection("products")
      .doc(`users-${userId}`)
      .collection("users-products")
      .doc(product.id.toString())
      .set(product);
  };
};
