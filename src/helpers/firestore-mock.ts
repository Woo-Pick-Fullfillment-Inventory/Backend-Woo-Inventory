import { generateProductsArray } from "./faker.js";
import { firestoreRepository } from "../repository/firestore/index.js";

import type { UserFireStoreType } from "../repository/firestore/models/user.type.js";

const mockUser: UserFireStoreType = {
  user_id: "1",
  email: "someone@gmail.com",
  username: "someone",
  password: "$2b$10$0ZS4yQgQbOTtm7ZajoMumejFapHqyVTOOWcT7v8cONhFFG9x8dwYe",
  store: { app_url: "https://testwebsite.com" },
  woo_credentials: {
    token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29",
    secret: "cs_0843d7cdeb3bccc539e7ec2452c1be9520098cfb",
  },
  authentication: {
    method: "woo_credentials",
    is_authorized: true,
  },
  last_login: "2024-02-06T00:00:00.000Z",
  are_products_synced: false,
};

const mockUserWrongType = {
  user_id: "2",
  email: "wrong@gmail.com",
  username: "someone",
  password: "$2b$10$0ZS4yQgQbOTtm7ZajoMumejFapHqyVTOOWcT7v8cONhFFG9x8dwYe",
  store: { app_url: "https://testwebsite.com" },
  woo_credentials: {
    token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29",
    secret: "cs_0843d7cdeb3bccc539e7ec2452c1be9520098cfb",
  },
  last_login: "2024-02-06T00:00:00.000Z",
  authentication: {
    method: "woo_credentials",
    is_authorized: true,
  },
};

const mockUserForSyncingProducts: UserFireStoreType = {
  user_id: "3",
  email: "someone33@gmail.com",
  username: "someone33",
  password: "$2b$10$0ZS4yQgQbOTtm7ZajoMumejFapHqyVTOOWcT7v8cONhFFG9x8dwYe",
  store: { app_url: "https://testwebsite.com" },
  woo_credentials: {
    token: "ck_1111",
    secret: "cs_2222",
  },
  authentication: {
    method: "woo_credentials",
    is_authorized: true,
  },
  last_login: "2024-02-06T00:00:00.000Z",
  are_products_synced: false,
};

const firestoreMock = {
  getProducts: async () => {
    const mockProducts = await generateProductsArray(27);
    await firestoreRepository.product.batchWriteProducts(mockProducts, "1");
  },
  signIn: async () => {
    await firestoreRepository.user.insertUser(mockUser);
    await firestoreRepository.user.insertUser(mockUserWrongType as UserFireStoreType);
  },
  signUp: async () => await firestoreRepository.user.insertUser(mockUser),
  syncProducts: async () => await firestoreRepository.user.insertUser(mockUserForSyncingProducts),
};

export default firestoreMock;