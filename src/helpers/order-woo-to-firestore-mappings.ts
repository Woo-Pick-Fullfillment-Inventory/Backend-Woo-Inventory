import type { OrdersFirestoreInputType } from "../repository/firestore/index.js";
import type { OrdersWooType } from "../repository/woo-api/index.js";

export const fromWooToFirestoreOrder = (wooOrders: OrdersWooType): OrdersFirestoreInputType => {
  return wooOrders.map((order) => ({
    id: order.id,
    picking_status: "pending",
  }));
};