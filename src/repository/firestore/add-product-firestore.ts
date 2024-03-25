import type { ProductType } from "../woo-api/models/products.type.js";

export const insertProductFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (product: ProductType, userId: string): Promise<void> => {
    await firestoreClient
      .collection("users-products")
      .doc(`users-${userId}-products`)
      .collection("products")
      .doc(product.id.toString())
      .set(product);
  };
};
