import { WireMockRestClient } from "wiremock-rest-client";

import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client";
import { mockUserForSyncingProducts } from "../common/mock-data.js";
// import { firestoreRepository } from "../../src/repository/firestore";
// import type { ProductsType } from "../../src/repository/woo-api/models";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);
describe("Get products test", () => {
  beforeEach(async () => {
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  it("should return 201", async () => {
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

    const response = await httpClient.post("api/v1/products", newProduct, { headers: { authorization: createAuthorizationHeader(mockUserForSyncingProducts.user_id) } });

    expect(response.status).toBe(201);
  });

  // it("should inscrease products count", async () => {
  //   const newProduct = {
  //     name: "Premium Quality",
  //     sku: "some_sku",
  //     price: "100",
  //     stock_quantity: 200,
  //     images: [
  //       { src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg" },
  //       { src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg" },
  //     ],
  //   };
  //   const oldProducts = await firestoreRepository.collection.viewCollection<ProductsType>(`users-products/users-${mockUserForSyncingProducts.user_id}-products/products`);
  //   await httpClient.post("api/v1/products", newProduct, { headers: { authorization: createAuthorizationHeader(mockUserForSyncingProducts.user_id) } });
  //   const newProducts = await firestoreRepository.collection.viewCollection<ProductsType>(`users-products/users-${mockUserForSyncingProducts.user_id}-products/products`);
  //   expect(newProducts.length).toEqual(oldProducts.length + 1);
  // })
});
