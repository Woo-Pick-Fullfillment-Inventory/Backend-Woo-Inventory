import {
  apps,
  clearFirestoreData,
} from "@firebase/rules-unit-testing";
import { WireMockRestClient } from "wiremock-rest-client";

import { insertUser } from "../../src/repository/firestore";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client";
import { mockUserForSyncingProducts } from "../common/mock-data";

const mambuApiMockServer = new WireMockRestClient("http://localhost:1080", { logLevel: "silent" });

describe("Syncing products test", () => {
  beforeEach(async () => {
    await insertUser(mockUserForSyncingProducts);
    await mambuApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
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
    expect((await mambuApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=100&page=1",
    })).count).toEqual(1);
    expect((await mambuApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=100&page=2",
    })).count).toEqual(1);
  });
});
