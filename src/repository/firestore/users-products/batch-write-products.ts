import type { ProductsType } from "../../woo-api/models/products.type.js";

export const batchWriteProductsFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (products: ProductsType, userId: string): Promise<void> => {
    if (products.length > 100) throw new Error("Batch write limit exceeded");
    const batch = firestoreClient.batch();
    products.forEach((product) => {
      const productRef = firestoreClient
        .collection("users-products")
        .doc(`users-${userId}-products`)
        .collection("products")
        .doc(product.id.toString());
      batch.set(productRef, product);
    });
    await batch.commit();
  };
};
