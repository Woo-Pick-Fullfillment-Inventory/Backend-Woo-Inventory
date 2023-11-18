import pg from "pg";

import {
  insertAppUser,
  updateAuthenticatedStatus,
} from "./appUsers.js";
import insertAppUserToWooUser from "./appUsersToWooUsers.js";
import insertWooUser from "./wooUsers.js";

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

const databaseFactory = {
  insertAppUser,
  insertAppUserToWooUser,
  insertWooUser,
  updateAuthenticatedStatus,
};

export {
  database,
  databaseFactory,
};