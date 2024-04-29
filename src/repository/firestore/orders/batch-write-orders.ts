import { ERRORS } from "../../../constants/error.constant.js";
import { FIRESTORE_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";

import type { OrdersFirestoreInputType } from "../index.js";

export const batchWriteOrdersFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async (orders: OrdersFirestoreInputType, userId: string): Promise<void> => {
    if (orders.length > FIRESTORE_ALLOWED_BATCH_SIZE) throw new Error(ERRORS.BATCH_SIZE_EXCEEDED);
    const batch = firestoreClient.batch();
    orders.forEach((order) => {
      const productRef = firestoreClient
        .collection("orders")
        .doc(`users-${userId}`)
        .collection("users-orders")
        .doc(order.id.toString());
      batch.set(productRef, order);
    });
    await batch.commit();
  };
};
