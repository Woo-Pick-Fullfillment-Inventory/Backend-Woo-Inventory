import { ERRORS } from "../../../constants/error.constant.js";
import { FIRESTORE_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";

import type { ProductsCategoriesFirestoreType } from "../index.js";

export const batchWriteProductsCategoriesFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (categories: ProductsCategoriesFirestoreType, userId: string): Promise<void> => {
    if (categories.length > FIRESTORE_ALLOWED_BATCH_SIZE) throw new Error(ERRORS.BATCH_SIZE_EXCEEDED);
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
