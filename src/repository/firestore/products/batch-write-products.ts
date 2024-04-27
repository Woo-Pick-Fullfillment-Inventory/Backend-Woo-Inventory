import { ERRORS } from "../../../constants/error.js";
import { FIRESTORE_ALLOWED_BATCH_SIZE } from "../../../constants/products-categories.js";

import type { ProductsFirestoreInputType } from "../index.js";

export const batchWriteProductsFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (products: ProductsFirestoreInputType, userId: string): Promise<void> => {
    if (products.length > FIRESTORE_ALLOWED_BATCH_SIZE) throw new Error(ERRORS.BATCH_SIZE_EXCEEDED);
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
