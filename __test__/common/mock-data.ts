import type { UserFireStoreType } from "../../src/repository/firestore/models/user.type.js";

export const mockUser: UserFireStoreType = {
  user_id: "1",
  email: "someone@gmail.com",
  username: "someone",
  password: "Test123abcjs",
  store: { app_url: "https://testwebsite.com" },
  woo_credentials: {
    token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29",
    secret: "cs_0843d7cdeb3bccc539e7ec2452c1be9520098cfb",
  },
  authentication: {
    method: "woo_credentials",
    is_authorized: true,
  },
  are_products_synced: false,
};

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
  are_products_synced: false,
};
