import {
  batchWriteProducts,
  insertUser,
  viewCollection,
} from "../../src/repository/firestore";
import {
  mockProducts,
  mockUserWithHashedPassword,
  mockUserWrongType,
} from "../common/mock-data";

import type { UserFireStoreType } from "../../src/repository/firestore/models/user.type";
import type { ProductsType } from "../../src/repository/woo-api/models/products.type";

it("should return mock user", async () => {
  await insertUser(mockUserWithHashedPassword);
  const users = await viewCollection<UserFireStoreType>("users");
  expect(users[0]).toEqual(mockUserWithHashedPassword);
});

it("should batch write products", async () => {
  await batchWriteProducts(mockProducts, mockUserWithHashedPassword.user_id);
  await batchWriteProducts(mockProducts, mockUserWrongType.user_id);
  const products_user1 = await viewCollection<ProductsType>("users-products/users-1-products/products");
  const products_user2 = await viewCollection<ProductsType>("users-products/users-2-products/products");
  expect(products_user1).toEqual(mockProducts);
  expect(products_user2).toEqual(mockProducts);
});
