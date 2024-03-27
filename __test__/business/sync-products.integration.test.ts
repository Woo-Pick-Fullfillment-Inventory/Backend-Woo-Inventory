import { WireMockRestClient } from "wiremock-rest-client";

import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client";
import { mockUserForSyncingProducts } from "../common/mock-data";

const woocommerceApiMockServer = new WireMockRestClient("http://localhost:1080", { logLevel: "silent" });

describe("Syncing products test", () => {
  beforeEach(async () => {
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  it("should have products synced", async () => {
    const response = await httpClient.post(
      "api/v1/products/sync",
      { action: "sync-products" },
      {
        headers: {
          Authorization: createAuthorizationHeader(
            mockUserForSyncingProducts.user_id,
          ),
        },
      },
    );
    expect(response.status).toEqual(200);
    expect(response.data.are_products_synced).toEqual(true);
    expect((await woocommerceApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=1&page=1",
    })).count).toEqual(1);
    expect((await woocommerceApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=50&page=1",
    })).count).toEqual(1);
    expect((await woocommerceApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=50&page=2",
    })).count).toEqual(1);
    expect((await woocommerceApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=50&page=3",
    })).count).toEqual(1);
    expect((await woocommerceApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=50&page=4",
    })).count).toEqual(1);
  });
});