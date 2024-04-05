import type { AddProductFireStoreType } from "..";

export const insertProductFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (
    product: AddProductFireStoreType,
    userId: string,
  ): Promise<void> => {
    await firestoreClient
      .collection("users-products")
      .doc(`users-${userId}-products`)
      .collection("products")
      .doc(product.id.toString())
      .set(product);
  };
};
