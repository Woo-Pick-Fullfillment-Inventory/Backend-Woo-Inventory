import { WireMockRestClient } from "wiremock-rest-client";

import { mongoRepository } from "../../src/repository/mongo/index.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client.js";
import { mockUserForSyncingOrders } from "../common/mock-data.js";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Syncing orders test", () => {

  beforeEach(async () => {
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it("should have orders synced", async () => {
    const response = await httpClient.post(
      "api/v1/orders/sync",
      {
        action: "sync-orders",
        date_after: "2023-12-31T00:00:00",
        status: [
          "pending",
          "processing",
          "on-hold",
        ],
      },
      {
        headers: {
          Authorization: createAuthorizationHeader(
            mockUserForSyncingOrders.user_id,
          ),
        },
      },
    );
    expect(response.status).toEqual(201);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/orders?per_page=1&page=1&after=2023-12-31T00:00:00&status=pending,processing,on-hold",
        })
      ).count,
    ).toEqual(1);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/orders?per_page=100&page=1&after=2023-12-31T00:00:00&status=pending,processing,on-hold",
        })
      ).count,
    ).toEqual(1);
    const orders = await mongoRepository.order.getOrders(
      mockUserForSyncingOrders.user_id,
    );
    expect(orders.length).toEqual(4);
    for (const order of orders) {
      expect(order.picking_status).toBeDefined();
      expect(order.picking_status).toEqual("unfulfilled");
    }
  });
});
