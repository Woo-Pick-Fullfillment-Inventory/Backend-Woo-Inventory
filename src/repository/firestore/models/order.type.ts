import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const OrderFirestoreInputSchema = Type.Object({
  id: Type.Number(),
  picking_status: Type.Union(
    [
      Type.Literal("unfulfilled"),
      Type.Literal("part-fulfilled"),
      Type.Literal("fulfilled"),
    ],
  ),
});

export type OrderFirestoreInputType = Static<typeof OrderFirestoreInputSchema>;

export const OrdersFirestoreInputSchema = Type.Array(OrderFirestoreInputSchema);

export type OrdersFirestoreInputType = OrderFirestoreInputType[];

export const OrderFirestoreSchema = Type.Object({
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

export type OrderFirestoreType = Static<typeof OrderFirestoreSchema>;

export const OrdersFirestoreSchema = Type.Array(OrderFirestoreSchema);

export type OrdersFirestoreType = OrderFirestoreType[];