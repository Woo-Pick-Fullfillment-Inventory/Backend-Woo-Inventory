import { isResponseTypeTrue } from "../../src/modules/create-response-type-guard.js";
import {
  ProductFireStoreSchema,
  ProductsFireStoreSchema,
} from "../../src/repository/firestore/models/product.type.js";

describe("Firestore get product", () => {
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
});
