import { ERRORS } from "../../../constants/error.constant.js";
import { FIRESTORE_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";

import type { ProductsFirestoreInputType } from "../index.js";

export const batchWriteProductsFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (products: ProductsFirestoreInputType, userId: string): Promise<void> => {
    if (products.length > FIRESTORE_ALLOWED_BATCH_SIZE) throw new Error(ERRORS.BATCH_SIZE_EXCEEDED);
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
