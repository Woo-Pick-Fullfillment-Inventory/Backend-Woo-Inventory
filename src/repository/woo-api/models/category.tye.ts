import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const ImageFromWooSchema = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

export const ProductsCategoryFromWooSchema = Type.Object({
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
    ImageFromWooSchema,
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

export const ProductsCategoriesFromWooSchema = Type.Array(ProductsCategoryFromWooSchema);

export type ProductsCategoryFromWooType = Static<typeof ProductsCategoryFromWooSchema>;

export type ProductsCategoriesFromWooType = Static<
  typeof ProductsCategoriesFromWooSchema
>;

export type ProductsCategoryWooClientType = {
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

export type ProductsCategoriesWooClientType = ProductsCategoryWooClientType[];
