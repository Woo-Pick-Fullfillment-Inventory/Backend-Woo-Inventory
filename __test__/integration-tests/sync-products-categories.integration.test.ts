import { WireMockRestClient } from "wiremock-rest-client";

import mongoClient from "../../src/repository/mongo/init-mongo.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client.js";
import {
  clearDbTest,
  initDbTest,
} from "../common/init-data.js";
import { mockUserForSyncingProducts } from "../common/mock-data.js";
const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Syncing products categories test", () => {
  beforeEach(async () => {
    await initDbTest();
  });

  afterEach(async () => {
    await clearDbTest(mockUserForSyncingProducts.user_id);
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it("should have products categories synced", async () => {
    const response = await httpClient.post(
      "api/v1/products/categories/sync",
      { action: "sync-products-categories" },
      {
        headers: {
          Authorization: createAuthorizationHeader(
            mockUserForSyncingProducts.user_id,
          ),
        },
      },
    );
    expect(response.status).toEqual(201);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/products/categories?per_page=1&page=1",
        })
      ).count,
    ).toEqual(1);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/products/categories?per_page=100&page=1",
        })
      ).count,
    ).toEqual(1);
  });
});
