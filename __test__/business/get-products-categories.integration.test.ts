import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { WireMockRestClient } from "wiremock-rest-client";

import { insertUserFactory } from "../../src/repository/firestore/users/insert-user.js";
import { batchWriteProductsCategoriesFactory } from "../../src/repository/firestore/users-products-categories/batch-write-categories.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client";
import { mockUserForSyncingProducts } from "../common/mock-data";

import type { ProductsCategoriesType } from "../../src/repository/woo-api/index.js";
const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("get products categories test", () => {
  let db: FirebaseFirestore.Firestore;

  const categories: ProductsCategoriesType = [
    {
      id: 131,
      name: "Bia &amp; Rượu",
      slug: "bier-wein",
      parent: 128,
    },
    {
      id: 123,
      name: "Bột mì",
      slug: "mehl",
      parent: 121,
    },
    {
      id: 133,
      name: "Chén &amp; Đĩa",
      slug: "geschirr",
      parent: 132,
    },
    {
      id: 134,
      name: "Dao &amp; Kéo",
      slug: "messer-schere",
      parent: 132,
    },
    {
      id: 126,
      name: "Đậu phụ và đậu hộp",
      slug: "tofu",
      parent: 124,
    },
    {
      id: 127,
      name: "Đồ ăn vặt",
      slug: "snack",
      parent: 0,
    },
    {
      id: 132,
      name: "Đồ dùng gia đình",
      slug: "non-food",
      parent: 0,
    },
    {
      id: 124,
      name: "Đồ hộp",
      slug: "konservedosen",
      parent: 0,
    },
    {
      id: 128,
      name: "Đồ uống",
      slug: "do-uong",
      parent: 0,
    },
    {
      id: 118,
      name: "Gạo",
      slug: "reis",
      parent: 116,
    },
    {
      id: 116,
      name: "Gạo và Mì",
      slug: "reis-nudeln",
      parent: 0,
    },
    {
      id: 122,
      name: "Gia vị",
      slug: "gewurze",
      parent: 121,
    },
    {
      id: 121,
      name: "Gia vị và bột mì",
      slug: "gewurze-mehl",
      parent: 0,
    },
    {
      id: 119,
      name: "Mì",
      slug: "nudeln",
      parent: 116,
    },
    {
      id: 129,
      name: "Nước ngọt",
      slug: "suess-getraenke",
      parent: 128,
    },
    {
      id: 120,
      name: "Nước sốt",
      slug: "sauce",
      parent: 0,
    },
    {
      id: 135,
      name: "Phụ kiện nhà bếp",
      slug: "kuchenzubehoer",
      parent: 132,
    },
    {
      id: 117,
      name: "Rau củ quả",
      slug: "frisch-kuehlware",
      parent: 0,
    },
    {
      id: 125,
      name: "Rau củ quả",
      slug: "gemuese",
      parent: 124,
    },
    {
      id: 130,
      name: "Trà &amp; Cà phê",
      slug: "tee-cafe",
      parent: 128,
    },
    {
      id: 16,
      name: "Uncategorized",
      slug: "uncategorized",
      parent: 0,
    },
  ] as ProductsCategoriesType;

  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserForSyncingProducts);
    await batchWriteProductsCategoriesFactory(db)(categories, mockUserForSyncingProducts.user_id);
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should have products synced", async () => {
    const response = await httpClient.get(
      "api/v1/products/categories",
      {
        headers: {
          Authorization: createAuthorizationHeader(
            mockUserForSyncingProducts.user_id,
          ),
        },
      },
    );
    expect(response.status).toEqual(200);
    expect(response.data).toEqual([
      {
        id: 127,
        name: "Đồ ăn vặt",
        parent: 0,
        slug: "snack",
        children: [],
      },
      {
        id: 132,
        name: "Đồ dùng gia đình",
        parent: 0,
        slug: "non-food",
        children: [
          {
            id: 133,
            name: "Chén &amp; Đĩa",
            parent: 132,
            slug: "geschirr",
            children: [],
          },
          {
            id: 134,
            name: "Dao &amp; Kéo",
            parent: 132,
            slug: "messer-schere",
            children: [],
          },
          {
            id: 135,
            name: "Phụ kiện nhà bếp",
            parent: 132,
            slug: "kuchenzubehoer",
            children: [],
          },
        ],
      },
      {
        id: 124,
        name: "Đồ hộp",
        parent: 0,
        slug: "konservedosen",
        children: [
          {
            id: 126,
            name: "Đậu phụ và đậu hộp",
            parent: 124,
            slug: "tofu",
            children: [],
          },
          {
            id: 125,
            name: "Rau củ quả",
            parent: 124,
            slug: "gemuese",
            children: [],
          },
        ],
      },
      {
        id: 128,
        name: "Đồ uống",
        parent: 0,
        slug: "do-uong",
        children: [
          {
            id: 131,
            name: "Bia &amp; Rượu",
            parent: 128,
            slug: "bier-wein",
            children: [],
          },
          {
            id: 129,
            name: "Nước ngọt",
            parent: 128,
            slug: "suess-getraenke",
            children: [],
          },
          {
            id: 130,
            name: "Trà &amp; Cà phê",
            parent: 128,
            slug: "tee-cafe",
            children: [],
          },
        ],
      },
      {
        id: 116,
        name: "Gạo và Mì",
        parent: 0,
        slug: "reis-nudeln",
        children: [
          {
            id: 118,
            name: "Gạo",
            slug: "reis",
            parent: 116,
            children: [],
          },
          {
            id: 119,
            name: "Mì",
            slug: "nudeln",
            parent: 116,
            children: [],
          },
        ],
      },
      {
        id: 121,
        name: "Gia vị và bột mì",
        slug: "gewurze-mehl",
        parent: 0,
        children: [
          {
            id: 123,
            name: "Bột mì",
            parent: 121,
            slug: "mehl",
            children: [],
          },
          {
            id: 122,
            name: "Gia vị",
            parent: 121,
            slug: "gewurze",
            children: [],
          },
        ],
      },
      {
        id: 120,
        name: "Nước sốt",
        parent: 0,
        slug: "sauce",
        children: [],
      },
      {
        id: 117,
        name: "Rau củ quả",
        parent: 0,
        slug: "frisch-kuehlware",
        children: [],
      },
      {
        id: 16,
        name: "Uncategorized",
        parent: 0,
        slug: "uncategorized",
        children: [],
      },
    ]);
  });
});
