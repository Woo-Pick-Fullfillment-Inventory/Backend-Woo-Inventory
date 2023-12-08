import { Spanner } from "@google-cloud/spanner";
import dotenv from "dotenv";
dotenv.config();

const spanner = new Spanner({ projectId: process.env["SPANNER_PROJECT_ID"] || "test-project" });

const instance = spanner.instance(process.env["SPANNER_INSTANCE_ID"] || "test-instance");

const database = instance.database(process.env["SPANNER_DATABASE_ID"] || "woo-app-users");

// TODO : make database abstract
export default database;