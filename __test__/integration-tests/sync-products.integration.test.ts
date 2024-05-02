import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { WireMockRestClient } from "wiremock-rest-client";

import { viewCollectionFactory } from "../../src/repository/firestore/collection/view-collection.js";
import { insertUserFactory } from "../../src/repository/firestore/users/insert-user.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client.js";
import { mockUserForSyncingProducts } from "../common/mock-data.js";
const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Syncing products test", () => {
  let db: FirebaseFirestore.Firestore;

  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserForSyncingProducts);
    await woocommerceApiMockServer.requests.deleteAllRequests();
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
    expect(response.status).toEqual(201);
    // eslint-disable-next-line
    const users: any = await viewCollectionFactory(db)("users");
    expect(users[0].sync.are_products_synced).toEqual(true);
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
