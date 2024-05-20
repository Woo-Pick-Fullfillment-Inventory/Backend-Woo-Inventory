import { faker } from "@faker-js/faker";

import type { OrderMongoInputType } from "../../../src/repository/mongo/index.js";

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

const generateRandomOrder = () => {
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
    billing: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    },
    shipping: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    },
    meta_data: [],
    // problems: check here if code fails. hardcode time created
    date_created: faker.date.between({
      from: "2024-01-01T00:00:00.000Z",
      to: "2024-12-31T00:00:00.000Z",
    }).toISOString(),
    picking_status: "unfulfilled",
  } as OrderMongoInputType;
};

export const generateOrdersArray = async (
  numberOfOrders: number,
): Promise<OrderMongoInputType[]> => {
  orderIdCounter = 0;
  return Array.from({ length: numberOfOrders }, () => generateRandomOrder());
};
