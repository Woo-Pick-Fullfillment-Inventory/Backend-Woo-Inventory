import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client";

describe("Get products test", () => {

  it("should return a product list of first 27 products order by id in descending order", async () => {
    const userId = "1";
    const responseFirstList = await httpClient.post(
      "api/v1/products:search",
      {
        sortingCriteria: {
          field: "id",
          direction: "desc",
        },
        paginationCriteria: { limit: 10 },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseFirstList.data.products.length).toBe(10);
    for (let i = 0; i < responseFirstList.data.products.length - 1; i++) {
      expect(responseFirstList.data.products[i]?.id).toBeGreaterThanOrEqual(responseFirstList.data.products[i + 1]?.id);
    }

    const responseSecondList = await httpClient.post(
      "api/v1/products:search",
      {
        sortingCriteria: {
          field: "id",
          direction: "desc",
        },
        paginationCriteria: {
          last_product: responseFirstList.data.products[9].id,
          limit: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseSecondList.data.products.length).toBe(10);
    for (let i = 0; i < responseSecondList.data.products.length - 1; i++) {
      expect(responseSecondList.data.products[i]?.id).toBeGreaterThanOrEqual(responseSecondList.data.products[i + 1]?.id);
    }

    const responseThirdList = await httpClient.post(
      "api/v1/products:search",
      {
        sortingCriteria: {
          field: "id",
          direction: "desc",
        },
        paginationCriteria: {
          last_product: responseSecondList.data.products[9].id,
          limit: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseThirdList.data.products.length).toBe(7);
    for (let i = 0; i < responseThirdList.data.products.length - 1; i++) {
      expect(responseThirdList.data.products[i]?.id).toBeGreaterThanOrEqual(responseThirdList.data.products[i + 1]?.id);
    }
  });

  it("should return a product list of first 27 products order by iname in descending order", async () => {
    const userId = "1";
    const responseFirstList = await httpClient.post(
      "api/v1/products:search",
      {
        sortingCriteria: {
          field: "name",
          direction: "asc",
        },
        paginationCriteria: { limit: 10 },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseFirstList.data.products.length).toBe(10);

    const responseSecondList = await httpClient.post(
      "api/v1/products:search",
      {
        sortingCriteria: {
          field: "name",
          direction: "asc",
        },
        paginationCriteria: {
          last_product: responseFirstList.data.products[9].name,
          limit: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseSecondList.data.products.length).toBe(10);

    const responseThirdList = await httpClient.post(
      "api/v1/products:search",
      {
        sortingCriteria: {
          field: "name",
          direction: "asc",
        },
        paginationCriteria: {
          last_product: responseSecondList.data.products[9].name,
          limit: 10,
        },
      },
      { headers: { authorization: createAuthorizationHeader(userId) } },
    );
    expect(responseThirdList.data.products.length).toBe(7);
    const list = responseFirstList.data.products.concat(responseSecondList.data.products).concat(responseThirdList.data.products);
    for (let i = 0; i < list.length - 1; i++) {
      expect(list[i]?.name.localeCompare(list[i + 1]?.name)).toBeLessThanOrEqual(0);
    }

  });
});
