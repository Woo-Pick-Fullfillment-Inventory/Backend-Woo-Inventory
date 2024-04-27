import { Type } from "@sinclair/typebox";

import { ImageWooSchema } from "../index.js";

import type { Static } from "@sinclair/typebox";

export const ProductWooSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  sku: Type.String(),
  slug: Type.String(),
  categories: Type.Array(
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
      slug: Type.String(),
    }),
  ),
  images: Type.Array(ImageWooSchema),
  price: Type.String(),
  regular_price: Type.String(),
  sale_price: Type.String(),
  stock_quantity: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
});

export type ProductWooType = Static<typeof ProductWooSchema>;

export const ProductsWooSchema = Type.Array(ProductWooSchema);

export type ProductsWooType = Static<typeof ProductsWooSchema>;
