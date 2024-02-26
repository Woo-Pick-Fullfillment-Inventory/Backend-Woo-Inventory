import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const Product = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  slug: Type.String(),
  categories: Type.Array(Type.Object({
    id: Type.Number(),
    name: Type.String(),
    slug: Type.String(),
  })),
  images: Type.Array(Type.Object({
    id: Type.Number(),
    src: Type.String(),
  })),
  price: Type.String(),
  sku: Type.String(),
});

export type ProductFromWooType = Static<typeof Product>;

const Products = Type.Array(Product);

export type ProductsFromWooType = Static<typeof Products>;

export type ProductType = {
    name: string;
    sku: string;
    price: string;
}

export type ProductsType = ProductType[];