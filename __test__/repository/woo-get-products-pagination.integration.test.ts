import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { WireMockRestClient } from "wiremock-rest-client";

import { createBasicAuthHeaderToken } from "../../src/modules/create-basic-auth-header.js";
import { insertUserFactory } from "../../src/repository/firestore/users/insert-user.js";
import { getProductsPaginationFactory } from "../../src/repository/woo-api/products/get-products-pagination";
import {
  mockUserForSyncingProducts,
  mockUserForSyncingProductsFalsyTypeProductReturn,
} from "../common/mock-data";
const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Get products from woo api test", () => {
  let db: FirebaseFirestore.Firestore;

  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserForSyncingProducts);
    await insertUserFactory(db)(
      mockUserForSyncingProductsFalsyTypeProductReturn,
    );
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });
  it("should not return product from woo api, because type validation is falsy", async () => {
    await expect(
      getProductsPaginationFactory({
        baseUrl: "https://testwebsite.com",
        token: createBasicAuthHeaderToken(
          mockUserForSyncingProductsFalsyTypeProductReturn.woo_credentials
            .token,
          mockUserForSyncingProductsFalsyTypeProductReturn.woo_credentials
            .secret,
        ),
        perPage: 1,
        page: 2,
      }),
    ).rejects.toThrow("Response type not expected");
  });
  it("should not return product from woo api, because url is falsy", async () => {
    await expect(
      getProductsPaginationFactory({
        baseUrl: "some-url",
        token: createBasicAuthHeaderToken(
          mockUserForSyncingProducts.woo_credentials.token,
          mockUserForSyncingProducts.woo_credentials.secret,
        ),
        perPage: 1,
        page: 1,
      }),
    ).rejects.toThrow("Axios Error");
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/products?per_page=1&page=1",
        })
      ).count,
    ).toEqual(0);
  });
});
