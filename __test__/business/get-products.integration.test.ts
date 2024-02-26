import {
  apps,
  clearFirestoreData,
} from "@firebase/rules-unit-testing";
import { WireMockRestClient } from "wiremock-rest-client";

import { createAuthorizationHeader } from "../../src/modules/create-authorization-header";
import { insertUser } from "../../src/repository/firestore";
import { httpClient } from "../common/http-client";
import { mockUser } from "../common/mock-data";

const mambuApiMockServer = new WireMockRestClient("http://localhost:1080", { logLevel: "silent" });
describe("Get products test", () => {

  beforeEach(async () => {
    await insertUser(mockUser);
    await mambuApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should return a product list", async () => {
    const response = await httpClient.get("api/v1/products?per_page=10&page=1", { headers: { authorization: createAuthorizationHeader(mockUser.user_id) } });
    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      [
        {
          name: "Vegetable - Gemüse",
          sku: "S123",
          price: "3",
        },
        {
          name: "Tyj spring roll pastry 550g - Tyj Frühlingsrollenteig 550g",
          sku: "",
          price: "",
        },
        {
          name: "Trái sấu đông lạnh 500g - Gefrorenes Krokodil 500g",
          sku: "",
          price: "1.8",
        },
        {
          name: "Tower red pepper powder 500g - Tower Paprikapulver 500g",
          sku: "",
          price: "",
        },
        {
          name: "Tomatenmark 850g",
          sku: "",
          price: "",
        },
        {
          name: "Tôm thẻ hấp - Gedämpfte weiße Garnelen",
          sku: "",
          price: "",
        },
        {
          name: "Thịt trái gấc - Gac-Fruchtfleisch",
          sku: "",
          price: "",
        },
        {
          name: "Tamarind concentrate 454g - Tamarindenkonzentrat 454g",
          sku: "",
          price: "",
        },
        {
          name: "Taekyung red pepper powder 454g - Taekyung Paprikapulver 454g",
          sku: "",
          price: "",
        },
        {
          name: "Lươn rút xương - Aal ohne Knochen",
          sku: "",
          price: "",
        },
      ],
    );
    expect((await mambuApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=10&page=1",
    })).count).toEqual(1);
  });

});