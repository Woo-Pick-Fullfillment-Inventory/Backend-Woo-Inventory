import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { WireMockRestClient } from "wiremock-rest-client";

import { viewCollectionFactory } from "../../src/repository/firestore/collection/view-collection.js";
import { batchWriteProductsFactory } from "../../src/repository/firestore/products/batch-write-products.js";
import { insertUserFactory } from "../../src/repository/firestore/users/insert-user.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { generateProductsArray } from "../common/faker/generate-mock-products.js";
import { httpClient } from "../common/http-client.js";
import {
  mockUserDidntSync,
  mockUserForSyncingProducts,
} from "../common/mock-data.js";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Add product test", () => {
  let db: FirebaseFirestore.Firestore;
  const userId = mockUserForSyncingProducts.user_id;

  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserForSyncingProducts);
    await insertUserFactory(db)(mockUserDidntSync);
    const mockProducts = await generateProductsArray(5);
    await batchWriteProductsFactory(db)(mockProducts, userId);
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should increase products count", async () => {
    const response_sync = await httpClient.post(
      "api/v1/products/sync",
      { action: "sync-products" },
      {
        headers: {
          Authorization: createAuthorizationHeader(
            userId,
          ),
        },
      },
    );
    expect(response_sync.status).toEqual(201);
    const productListBefore = (await viewCollectionFactory(db)(
      `products/users-${userId}/users-products`,
    )).length;

    const response = await httpClient.post(
      "api/v1/products",
      { name: "Premium Quality" },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );

    const productListAfter = (await viewCollectionFactory(db)(
      `products/users-${userId}/users-products`,
    )).length;

    expect(productListAfter).toBeGreaterThan(productListBefore);
    expect(productListAfter).toBe(productListBefore + 1);

    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "POST",
          url: "/wp-json/wc/v3/products",
        })
      ).count,
    ).toEqual(1);
    expect(response.status).toBe(201);
  });

  it("should return 400 when user didnt sync products", async () => {
    const response = await httpClient.post(
      "api/v1/products",
      { name: "Premium Quality" },
      { headers: { authorization: createAuthorizationHeader(mockUserDidntSync.user_id) } },
    );

    expect(response.status).toBe(400);
  });
});
