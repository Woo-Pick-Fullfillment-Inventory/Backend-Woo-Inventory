import logger from "../../../src/modules/create-logger.js";
import { isResponseTypeTrue } from "../../../src/modules/create-response-type-guard.js";
import {
  type ProductFireStoreAttributeType,
  ProductsFireStoreSchema,
  type ProductsFireStoreType,
} from "../../../src/repository/firestore/index.js";

type GetProductsInputType = {
  userId: string;
  field: ProductFireStoreAttributeType;
  direction: "asc" | "desc";
  limit: number;
};

type ProductsFireStorePaginationType = {
  lastProduct: number | string | null;
  products: ProductsFireStoreType | [];
};

export const getProductsFactoryEmulator = (
  firestoreEmulator: FirebaseFirestore.Firestore,
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
      let query = firestoreEmulator
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
