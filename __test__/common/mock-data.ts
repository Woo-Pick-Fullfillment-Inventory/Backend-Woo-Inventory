import type { UserMongoType } from "../../src/repository/mongo/index.js";

export const mockUserWithHashedPassword: UserMongoType = {
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
  sync: {
    are_products_categories_synced: false,
    are_products_synced: false,
    are_orders_synced: false,
  },
} as UserMongoType;

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
} as UserMongoType;

export const mockUserDidntSync: UserMongoType = {
  user_id: "6634e9a7e541882e2b99ea74",
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
  sync: {
    are_products_categories_synced: false,
    are_products_synced: false,
    are_orders_synced: false,
  },
} as UserMongoType;

export const mockUserForSyncingProducts: UserMongoType = {
  user_id: "6634e9a7e541882e2b99ea73",
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
  sync: {
    are_products_categories_synced: false,
    are_products_synced: false,
    are_orders_synced: false,
  },
} as UserMongoType;

export const mockUserForSyncingOrders: UserMongoType = {
  user_id: "6634e9a7e541882e2b99ea76",
  email: "mock-order-user@gmail.com",
  username: "mock-order-user",
  password: "$2b$10$0ZS4yQgQbOTtm7ZajoMumejFapHqyVTOOWcT7v8cONhFFG9x8dwYe",
  store: { app_url: "https://testwebsite.com" },
  woo_credentials: {
    token: "mock-order-token",
    secret: "mock-order-secret",
  },
  authentication: {
    method: "woo_credentials",
    is_authorized: true,
  },
  last_login: "2024-02-06T00:00:00.000Z",
  sync: {
    are_products_categories_synced: false,
    are_products_synced: false,
    are_orders_synced: false,
  },
} as UserMongoType;

export const mockUserForSyncingProductsFalsyTypeProductReturn: UserMongoType = {
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
  sync: {
    are_products_categories_synced: false,
    are_products_synced: false,
    are_orders_synced: false,
  },
} as UserMongoType;

export const mockUserForAddingProduct: UserMongoType = {
  user_id: "6634e9a7e541882e2b99ea75",
  email: "someone44@gmail.com",
  username: "someone44",
  password: "$2b$10$0ZS4yQgQbOTtm7ZajoMumejFapHqyVTOOWcT7v8cONhFFG9x8dwYe",
  store: { app_url: "https://testwebsite.com" },
  woo_credentials: {
    token: "cs_1111",
    secret: "cs_2222",
  },
  authentication: {
    method: "woo_credentials",
    is_authorized: true,
  },
  last_login: "2024-02-06T00:00:00.000Z",
  sync: {
    are_products_categories_synced: false,
    are_products_synced: true,
    are_orders_synced: false,
  },
} as UserMongoType;

export const mockProducts = [
  {
    id: 1,
    name: "product 1",
    slug: "",
    sku: "sku-1",
    price: "100",
    regular_price: "100",
    sale_price: "100",
    stock_quantity: 10,
    images: [
      {
        id: 1,
        src: "https://testwebsite.com/image1.jpg",
      },
    ],
    categories: [
      {
        id: 1,
        name: "category 1",
        slug: "category-1",
      },
    ],
    tax_class: "standard",
    tax_status: "taxable",
  },
  {
    id: 2,
    name: "product 2",
    slug: "",
    sku: "sku-2",
    price: "200",
    regular_price: "200",
    sale_price: "200",
    stock_quantity: 20,
    images: [
      {
        id: 2,
        src: "https://testwebsite.com/image2.jpg",
      },
    ],
    categories: [
      {
        id: 2,
        name: "category 2",
        slug: "category-2",
      },
    ],
    tax_class: "reduced-rate",
    tax_status: "shipping",
  },
];
