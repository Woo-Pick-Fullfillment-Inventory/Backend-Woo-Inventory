import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";

import { insertUserFactory } from "../../src/repository/firestore/users/insert-user.js";
import { batchWriteProductsFactory } from "../../src/repository/firestore/users-products/batch-write-products.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { generateProductsArray } from "../common/faker.js";
import { httpClient } from "../common/http-client.js";
import { mockUserForSyncingProducts } from "../common/mock-data.js";

describe("Get products test", () => {
  const userId = mockUserForSyncingProducts.user_id;
  let db: FirebaseFirestore.Firestore;

  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserForSyncingProducts);
    const mockProducts = await generateProductsArray(27);
    await batchWriteProductsFactory(db)(mockProducts, userId);
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });
  it("should return a product list of first 27 products order by id in descending order", async () => {
    const responseFirstList = await httpClient.post(
      "api/v1/products:search",
      {
        sorting_criteria: {
          field: "id",
          direction: "desc",
        },
        pagination_criteria: { limit: 10 },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseFirstList.status).toEqual(201);
    expect(responseFirstList.data.products.length).toBe(10);
    for (let i = 0; i < responseFirstList.data.products.length - 1; i++) {
      expect(responseFirstList.data.products[i]?.id).toBeGreaterThanOrEqual(
        responseFirstList.data.products[i + 1]?.id,
      );
    }

    const responseSecondList = await httpClient.post(
      "api/v1/products:search",
      {
        sorting_criteria: {
          field: "id",
          direction: "desc",
        },
        pagination_criteria: {
          last_product: responseFirstList.data.products[9].id,
          limit: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseSecondList.status).toEqual(201);
    expect(responseSecondList.data.products.length).toBe(10);
    for (let i = 0; i < responseSecondList.data.products.length - 1; i++) {
      expect(responseSecondList.data.products[i]?.id).toBeGreaterThanOrEqual(
        responseSecondList.data.products[i + 1]?.id,
      );
    }

    const responseThirdList = await httpClient.post(
      "api/v1/products:search",
      {
        sorting_criteria: {
          field: "id",
          direction: "desc",
        },
        pagination_criteria: {
          last_product: responseSecondList.data.products[9].id,
          limit: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseThirdList.status).toEqual(201);
    expect(responseThirdList.data.products.length).toBe(7);
    for (let i = 0; i < responseThirdList.data.products.length - 1; i++) {
      expect(responseThirdList.data.products[i]?.id).toBeGreaterThanOrEqual(
        responseThirdList.data.products[i + 1]?.id,
      );
    }
  });

  it("should return a product list of first 27 products order by iname in descending order", async () => {
    const responseFirstList = await httpClient.post(
      "api/v1/products:search",
      {
        sorting_criteria: {
          field: "name",
          direction: "asc",
        },
        pagination_criteria: { limit: 10 },
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
          last_product: responseFirstList.data.products[9].name,
          limit: 10,
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
          last_product: responseSecondList.data.products[9].name,
          limit: 10,
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
  it("should return an empty list if the last product is not found", async () => {
    const responseFirstList = await httpClient.post(
      "api/v1/products:search",
      {
        sorting_criteria: {
          field: "id",
          direction: "asc",
        },
        pagination_criteria: {
          last_product: 27,
          limit: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseFirstList.status).toEqual(201);
    expect(responseFirstList.data.last_product).toBe(null);
    expect(responseFirstList.data.products.length).toBe(0);
  });
});
