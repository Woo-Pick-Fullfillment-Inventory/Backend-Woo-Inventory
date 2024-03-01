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
    expect(response.data.products.length).toEqual(response.data.items_count);
    expect(response.data.products).toEqual(
      [
        {
          id: 2897,
          name: "Vegetable - Gemüse",
          sku: "S123",
          price: "3",
          stock_quantity: 100,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/vegetable.jpg",
        },
        {
          id: 2893,
          name: "Tyj spring roll pastry 550g - Tyj Frühlingsrollenteig 550g",
          sku: "",
          price: "",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tyj-spring-roll-pastry.jpg",
        },
        {
          id: 2889,
          name: "Trái sấu đông lạnh 500g - Gefrorenes Krokodil 500g",
          sku: "",
          price: "1.8",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/trai-sau-dong-lanh-2.jpg",
        },
        {
          id: 2887,
          name: "Tower red pepper powder 500g - Tower Paprikapulver 500g",
          sku: "",
          price: "",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tower-red-pepper-power.jpg",
        },
        {
          id: 2884,
          name: "Tomatenmark 850g",
          sku: "",
          price: "",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tomaten-mark.jpg",
        },
        {
          id: 2880,
          name: "Tôm thẻ hấp - Gedämpfte weiße Garnelen",
          sku: "",
          price: "",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tom-the-hap-2.jpg",
        },
        {
          id: 2876,
          name: "Thịt trái gấc - Gac-Fruchtfleisch",
          sku: "",
          price: "",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/thit-trai-gac.jpg",
        },
        {
          id: 2873,
          name: "Tamarind concentrate 454g - Tamarindenkonzentrat 454g",
          sku: "",
          price: "",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tamarind-concentrate.jpg",
        },
        {
          id: 2871,
          name: "Taekyung red pepper powder 454g - Taekyung Paprikapulver 454g",
          sku: "",
          price: "",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/taekyung-red-pepper-powder.jpg",
        },
        {
          id: 2868,
          name: "Lươn rút xương - Aal ohne Knochen",
          sku: "",
          price: "",
          stock_quantity: null,
          image_src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/swamp-eel-fillet.jpg",
        },
      ],
    );
    expect((await mambuApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products?per_page=10&page=1",
    })).count).toEqual(1);
  });

});