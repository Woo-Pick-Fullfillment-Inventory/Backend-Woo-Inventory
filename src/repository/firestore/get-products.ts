import type {
  ProductFireStoreAttributeType,
  ProductsFireStoreType,
} from "./models/index.js";

type GetProductsInputType = {
  userId: string;
  productAttribute: ProductFireStoreAttributeType;
  direction: "asc" | "desc";
};

export const getProductsFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return async ({
    userId,
    productAttribute,
    direction,
  }: GetProductsInputType): Promise<ProductsFireStoreType> => {
    const snapshot = await firestoreClient
      .collection("users-products")
      .doc(`users-${userId}-products`)
      .collection("products")
      .orderBy(productAttribute, direction)
      .get();
    return snapshot.docs.map((doc) => doc.data()) as ProductsFireStoreType;
  };
};
