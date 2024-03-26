// run this tests with the sdk in local

import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";

import { batchWriteProducts } from "../../src/repository/firestore";
import { getProductsFactory } from "../../src/repository/firestore/get-products";
import { generateProductsArray } from "../common/faker.js";

describe("Firestore get product", () => {
  let db: FirebaseFirestore.Firestore;
  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await clearFirestoreData({ projectId: "test-project" });
  });

  afterEach(async () => {
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should get 10 products", async () => {
    const mockProducts = await generateProductsArray(10);
    await batchWriteProducts(mockProducts, "1");

    const products = await getProductsFactory(db)({
      userId: "1",
      productAttribute: "id",
      direction: "desc",
    });
    console.log(products);
    expect(products.length).toBe(10);
  });
});
