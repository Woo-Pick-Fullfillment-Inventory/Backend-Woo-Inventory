import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

const PickingStatusSchema = Type.Union(
  [
    Type.Literal("unfulfilled"),
    Type.Literal("partially-fulfilled"),
    Type.Literal("fulfilled"),
  ],
);

export type PickingStatusType = Static<typeof PickingStatusSchema>;

const OrderStatusSchema = Type.Union(
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
);

export type OrderStatusType = Static<typeof OrderStatusSchema>;

export const OrderMongoInputSchema = Type.Object({
  id: Type.Number(),
  picking_status: PickingStatusSchema,
});

export type OrderMongoInputType = Static<typeof OrderMongoInputSchema>;

export const OrdersMongoInputSchema = Type.Array(OrderMongoInputSchema);

export type OrdersMongoInputType = OrderMongoInputType[];

export const OrderMongoSchema = Type.Object({
  id: Type.Number(),
  picking_status: PickingStatusSchema,
  status: OrderStatusSchema,
  date_created: Type.String(),
  line_items: Type.Array(
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
      quantity: Type.Number(),
    }),
  ),
  billing: Type.Object({
    first_name: Type.String(),
    last_name: Type.String(),
    address_1: Type.String(),
    address_2: Type.String(),
    city: Type.String(),
    state: Type.String(),
    postcode: Type.String(),
    country: Type.String(),
    email: Type.String(),
    phone: Type.String(),
  }),
  shipping: Type.Object({
    first_name: Type.String(),
    last_name: Type.String(),
    address_1: Type.String(),
    address_2: Type.String(),
    company: Type.String(),
    city: Type.String(),
    state: Type.String(),
    postcode: Type.String(),
    country: Type.String(),
    phone: Type.String(),
  }),
});

export type OrderMongoType = Static<typeof OrderMongoSchema>;

export const OrdersMongoSchema = Type.Array(OrderMongoSchema);

export type OrdersMongoType = OrderMongoType[];
