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