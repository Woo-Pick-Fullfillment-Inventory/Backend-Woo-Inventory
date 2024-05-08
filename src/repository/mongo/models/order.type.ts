import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const OrderMongoInputSchema = Type.Object({
  id: Type.Number(),
  picking_status: Type.Union(
    [
      Type.Literal("unfulfilled"),
      Type.Literal("part-fulfilled"),
      Type.Literal("fulfilled"),
    ],
  ),
});

export type OrderMongoInputType = Static<typeof OrderMongoInputSchema>;

export const OrdersMongoInputSchema = Type.Array(OrderMongoInputSchema);

export type OrdersMongoInputType = OrderMongoInputType[];

export const OrderMongoSchema = Type.Object({
  id: Type.Number(),
  picking_status: Type.Union(
    [
      Type.Literal("unfulfilled"),
      Type.Literal("part-fulfilled"),
      Type.Literal("fulfilled"),
    ]),
  status: Type.Union(
    [
      Type.Literal("pending"),
      Type.Literal("processing"),
      Type.Literal("on-hold"),
      Type.Literal("completed"),
      Type.Literal("cancelled"),
      Type.Literal("refunded"),
      Type.Literal("failed"),
      Type.Literal("trash"),
    ],
  ),
  date_created: Type.String(),
  line_items: Type.Array(
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
      quantity: Type.Number(),
    }),
  ),
});

export type OrderMongoType = Static<typeof OrderMongoSchema>;

export const OrdersMongoSchema = Type.Array(OrderMongoSchema);

export type OrdersMongoType = OrderMongoType[];