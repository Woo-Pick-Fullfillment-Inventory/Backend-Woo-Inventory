import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { randomUUID } from "crypto";

import { insertUserFactory } from "../../src/repository/firestore/users/insert-user.js";
import { httpClient } from "../common/http-client.js";
import {
  mockUserWithHashedPassword,
  mockUserWrongType,
} from "../common/mock-data.js";

import type { UserFireStoreType } from "../../src/repository/firestore/index.js";

describe("Signin test", () => {
  let db: FirebaseFirestore.Firestore;

  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserWithHashedPassword);
    await insertUserFactory(db)(mockUserWrongType as UserFireStoreType);
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should return a token when log in was succesful", async () => {
    const responseEmail = await httpClient.post("api/v1/auth/signin", {
      email_or_username: "someone@gmail.com",
      password: "Test123abcjs",
    });
    expect(responseEmail.status).toEqual(201);
    const responseUsername = await httpClient.post("api/v1/auth/signin", {
      email_or_username: "someone",
      password: "Test123abcjs",
    });
    expect(responseUsername.status).toEqual(201);
  });

  it("should return a 400 error when credentials are falsy", async () => {
    const response = await httpClient.post("api/v1/auth/signin", {
      email_or_username: `${randomUUID()}@email.com`,
      password: "Test123abcjsasdasd",
    });
    expect(response.status).toEqual(400);
  });

  it("should return a 400 error when request body is falsy", async () => {
    const response = await httpClient.post("api/v1/auth/signin", {
      email_or_username: `${randomUUID()}@email.com`,
      password: "Test123abcjsasdasd",
      some_fucking_attribute: "something",
    });
    expect(response.status).toEqual(400);
  });

  it("should throw error when user type is falsy", async () => {
    const response = await httpClient.post("api/v1/auth/signin", {
      email_or_username: "wrong@gmail.com",
      password: "Test123abcjs",
    });
    expect(response.status).toEqual(500);
  });
});
