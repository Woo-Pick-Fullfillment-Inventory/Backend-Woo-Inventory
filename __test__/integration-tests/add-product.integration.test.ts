import { WireMockRestClient } from "wiremock-rest-client";

import { mongoRepository } from "../../src/repository/mongo/index.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { generateProductsArray } from "../common/faker/generate-mock-products.js";
import { httpClient } from "../common/http-client.js";
import {
  clearDbTest,
  initDbTest,
} from "../common/init-data.js";
import {
  mockUserDidntSync,
  mockUserForAddingProduct,
} from "../common/mock-data.js";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Add product test", () => {
  const userId = mockUserForAddingProduct.id;

  beforeEach(async () => {
    await initDbTest();
    const mockProducts = await generateProductsArray(5);
    await mongoRepository.product.batchWriteProducts({
      data: mockProducts,
      userId,
      shop: "woo",
    });
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearDbTest(userId);
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it("should increase products count", async () => {
    const productListBefore = (
      await mongoRepository.product.getProducts({
        userId,
        sortOption: {
          attribute: "name",
          direction: "asc",
          page: 1,
          per_page: 10,
        },
        shop: "woo",
      })
    ).length;

    const response = await httpClient.post(
      "api/v1/products",
      { name: "Premium Quality" },
      { headers: { authorization: createAuthorizationHeader(userId, "woo") } },
    );
    const productListAfter = (
      await mongoRepository.product.getProducts({
        userId,
        sortOption: {
          attribute: "name",
          direction: "asc",
          page: 1,
          per_page: 10,
        },
        shop: "woo",
      })
    ).length;

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
      { headers: { authorization: createAuthorizationHeader(mockUserDidntSync.id, "woo") } },
    );
    expect(response.status).toBe(400);
  });
});
