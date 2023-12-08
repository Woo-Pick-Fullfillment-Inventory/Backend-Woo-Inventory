import { Spanner } from "@google-cloud/spanner";
import dotenv from "dotenv";
dotenv.config();

const spanner = new Spanner({ projectId: process.env["PROJECT_ID"] || "test-project" });

const instance = spanner.instance(process.env["INSTANCE_ID"] || "test-instance");

const database = instance.database(process.env["DATABASE_ID"] || "woo-app-users");

// TODO : make database abstract
export default database;