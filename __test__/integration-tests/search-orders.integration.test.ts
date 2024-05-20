import { mongoRepository } from "../../src/repository/mongo/index.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { generateOrdersArray } from "../common/faker/generate-mock-orders.js";
import { httpClient } from "../common/http-client.js";
import {
  clearDbTest,
  initDbTest,
} from "../common/init-data.js";
import { mockUserForSyncingProducts } from "../common/mock-data.js";

describe("Search products test", () => {
  const userId = mockUserForSyncingProducts.id;

  beforeEach(async () => {
    await initDbTest();
    const mockOrders = await generateOrdersArray(5);
    await mongoRepository.order.batchWriteOrders({
      data: mockOrders,
      userId,
      shop: "woo",
    });
    await mongoRepository.user.updateUserOrdersSynced(userId, true, "woo");
  });

  afterEach(async () => {
    await clearDbTest(userId);
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it("should return all orders", async () => {
    const response = await httpClient.post(
      "/api/v1/orders:search",
      {
        date_from: "2024-01-01",
        date_to: "2024-12-31",
        status: [
          "pending",
          "processing",
          "on-hold",
          "completed",
          "cancelled",
          "refunded",
          "failed",
          "trash",
        ],
        sorting_criteria: {
          field: "date_created",
          direction: "asc",
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId, "woo") } },
    );
    expect(response.status).toBe(201);
    expect(response.data.orders.length).toBe(5);
  });

  it("should return order with id 1", async () => {
    const response = await httpClient.post(
      "/api/v1/orders:search",
      {
        date_from: "2024-01-01",
        date_to: "2024-12-31",
        status: [
          "pending",
          "processing",
          "on-hold",
          "completed",
          "cancelled",
          "refunded",
          "failed",
          "trash",
        ],
        sorting_criteria: {
          field: "date_created",
          direction: "asc",
        },
        search_term: "1",
      },
      { headers: { authorization: createAuthorizationHeader(userId, "woo") } },
    );
    expect(response.status).toBe(201);
    expect(response.data.orders.length).toBe(1);
  });
});
