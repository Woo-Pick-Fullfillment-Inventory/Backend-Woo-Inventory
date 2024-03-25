import {
  apps,
  clearFirestoreData,
} from "@firebase/rules-unit-testing";

import {
  batchWriteProducts,
  getUserById,
  insertUser,
  viewCollection,
} from "../../src/repository/firestore";
import {
  mockProducts,
  mockUserWithHashedPassword,
  mockUserWrongType,
} from "../common/mock-data";

beforeEach(async () => {
  await insertUser(mockUserWithHashedPassword);
});

afterEach(async () => {
  await clearFirestoreData({ projectId: "test-project" });
  await Promise.all(apps().map((app) => app.delete()));
});

it("should return mock user", async () => {
  const resp = await getUserById(mockUserWithHashedPassword.username);
  expect(resp).toEqual(mockUserWithHashedPassword);
});

it("should batch write products", async () => {
  await batchWriteProducts(mockProducts, mockUserWithHashedPassword.user_id);
  await batchWriteProducts(mockProducts, mockUserWrongType.user_id);
  const products_user1 = await viewCollection("users-products/users-1-products/products");
  const products_user2 = await viewCollection("users-products/users-2-products/products");
  expect(products_user1).toEqual(mockProducts);
  expect(products_user2).toEqual(mockProducts);
});
