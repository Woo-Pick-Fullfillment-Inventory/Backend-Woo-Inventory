// run this tests with the sdk in local

import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";

import { generateProductsArray } from "../../src/helpers/index.js";
import { firestoreRepository } from "../../src/repository/firestore/index.js";
import { getProductsFactory } from "../../src/repository/firestore/users-products/get-products.js";

import type { ProductsFireStorePaginationType } from "../../src/repository/firestore/users-products/get-products.js";

// todo: write test in the cicd pipeline also
describe("Firestore get product", () => {
  let db: FirebaseFirestore.Firestore;
  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await clearFirestoreData({ projectId: "test-project" });
  });

  afterEach(async () => {
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should get 10 products order by product id direction desc", async () => {
    const mockProducts = await generateProductsArray(10);
    await firestoreRepository.product.batchWriteProducts(mockProducts, "1");

    const result = await getProductsFactory(db)({
      userId: "1",
      field: "id",
      direction: "desc",
      limit: 10,
    })() as ProductsFireStorePaginationType;
    expect(result.products.length).toBe(10);
    for (let i = 0; i < result.products.length - 1; i++) {
      // eslint-disable-next-line
      expect(result.products[i]!.id).toBeGreaterThanOrEqual(result.products[i + 1]!.id);
    }
  });

  it("should get 10 products order by product name direction desc", async () => {
    const mockProducts = await generateProductsArray(10);
    await firestoreRepository.product.batchWriteProducts(mockProducts, "1");

    const result = await getProductsFactory(db)({
      userId: "1",
      field: "name",
      direction: "desc",
      limit: 10,
    })() as ProductsFireStorePaginationType;
    expect(result.products.length).toBe(10);
    for (let i = 0; i < result.products.length - 1; i++) {
      // eslint-disable-next-line
      expect(result.products[i]!.name.localeCompare(result.products[i + 1]!.name)).toBeGreaterThanOrEqual(0);
    }
  });
});
