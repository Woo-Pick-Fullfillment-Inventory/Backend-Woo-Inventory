// @ts-nocheck
conn = new Mongo();
db = conn.getDB("test-database");

db.users.insertOne({
  _id: ObjectId("5f8a0b9e8b0b8b1f1c1f1c1f"),
  user_id: "5f8a0b9e8b0b8b1f1c1f1c1f",
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
});

db.users.insertOne({
  _id: ObjectId("6634e9a7e541882e2b99ea72"),
  user_id: "6634e9a7e541882e2b99ea72",
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
});