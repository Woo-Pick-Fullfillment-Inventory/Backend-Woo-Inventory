import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { WireMockRestClient } from "wiremock-rest-client";

import { viewCollectionFactory } from "../../src/repository/firestore/collection/view-collection.js";
import { insertUserFactory } from "../../src/repository/firestore/users/insert-user.js";
import { batchWriteProductsFactory } from "../../src/repository/firestore/users-products/batch-write-products.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { generateProductsArray } from "../common/faker.js";
import { httpClient } from "../common/http-client";
import { mockUserForSyncingProducts } from "../common/mock-data.js";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Get products test", () => {
  let db: FirebaseFirestore.Firestore;
  const userId = mockUserForSyncingProducts.user_id;

  beforeEach(async () => {
    // Initialize Firestore for each test
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserForSyncingProducts);
    const mockProducts = await generateProductsArray(5);
    await batchWriteProductsFactory(db)(mockProducts, userId);
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should increase products count", async () => {
    const newProduct = {
      name: "Premium Quality",
      sku: "some_sku",
      price: "100",
      stock_quantity: 200,
      images: [
        { src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg" },
        { src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg" },
      ],
    };

    const productListBefore = await viewCollectionFactory(db)(
      `users-products/users-${userId}-products/products`,
    );

    expect(productListBefore.length).toEqual(5);

    const response = await httpClient.post("api/v1/products", newProduct, { headers: { authorization: createAuthorizationHeader(userId) } });

    const productListAfter = await viewCollectionFactory(db)(
      `users-products/users-${userId}-products/products`,
    );

    expect(productListAfter.length).toEqual(6);

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
});
