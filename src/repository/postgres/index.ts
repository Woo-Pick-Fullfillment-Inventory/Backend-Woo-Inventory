import pg from "pg";

import insertUser from "./users.js";

const { Pool } = pg;

const createDatabase = () => {
  return new Pool({
    user: "woo-backend",
    host: "localhost",
    database: "integration-test",
    password: "woo-backend",
    port: 5432,
  });
};

const database = createDatabase();

const databaseFactory = { insertUser };

export {
  database,
  databaseFactory,
};