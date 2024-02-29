import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const Image = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

const Product = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  slug: Type.String(),
  categories: Type.Array(Type.Object({
    id: Type.Number(),
    name: Type.String(),
    slug: Type.String(),
  })),
  images: Type.Array(Image),
  price: Type.String(),
  sku: Type.String(),
  stock_quantity: Type.Number(),
});

export type ProductFromWooType = Static<typeof Product>;

const Products = Type.Array(Product);

export type ProductsFromWooType = Static<typeof Products>;

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
}

export type ProductsType = ProductType[];