import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";

import { getProductsFactoryEmulator } from "./firestore-emulator/get-product-factory";
import { getUserFactoryEmulator } from "./firestore-emulator/get-user-factory";
import { batchWriteProductsFactory } from "../../src/repository/firestore/products/batch-write-products";
import { generateProductsArray } from "../common/faker/generate-mock-products";

import type { ProductsFireStorePaginationType } from "../../src/repository/firestore/index.js";

describe("Firestore unit test operations", () => {
  let db: FirebaseFirestore.Firestore;
  const userId = "1";
  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    const mockProducts = await generateProductsArray(10);
    await batchWriteProductsFactory(db)(mockProducts, userId);
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should get 10 products order by product id direction desc", async () => {
    const result = (await getProductsFactoryEmulator(db)({
      userId: "1",
      field: "id",
      direction: "desc",
      limit: 10,
    })()) as ProductsFireStorePaginationType;
    expect(result.products.length).toBe(10);
    for (let i = 0; i < result.products.length - 1; i++) {
      // eslint-disable-next-line
      expect(result.products[i]!.id).toBeGreaterThanOrEqual(
        // eslint-disable-next-line
        result.products[i + 1]!.id,
      );
    }
  });

  it("should get 10 products order by product name direction desc", async () => {
    const result = (await getProductsFactoryEmulator(db)({
      userId: "1",
      field: "name",
      direction: "desc",
      limit: 10,
    })()) as ProductsFireStorePaginationType;
    expect(result.products.length).toBe(10);
    for (let i = 0; i < result.products.length - 1; i++) {
      // eslint-disable-next-line
      expect(
        // eslint-disable-next-line
        result.products[i]!.name.localeCompare(result.products[i + 1]!.name),
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("should return user", async () => {
    const result = (await getUserFactoryEmulator(db)("username")("some-non-existing-username"));
    expect(result).toBeUndefined();
  });
});