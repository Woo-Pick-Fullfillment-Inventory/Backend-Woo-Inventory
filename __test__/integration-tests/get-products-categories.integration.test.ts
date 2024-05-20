import { ObjectId } from "mongodb";
import { WireMockRestClient } from "wiremock-rest-client";

import { mongoRepository } from "../../src/repository/mongo/index.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client.js";
import {
  clearDbTest,
  initDbTest,
} from "../common/init-data.js";
import { mockUserForSyncingProducts } from "../common/mock-data.js";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

// todo: add test for get products categories
describe("get products categories test", () => {
  const categories = [
    {
      _id: new ObjectId("6634e9a7e541882e2b99e131"),
      id: 131,
      name: "Bia &amp; Rượu",
      slug: "bier-wein",
      parent: 128,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e123"),

      id: 123,
      name: "Bột mì",
      slug: "mehl",
      parent: 121,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e133"),

      id: 133,
      name: "Chén &amp; Đĩa",
      slug: "geschirr",
      parent: 132,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e134"),

      id: 134,
      name: "Dao &amp; Kéo",
      slug: "messer-schere",
      parent: 132,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e126"),

      id: 126,
      name: "Đậu phụ và đậu hộp",
      slug: "tofu",
      parent: 124,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e127"),

      id: 127,
      name: "Đồ ăn vặt",
      slug: "snack",
      parent: 0,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e132"),

      id: 132,
      name: "Đồ dùng gia đình",
      slug: "non-food",
      parent: 0,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e124"),

      id: 124,
      name: "Đồ hộp",
      slug: "konservedosen",
      parent: 0,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e128"),

      id: 128,
      name: "Đồ uống",
      slug: "do-uong",
      parent: 0,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e118"),

      id: 118,
      name: "Gạo",
      slug: "reis",
      parent: 116,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e116"),

      id: 116,
      name: "Gạo và Mì",
      slug: "reis-nudeln",
      parent: 0,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e122"),

      id: 122,
      name: "Gia vị",
      slug: "gewurze",
      parent: 121,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e121"),

      id: 121,
      name: "Gia vị và bột mì",
      slug: "gewurze-mehl",
      parent: 0,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e119"),

      id: 119,
      name: "Mì",
      slug: "nudeln",
      parent: 116,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e129"),

      id: 129,
      name: "Nước ngọt",
      slug: "suess-getraenke",
      parent: 128,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e120"),

      id: 120,
      name: "Nước sốt",
      slug: "sauce",
      parent: 0,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e135"),

      id: 135,
      name: "Phụ kiện nhà bếp",
      slug: "kuchenzubehoer",
      parent: 132,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e117"),

      id: 117,
      name: "Rau củ quả",
      slug: "frisch-kuehlware",
      parent: 0,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e125"),

      id: 125,
      name: "Rau củ quả",
      slug: "gemuese",
      parent: 124,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99e130"),

      id: 130,
      name: "Trà &amp; Cà phê",
      slug: "tee-cafe",
      parent: 128,
    },
    {
      _id: new ObjectId("6634e9a7e541882e2b99ea16"),

      id: 16,
      name: "Uncategorized",
      slug: "uncategorized",
      parent: 0,
    },
  ];

  beforeEach(async () => {
    await initDbTest();
    await mongoRepository.category.batchWriteProductsCategories({
      data: categories,
      userId: mockUserForSyncingProducts.id,
      shop: "woo",
    });
    await mongoRepository.user.updateUserProductsCategoriesSynced(
      mockUserForSyncingProducts.id,
      true,
      "woo",
    );

    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearDbTest(mockUserForSyncingProducts.id);
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it("should have products synced", async () => {
    const response = await httpClient.get("api/v1/products/categories", {
      headers: {
        Authorization: createAuthorizationHeader(
          mockUserForSyncingProducts.id,
          "woo",
        ),
      },
    });
    expect(response.status).toEqual(200);
  });
});
