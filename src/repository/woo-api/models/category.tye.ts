import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const ImageWooSchema = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

export const ProductsCategoryWooSchema = Type.Object({
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
    ImageWooSchema,
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

export const ProductsCategoriesWooSchema = Type.Array(ProductsCategoryWooSchema);

export type ProductsCategoryWooType = Static<typeof ProductsCategoryWooSchema>;

export type ProductsCategoriesWooType = Static<
  typeof ProductsCategoriesWooSchema
>;
