import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const ImageFromWooSchema = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

export const ProductFromWooSchema = Type.Object({
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
  images: Type.Array(ImageFromWooSchema),
  price: Type.String(),
  regular_price: Type.String(),
  sale_price: Type.String(),
  stock_quantity: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
  tax_status: Type.Union([
    Type.Literal("taxable"),
    Type.Literal("shipping"),
    Type.Literal("none"),
    Type.Literal(""),
  ]),
  tax_class: Type.Union([
    Type.Literal("standard"),
    Type.Literal("reduced-rate"),
    Type.Literal("zero-rate"),
    Type.Literal(""),
  ]),
});

export type ProductFromWooType = Static<typeof ProductFromWooSchema>;

export const ProductsFromWooSchema = Type.Array(ProductFromWooSchema);

export type ProductsFromWooType = Static<typeof ProductsFromWooSchema>;

// User receive this product type with id
export type ProductWooClientType = {
    id: number;
    name: string;
    sku: string;
    slug: string;
    categories: {
      id: number;
      name: string;
      slug: string;
    }[];
    price: string;
    regular_price: string;
    sale_price: string;
    stock_quantity: number | null;
    images: {
      id: number;
      src: string;
    }[];
    tax_status: "taxable" | "shipping" | "none" | "";
    tax_class: "standard" | "reduced-rate" | "zero-rate" | "";
}

export type ProductsWooClientType = ProductWooClientType[];
