import type { ProductType } from "../woo-api/models/products.type.js";

export const insertProductFactory = (firestoreClient: FirebaseFirestore.Firestore) => {
  return async (product: ProductType): Promise<void> => {
    await firestoreClient.collection("products").doc(product.id).set(product);
  };
};
