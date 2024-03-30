import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const ImageSchema = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

export const ProductSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  slug: Type.String(),
  categories: Type.Array(
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
      slug: Type.String(),
    }),
  ),
  images: Type.Array(ImageSchema),
  price: Type.String(),
  sku: Type.String(),
  stock_quantity: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
});

export type ProductFromWooType = Static<typeof ProductSchema>;

export const ProductsSchema = Type.Array(ProductSchema);

export type ProductsFromWooType = Static<typeof ProductsSchema>;

export type ProductType = {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock_quantity: number | null;
  images: {
    id: number;
    src: string;
  }[];
};

export type ProductsType = ProductType[];
