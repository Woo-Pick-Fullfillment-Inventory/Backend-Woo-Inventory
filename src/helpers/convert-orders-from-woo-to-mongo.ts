import type { OrderMongoInputType } from "../repository/mongo/index.js";
import type { OrdersWooType } from "../repository/woo-api/index.js";

const fromWooToMongoOrdersMapping = (wooOrders: OrdersWooType): OrderMongoInputType[] => {
  return wooOrders.map((wooOrder) => {
    return {
      ...wooOrder,
      picking_status: "unfulfilled",
    };
  });
};

export default fromWooToMongoOrdersMapping;