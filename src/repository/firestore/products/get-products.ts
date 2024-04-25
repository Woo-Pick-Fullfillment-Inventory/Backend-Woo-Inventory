import logger from "../../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../../modules/create-response-type-guard.js";
import { ProductsFireStoreSchema } from "../index.js";

import type {
  ProductFireStoreAttributeType,
  ProductsFireStoreType,
} from "../index.js";

type GetProductsInputType = {
  userId: string;
  field: ProductFireStoreAttributeType;
  direction: "asc" | "desc";
  limit: number;
};

export type ProductsFireStorePaginationType = {
  lastProduct: number | string | null;
  products: ProductsFireStoreType | [];
};

export const getProductsFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return ({
    userId,
    field,
    direction,
    limit,
  }: GetProductsInputType) => {
    return async (
      lastProductFromPrevious?: string | number,
    ): Promise<ProductsFireStorePaginationType> => {
      let query = firestoreClient
        .collection("products")
        .doc(`users-${userId}`)
        .collection("users-products")
        .orderBy(field, direction)
        .limit(limit);

      if (lastProductFromPrevious) {
        query = query.startAfter(lastProductFromPrevious);
      }

      const snapshot = await query.get();

      const products = snapshot.docs.map((doc) => doc.data());
      const isProductsReturnFromFirestoreTypeValid = isResponseTypeTrue(
        ProductsFireStoreSchema,
        products,
        true,
      );
      if (!isProductsReturnFromFirestoreTypeValid.isValid) {
        logger.log(
          "warn",
          `***ERROR*** invalid products response type  ${isProductsReturnFromFirestoreTypeValid.errorMessage} **Expected** ${JSON.stringify(
            ProductsFireStoreSchema,
          )} **RECEIVED** ${JSON.stringify(products)}`,
        );
        throw new Error("Products Firestore Type Not Expected");
      }

      return {
        lastProduct:
          snapshot.docs.length > 0 && snapshot.docs[snapshot.docs.length - 1]
            // eslint-disable-next-line
            ? snapshot.docs[snapshot.docs.length - 1]!.data()[field]
            : null,
        products: products as ProductsFireStoreType,
      };
    };
  };
};