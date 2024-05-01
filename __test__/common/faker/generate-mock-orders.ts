import { faker } from "@faker-js/faker";

import type { OrdersWooType } from "../../../src/repository/woo-api/index.js";

const allowedOrderStatuses = [
  "pending",
  "processing",
  "on-hold",
  "completed",
  "cancelled",
  "refunded",
  "failed",
  "trash",
] as const;

let orderIdCounter = 0;

const generateRandomOrder = (): OrdersWooType[number] => {
  orderIdCounter++;

  return {
    id: orderIdCounter,
    status: faker.helpers.arrayElement(allowedOrderStatuses),
    currency: "USD",
    total: faker.number
      .int({
        min: 1,
        max: 1000,
      })
      .toString(),
    line_items: Array.from(
      {
        length: faker.number.int({
          min: 1,
          max: 5,
        }),
      },
      () => ({
        id: faker.number.int({
          min: 100,
          max: 200,
        }),
        name: faker.commerce.productName(),
        product_id: faker.number.int({
          min: 100,
          max: 200,
        }),
        meta_data: [],
      }),
    ),
    meta_data: [],
  };
};

export const generateOrdersArray = async (
  numberOfOrders: number,
): Promise<OrdersWooType> => {
  orderIdCounter = 0;
  return Array.from({ length: numberOfOrders }, generateRandomOrder);
};
