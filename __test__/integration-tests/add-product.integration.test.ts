import { WireMockRestClient } from "wiremock-rest-client";

import { mongoRepository } from "../../src/repository/mongo/index.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { generateProductsArray } from "../common/faker/generate-mock-products.js";
import { httpClient } from "../common/http-client.js";
import {
  mockUserDidntSync,
  mockUserForAddingProduct,
} from "../common/mock-data.js";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Add product test", () => {
  const userId = mockUserForAddingProduct.user_id;

  beforeEach(async () => {
    const mockProducts = await generateProductsArray(5);
    await mongoRepository.product.batchWriteProducts(mockProducts, userId);
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await mongoRepository.collection.clearCollection(
      `user-${userId}-products`,
    );
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it("should increase products count", async () => {
    const productListBefore = (
      await mongoRepository.product.getProducts(userId, {
        attribute: "name",
        direction: "asc",
        page: 1,
        per_page: 10,
      })
    ).length;

    const response = await httpClient.post(
      "api/v1/products",
      { name: "Premium Quality" },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    const productListAfter = (
      await mongoRepository.product.getProducts(userId, {
        attribute: "name",
        direction: "asc",
        page: 1,
        per_page: 10,
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
      { headers: { authorization: createAuthorizationHeader(mockUserDidntSync.user_id) } },
    );
    expect(response.status).toBe(400);
  });
});
