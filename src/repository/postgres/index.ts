import pg from "pg";
const { Pool } = pg;

const database = new Pool({
  user: "woo-backend",
  host: "localhost",
  database: "integration-test",
  password: "woo-backend",
  port: 5432,
});

export default database;