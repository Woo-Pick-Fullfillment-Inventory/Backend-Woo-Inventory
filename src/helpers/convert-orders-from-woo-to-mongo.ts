import type { OrderMongoInputType } from "../repository/mongo/index.js";
import type { OrdersWooType } from "../repository/woo-api/index.js";

const fromWooToMongoOrdersMapping = (wooOrders: OrdersWooType): OrderMongoInputType[] => {
  return wooOrders.map((wooOrder) => {
    const {
      date_created,
      ...rest
    } = wooOrder;
    return {
      ...rest,
      date_created: new Date(date_created).toISOString(),
      picking_status: "unfulfilled",
    };
  });
};

export default fromWooToMongoOrdersMapping;