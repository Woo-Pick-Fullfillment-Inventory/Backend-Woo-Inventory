import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const productCategoriesFirestoreInputType = Type.Array(Type.Object({ id: Type.Number() }));

export type ProductCategoriesFirestoreInputType = Static<typeof productCategoriesFirestoreInputType>;

export const ProductsCategoryFirestoreSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  slug: Type.String(),
  parent: Type.Number(),
});

export const ProductsCategoriesFirestoreSchema = Type.Array(ProductsCategoryFirestoreSchema);

// type get back from firestore to validate
export type ProductsCategoryFirestoreType = Static<typeof ProductsCategoryFirestoreSchema>;

export type ProductsCategoriesFirestoreType = Static<typeof ProductsCategoriesFirestoreSchema>;

// type return to users
export type ProductsCategoryFireStoreClientType = {
    id: number;
    name: string;
    slug: string;
    parent: number;
};

export type ProductsCategoriesFireStoreClientType = ProductsCategoryFireStoreClientType[];