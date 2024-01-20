import { Spanner } from "@google-cloud/spanner";
import dotenv from "dotenv";

import {
  getAppUserByEmailFactory,
  getAppUserByUsernameFactory,
} from "./get-app-user.js";
import { insertAppUserToWooUserFactory } from "./insert-app-user-to-woo-user.js";
import { insertAppUserFactory } from "./insert-app-user.js";
import { insertWooUserFactory } from "./insert-woo-user.js";
import { updateAuthenticatedStatusFactory } from "./update-authenticated-status.js";

import type {
  Database,
  Instance,
} from "@google-cloud/spanner";
dotenv.config();

const spanner = new Spanner({ projectId: process.env["SPANNER_PROJECT_ID"] || "test-project" });

const instance = spanner.instance(process.env["SPANNER_INSTANCE_ID"] || "test-instance");

const database = instance.database(process.env["SPANNER_DATABASE_ID"] || "woo-app-users");

export type SpannerClientWooAppUsers = {
    spanner: Spanner;
    instance: Instance;
    database: Database;
}

const spannerClient: SpannerClientWooAppUsers = {
  spanner,
  instance,
  database,
};

export const _getAppUserByEmail = getAppUserByEmailFactory(spannerClient);
export const _getAppUserByUsername = getAppUserByUsernameFactory(spannerClient);
export const _insertAppUserToWooUser = insertAppUserToWooUserFactory(spannerClient);
export const _insertAppUser = insertAppUserFactory(spannerClient);
export const _insertWooUser = insertWooUserFactory(spannerClient);
export const _updateAuthenticatedStatus = updateAuthenticatedStatusFactory(spannerClient);