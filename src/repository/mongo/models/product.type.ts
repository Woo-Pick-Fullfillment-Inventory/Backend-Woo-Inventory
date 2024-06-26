import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const ProductMongoSchemaInput = Type.Object({ id: Type.Number() });

export type ProductMongoInputType = Static<typeof ProductMongoSchemaInput>;

const ImageSchema = Type.Object({
  id: Type.Number(),
  src: Type.String(),
});

export const ProductMongoSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  sku: Type.String(),
  slug: Type.String(),
  sale_price: Type.String(),
  stock_quantity: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
  categories: Type.Array(
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
      slug: Type.String(),
    }),
  ),
  images: Type.Array(ImageSchema),
  expiration_date: Type.Optional(Type.String({ format: "date" })),
});

export const AddProductMongoSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  sku: Type.Optional(Type.String()),
  slug: Type.Optional(Type.String()),
  categories: Type.Optional(Type.Array(Type.Object({
    id: Type.Number(),
    name: Type.String(),
    slug: Type.String(),
  }))),
  bar_code: Type.Optional(Type.String()),
  imei: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  // todo: add supplier
  supplier: Type.Optional(Type.String()),
  purchase_price: Type.Optional(Type.String()),
  regular_price: Type.Optional(Type.String()),
  sale_price: Type.Optional(Type.String()),
  images: Type.Optional(Type.Array(Type.Object({
    id: Type.Number(),
    src: Type.String(),
  }))),
  tax_status: Type.Optional(Type.Union([
    Type.Literal("taxable"),
    Type.Literal("shipping"),
    Type.Literal("none"),
  ])),
  tax_class: Type.Optional(Type.Union([
    Type.Literal("standard"),
    Type.Literal("reduced-rate"),
    Type.Literal("zero-rate"),
  ])),
  unit: Type.Optional(Type.String()),
  activate: Type.Optional(Type.Boolean()),
});

export const ProductsMongoSchema = Type.Array(ProductMongoSchema);

export type ProductMongoType = Static<typeof ProductMongoSchema>;

export type ProductMongoAttributeType = "id" | "name" | "sku" | "price" | "stock_quantity";

export type AddProductMongoType = Static<typeof AddProductMongoSchema>;