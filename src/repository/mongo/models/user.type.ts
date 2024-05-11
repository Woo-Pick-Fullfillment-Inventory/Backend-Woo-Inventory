import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export type UserAttributeType = "id" | "email" | "username";

export type UserUpdateAttributeType =
  | "last_login"
  | "sync.are_products_synced"
  | "sync.are_products_categories_synced"
  | "sync.are_orders_synced";

const ObjectIdPattern = "^[0-9a-fA-F]{24}$";

export const UserMongoSchema = Type.Object({
  _id: Type.Any(),
  id: Type.String({ pattern: ObjectIdPattern }),
  email: Type.String(),
  username: Type.String(),
  password: Type.String(),
  store: Type.Object({
    app_url: Type.String(),
    type: Type.Union([
      Type.Literal("shopify"),
      Type.Literal("woo"),
    ]),
  }),
  woo_credentials: Type.Object({
    token: Type.String(),
    secret: Type.String(),
  }),
  authentication: Type.Object({
    method: Type.Union([
      Type.Literal("woo_credentials"),
      Type.Literal("woo_token"),
    ]),
    is_authorized: Type.Boolean(),
  }),
  last_login: Type.String(),
  sync: Type.Object({
    are_products_synced: Type.Boolean(),
    are_products_categories_synced: Type.Boolean(),
    are_orders_synced: Type.Boolean(),
  }),
});

export type UserMongoType = Static<typeof UserMongoSchema>;
