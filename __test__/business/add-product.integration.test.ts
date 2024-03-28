import { WireMockRestClient } from "wiremock-rest-client";

import { firestoreRepository } from "../../src/repository/firestore/index.js";
import { createAuthorizationHeader } from "../common/create-authorization-header.js";
import { httpClient } from "../common/http-client";

import type { ProductsType } from "../../src/repository/woo-api/models";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);
describe("Get products test", () => {
  beforeEach(async () => {
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  it("should return a product", async () => {
    const userId = "1";
    const newProduct = {
      name: "Premium Quality",
      type: "simple",
      regular_price: "21.99",
      description:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
      short_description:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      categories: [
        { id: 9 },
        { id: 14 },
      ],
      images: [
        { src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg" },
        { src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg" },
      ],
    };
    const oldProductsCount = await firestoreRepository.collection.viewCollection<ProductsType>("users-products/users-1-products/products");
    const response = await httpClient.post("api/v1/products", newProduct, { headers: { authorization: createAuthorizationHeader(userId) } });
    const newProductsCount = await firestoreRepository.collection.viewCollection<ProductsType>("users-products/users-1-products/products");
    expect(newProductsCount.length).toEqual(oldProductsCount.length + 1);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(newProduct);
    expect(response.data.products).toEqual([
      {
        id: 2897,
        name: "Vegetable - Gemüse",
        sku: "S123",
        price: "3",
        stock_quantity: 100,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/vegetable.jpg",
      },
      {
        id: 2893,
        name: "Tyj spring roll pastry 550g - Tyj Frühlingsrollenteig 550g",
        sku: "",
        price: "",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tyj-spring-roll-pastry.jpg",
      },
      {
        id: 2889,
        name: "Trái sấu đông lạnh 500g - Gefrorenes Krokodil 500g",
        sku: "",
        price: "1.8",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/trai-sau-dong-lanh-2.jpg",
      },
      {
        id: 2887,
        name: "Tower red pepper powder 500g - Tower Paprikapulver 500g",
        sku: "",
        price: "",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tower-red-pepper-power.jpg",
      },
      {
        id: 2884,
        name: "Tomatenmark 850g",
        sku: "",
        price: "",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tomaten-mark.jpg",
      },
      {
        id: 2880,
        name: "Tôm thẻ hấp - Gedämpfte weiße Garnelen",
        sku: "",
        price: "",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tom-the-hap-2.jpg",
      },
      {
        id: 2876,
        name: "Thịt trái gấc - Gac-Fruchtfleisch",
        sku: "",
        price: "",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/thit-trai-gac.jpg",
      },
      {
        id: 2873,
        name: "Tamarind concentrate 454g - Tamarindenkonzentrat 454g",
        sku: "",
        price: "",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/tamarind-concentrate.jpg",
      },
      {
        id: 2871,
        name: "Taekyung red pepper powder 454g - Taekyung Paprikapulver 454g",
        sku: "",
        price: "",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/taekyung-red-pepper-powder.jpg",
      },
      {
        id: 2868,
        name: "Lươn rút xương - Aal ohne Knochen",
        sku: "",
        price: "",
        stock_quantity: null,
        image_src:
          "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/09/swamp-eel-fillet.jpg",
      },
      {
        name: "Premium Quality",
        type: "simple",
        regular_price: "21.99",
        description:
          "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
        short_description:
          "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        categories: [
          { id: 9 },
          { id: 14 },
        ],
        images: [
          { src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg" },
          { src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg" },
        ],
      },
    ]);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/products?per_page=10&page=1",
        })
      ).count,
    ).toEqual(1);
  });
});
