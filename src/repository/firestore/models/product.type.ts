import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const ImageSchema = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

export const ProductFireStoreSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  sku: Type.String(),
  price: Type.String(),
  stock_quantity: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
  images: Type.Array(ImageSchema),
});

export const ProductsFireStoreSchema = Type.Array(ProductFireStoreSchema);

export type ProductFireStoreType = Static<typeof ProductFireStoreSchema>;

export type ProductsFireStoreType = ProductFireStoreType[];

export type ProductFireStoreAttributeType = "id" | "name" | "sku" | "price" | "stock_quantity";
