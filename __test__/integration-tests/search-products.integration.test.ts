import { mongoRepository } from "../../src/repository/mongo/index.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { generateProductsArray } from "../common/faker/generate-mock-products.js";
import { httpClient } from "../common/http-client.js";
import {
  clearDbTest,
  initDbTest,
} from "../common/init-data.js";
import { mockUserForSyncingProducts } from "../common/mock-data.js";

describe("Search products test", () => {
  const userId = mockUserForSyncingProducts.id;

  beforeEach(async () => {
    await initDbTest();
    const mockProducts = await generateProductsArray(27);
    await mongoRepository.product.batchWriteProducts(mockProducts, userId);
  });

  afterEach(async () => {
    await clearDbTest(userId);
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it("should return a product list of first 27 products order by iname in descending order", async () => {
    const responseFirstList = await httpClient.post(
      "api/v1/products:search",
      {
        sorting_criteria: {
          field: "name",
          direction: "asc",
        },
        pagination_criteria: {
          page: 1,
          per_page: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseFirstList.status).toEqual(201);
    expect(responseFirstList.data.products.length).toBe(10);

    const responseSecondList = await httpClient.post(
      "api/v1/products:search",
      {
        sorting_criteria: {
          field: "name",
          direction: "asc",
        },
        pagination_criteria: {
          page: 2,
          per_page: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseSecondList.status).toEqual(201);
    expect(responseSecondList.data.products.length).toBe(10);

    const responseThirdList = await httpClient.post(
      "api/v1/products:search",
      {
        sorting_criteria: {
          field: "name",
          direction: "asc",
        },
        pagination_criteria: {
          page: 3,
          per_page: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseThirdList.status).toEqual(201);
    expect(responseThirdList.data.products.length).toBe(7);
    const list = responseFirstList.data.products
      .concat(responseSecondList.data.products)
      .concat(responseThirdList.data.products);
    for (let i = 0; i < list.length - 1; i++) {
      expect(
        list[i]?.name.localeCompare(list[i + 1]?.name),
      ).toBeLessThanOrEqual(0);
    }
  });
});
