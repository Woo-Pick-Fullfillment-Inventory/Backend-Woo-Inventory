import { isResponseTypeTrue } from "../../src/modules/create-response-type-guard.js";
import {
  ProductFireStoreSchema,
  ProductsFireStoreSchema,
} from "../../src/repository/firestore/models/product.type.js";
import { ProductSchema } from "../../src/repository/woo-api/models/index.js";

describe("return type check tests", () => {
  it("should return error", async () => {
    const data = {
      name: "product1",
      price: "100",
    };
    const result = isResponseTypeTrue(ProductFireStoreSchema, data, true);
    expect(result.isValid).toBe(false);
  });
  it("should return error when schema is an array", async () => {
    const data = [
      {
        name: "product1",
        price: "100",
      },
      {
        name: "product2",
        price: "200",
      },
    ];
    const result = isResponseTypeTrue(ProductsFireStoreSchema, data, true);
    expect(result.isValid).toBe(false);
  });
  it("should return error when price is expected as number", async () => {
    const data = {
      id: 2144,
      name: "Gạo Thuyền Rồng - Thai Premium Reis Hom Mali Reis",
      slug: "gao-thuyen-rong-thai-premium-reis-hom-mali-reis",
      sku: "",
      price: 100,
      regular_price: "",
      categories: [
        {
          id: 118,
          name: "Gạo",
          slug: "reis",
        },
      ],
      images: [
        {
          id: 2209,
          src: "https://thanhcong-asia-gmbh.de/wp-content/uploads/2022/06/mali-rice.jpg",
          name: "mali rice",
        },
      ],
      stock_quantity: null,
    };
    const result = isResponseTypeTrue(ProductSchema, data, true) as { isValid: boolean, errorMessage: string };
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("#/properties/price/type must be string");
  });
});
