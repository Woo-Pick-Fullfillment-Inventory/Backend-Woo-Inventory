import logger from "../../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../../modules/create-response-type-guard.js";
import {
  ProductsCategoriesFirestoreSchema,
  type ProductsCategoriesFirestoreType,
} from "../index.js";

type GetProductsCategoriesInputType = {
  userId: string;
};

// todo: type check
export const getProductsCategoriesFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async ({ userId }: GetProductsCategoriesInputType): Promise<ProductsCategoriesFirestoreType> => {
    const query = firestoreClient
      .collection("categories")
      .doc(`users-${userId}`)
      .collection("users-categories");

    const snapshot = await query.get();

    const categories = snapshot.docs.map((doc) => doc.data());

    const isProductsCategoriesReturnFromFirestoreTypeValid = isResponseTypeTrue(
      ProductsCategoriesFirestoreSchema,
      categories,
      true,
    );

    if (!isProductsCategoriesReturnFromFirestoreTypeValid.isValid) {
      logger.log(
        "warn",
        `***ERROR*** invalid products categories response type  ${isProductsCategoriesReturnFromFirestoreTypeValid.errorMessage} **Expected** ${JSON.stringify(
          ProductsCategoriesFirestoreSchema,
        )} **RECEIVED** ${JSON.stringify(categories)}`,
      );
      throw new Error("Products Categories Firestore Type Not Expected");
    }

    return categories as ProductsCategoriesFirestoreType;
  };
};
