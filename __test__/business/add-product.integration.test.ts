import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { WireMockRestClient } from "wiremock-rest-client";

import { viewCollectionFactory } from "../../src/repository/firestore/collection/view-collection";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client";
import { mockUserForSyncingProducts } from "../common/mock-data.js";

import type { ViewCollectionFunction } from "../../src/repository/firestore/collection/view-collection";
import type { ProductsType } from "../../src/repository/woo-api/models";

const woocommerceApiMockServer = new WireMockRestClient("http://localhost:1080", { logLevel: "silent" });

describe("Get products test", () => {
  let db: FirebaseFirestore.Firestore;
  let viewCollection: ViewCollectionFunction;

  beforeEach(async () => {
    // Initialize Firestore for each test
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    // Initialize the viewCollection function once
    viewCollection = viewCollectionFactory(db);
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map(app => app.delete()));
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

    const oldProducts = await viewCollection<ProductsType>(`users-products/users-${mockUserForSyncingProducts.user_id}-products/products`);
    const response = await httpClient.post("api/v1/products", newProduct, { headers: { authorization: createAuthorizationHeader(mockUserForSyncingProducts.user_id) } });
    const newProducts = await viewCollection<ProductsType>(`users-products/users-${mockUserForSyncingProducts.user_id}-products/products`);

    expect(newProducts.length).toEqual(oldProducts.length + 1);
    expect(response.status).toBe(201);
  });
});
