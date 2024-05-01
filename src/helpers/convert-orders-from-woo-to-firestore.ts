import type { OrdersFirestoreInputType } from "../repository/firestore/index.js";
import type { OrdersWooType } from "../repository/woo-api/index.js";

const fromWooToFirestoreOrdersMapping = (wooOrders: OrdersWooType): OrdersFirestoreInputType => {
  return wooOrders.map((wooOrder) => {
    return {
      ...wooOrder,
      picking_status: "unfulfilled",
    };
  });
};

export default fromWooToFirestoreOrdersMapping;