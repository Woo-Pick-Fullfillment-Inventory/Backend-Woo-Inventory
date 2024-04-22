import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const ImageSchema = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

export const ProductSchema = Type.Object({
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
  images: Type.Array(ImageSchema),
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

export type ProductFromWooType = Static<typeof ProductSchema>;

export const ProductsSchema = Type.Array(ProductSchema);

export type ProductsFromWooType = Static<typeof ProductsSchema>;

// User receive this product type with id
export type ProductType = {
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

export type ProductsType = ProductType[];

export const ProductsCategorySchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  slug: Type.String(),
  parent: Type.Number(),
  description: Type.String(),
  display: Type.Union([
    Type.Literal("default"),
    Type.Literal("products"),
    Type.Literal("subcategories"),
    Type.Literal("both"),
  ]),
  image: Type.Union([
    ImageSchema,
    Type.Null(),
  ]),
  menu_order: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
  count: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
});

export const ProductsCategoriesSchema = Type.Array(ProductsCategorySchema);

export type ProductsCategoryFromWooType = Static<typeof ProductsCategorySchema>;

export type ProductsCategoriesFromWooType = Static<typeof ProductsCategoriesSchema>;

export type ProductsCategoryType = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: "default" | "products" | "subcategories" | "both";
  image: {
    id: number;
    src: string;
  } | null;
  menu_order: number | null;
  count: number | null;
};

export type ProductsCategoriesType = ProductsCategoryType[];