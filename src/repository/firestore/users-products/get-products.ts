import type {
  ProductFireStoreAttributeType,
  ProductsFireStoreType,
} from "../models/index.js";

type GetProductsInputType = {
  userId: string;
  field: ProductFireStoreAttributeType;
  direction: "asc" | "desc";
  limit: number;
};

export type ProductsFireStorePaginationType = {
  lastProduct: number | string | undefined;
  products: ProductsFireStoreType | [];
}
// todo: type check
export const getProductsFactory = (
  firestoreClient: FirebaseFirestore.Firestore,
) => {
  return ({
    userId,
    field,
    direction,
    limit,
  }: GetProductsInputType) => {
    return async (lastProductFromPrevious?: string | number): Promise<ProductsFireStorePaginationType> => {
      let query = firestoreClient
        .collection("users-products")
        .doc(`users-${userId}-products`)
        .collection("products")
        .orderBy(field, direction)
        .limit(limit);

      if (lastProductFromPrevious) {
        query = query.startAfter(lastProductFromPrevious);
      }

      const snapshot = await query.get();
      const products = snapshot.docs.map((doc) => doc.data()) as ProductsFireStoreType;

      const lastProduct = snapshot.docs[snapshot.docs.length - 1];
      return {
        lastProduct: lastProduct ? lastProduct.data()[field] : undefined,
        products: products,
      };
    };
  };
};
