import type { OrdersFirestoreInputType } from "../repository/firestore/index.js";
import type { OrdersWooType } from "../repository/woo-api/index.js";

const fromWooToFirestoreOrdersMapping = (wooOrders: OrdersWooType): OrdersFirestoreInputType => {
  return wooOrders.map((order) => ({
    ...order,
    picking_status: "pending",
  }));
};

export default fromWooToFirestoreOrdersMapping;