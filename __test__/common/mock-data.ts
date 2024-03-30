import type { UserFireStoreType } from "../../src/repository/firestore/models/user.type.js";
import type { ProductsType } from "../../src/repository/woo-api/models/products.type.js";

export const mockUserWithHashedPassword: UserFireStoreType = {
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

export const mockUserWrongType = {
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

export const mockUserForSyncingProducts: UserFireStoreType = {
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

export const mockUserForSyncingProductsFalsyTypeProductReturn: UserFireStoreType = {
  user_id: "4",
  email: "someone44@gmail.com",
  username: "someone44",
  password: "$2b$10$0ZS4yQgQbOTtm7ZajoMumejFapHqyVTOOWcT7v8cONhFFG9x8dwYe",
  store: { app_url: "https://testwebsite.com" },
  woo_credentials: {
    token: "ck_9999",
    secret: "cs_9999",
  },
  authentication: {
    method: "woo_credentials",
    is_authorized: true,
  },
  last_login: "2024-02-06T00:00:00.000Z",
  are_products_synced: false,
};

export const mockProducts: ProductsType = [
  {
    id: 1,
    name: "product 1",
    sku: "sku-1",
    price: "100",
    stock_quantity: 10,
    images: [
      {
        id: 1,
        src: "https://testwebsite.com/image1.jpg",
      },
    ],
  },
  {
    id: 2,
    name: "product 2",
    sku: "sku-2",
    price: "200",
    stock_quantity: 20,
    images: [
      {
        id: 2,
        src: "https://testwebsite.com/image2.jpg",
      },
    ],
  },
];
