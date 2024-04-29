import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export type UserAttributeType = "user_id" | "email" | "username";

export type UserUpdateAttributeType =
  | "last_login"
  | "are_products_synced"
  | "are_products_categories_synced"
  | "are_orders_synced";

export const UserFireStoreSchema = Type.Object({
  user_id: Type.String(),
  email: Type.String(),
  username: Type.String(),
  password: Type.String(),
  store: Type.Object({ app_url: Type.String() }),
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

export type UserFireStoreType = Static<typeof UserFireStoreSchema>;
