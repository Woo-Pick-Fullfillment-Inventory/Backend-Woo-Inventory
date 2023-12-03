import dotenv from "dotenv";
import pg from "pg";
dotenv.config();
const { Pool } = pg;

const createDatabase = () => {
  return new Pool({
    user: process.env["DB_USER"],
    host: process.env["DB_HOST"],
    database: process.env["DB_NAME"],
    password: process.env["DB_PASSWORD"],
    port: Number(process.env["DB_PORT"]),
  });
};

const database = createDatabase();

// TODO : make database abstract
export default database;