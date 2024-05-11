import { WireMockRestClient } from "wiremock-rest-client";

import { mongoRepository } from "../../src/repository/mongo/index.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client.js";
import {
  clearDbTest,
  initDbTest,
  initDbWithIndexTest,
} from "../common/init-data.js";
import { mockUserForSyncingProducts } from "../common/mock-data.js";
const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Syncing products test", () => {
  const userId = mockUserForSyncingProducts.id;

  beforeEach(async () => {
    await initDbTest();
  });

  afterEach(async () => {
    await clearDbTest(userId);
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it.only("should have products synced", async () => {
    await initDbWithIndexTest(userId);
    const response = await httpClient.post(
      "api/v1/products/sync",
      { action: "sync-products" },
      {
        headers: {
          Authorization: createAuthorizationHeader(
            userId,
            "woo",
          ),
        },
      },
    );
    expect(response.status).toEqual(201);
    expect(await mongoRepository.collection.countDocuments({
      userId,
      shop: "woo",
      collectionName: "products",
    })).toEqual(200);
    // eslint-disable-next-line
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/products?per_page=1&page=1",
        })
      ).count,
    ).toEqual(1);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/products?per_page=100&page=1",
        })
      ).count,
    ).toEqual(1);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/products?per_page=100&page=2",
        })
      ).count,
    ).toEqual(1);
  });
});
