import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const ProductCategoryMongoInputSchema = Type.Object({ id: Type.Number() });

export type ProductCategoryMongoInputType = Static<typeof ProductCategoryMongoInputSchema>;

export const ProductsCategoryMongoSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  slug: Type.String(),
  parent: Type.Number(),
});

export const ProductsCategoriesMongoSchema = Type.Array(ProductsCategoryMongoSchema);

// type get back from Mongo to validate
export type ProductsCategoryMongoType = Static<typeof ProductsCategoryMongoSchema>;

export type ProductsCategoriesMongoType = Static<typeof ProductsCategoriesMongoSchema>;

// type return to users
export type ProductsCategoryMongoClientType = {
    id: number;
    name: string;
    slug: string;
    parent: number;
};

export type ProductsCategoriesMongoClientType = ProductsCategoryMongoClientType[];