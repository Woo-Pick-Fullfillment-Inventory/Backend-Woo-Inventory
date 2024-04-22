import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { randomUUID } from "crypto";
import { WireMockRestClient } from "wiremock-rest-client";

import { insertUserFactory } from "../../src/repository/firestore/users/insert-user.js";
import { httpClient } from "../common/http-client";
import { mockUserWithHashedPassword } from "../common/mock-data";

const woocommerceApiMockServer = new WireMockRestClient(
  "http://localhost:1080",
  { logLevel: "silent" },
);

describe("Signup test", () => {
  let db: FirebaseFirestore.Firestore;

  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserWithHashedPassword);
    await woocommerceApiMockServer.requests.deleteAllRequests();
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should return token when signup is successful", async () => {
    const response = await httpClient.post("api/v1/auth/signup", {
      app_url: "https://testwebsite.com",
      email: `${randomUUID()}@email.com`,
      username: randomUUID(),
      password: "Test123abcjs",
      password_confirmation: "Test123abcjs",
      token:
        "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|cs_0843d7cdeb3bccc539e7ec2452c1be9520098cfb",
    });
    expect(response.status).toEqual(201);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/system_status",
        })
      ).count,
    ).toEqual(1);
  });

  it("should return error when token is invalid", async () => {
    const response = await httpClient.post("api/v1/auth/signup", {
      app_url: "https://testwebsite.com",
      email: `${randomUUID()}@email.com`,
      username: randomUUID(),
      password: "Test123abcjs",
      password_confirmation: "Test123abcjs",
      token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|some_random_string",
    });
    expect(response.status).toEqual(500);
    expect(
      (
        await woocommerceApiMockServer.requests.getCount({
          method: "GET",
          url: "/wp-json/wc/v3/system_status",
        })
      ).count,
    ).toEqual(1);
  });

  it("should return 400 when user already exists", async () => {
    const response = await httpClient.post("api/v1/auth/signup", {
      app_url: "https://testwebsite.com",
      email: `${randomUUID()}@email.com`,
      username: "someone",
      password: "Test123abcjs",
      password_confirmation: "Test123abcjs",
      token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|some_random_string",
    });
    expect(response.status).toEqual(400);
  });

  it("should return 400 when email is invalid", async () => {
    const response = await httpClient.post("api/v1/auth/signup", {
      app_url: "https://testwebsite.com",
      email: "test456@.com",
      username: randomUUID(),
      password: "Test123abcjs",
      password_confirmation: "Test123abcjs",
      token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|some_random_string",
    });
    expect(response.status).toEqual(400);
  });

  it("should return 400 when password not correctly configured", async () => {
    const response = await httpClient.post("api/v1/auth/signup", {
      app_url: "https://testwebsite.com",
      email: `${randomUUID()}@email.com`,
      username: randomUUID(),
      password: "123",
      password_confirmation: "123",
      token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|some_random_string",
    });
    expect(response.status).toEqual(400);
  });

  it("should return 400 when passwords not matched", async () => {
    const response = await httpClient.post("api/v1/auth/signup", {
      app_url: "https://testwebsite.com",
      email: `${randomUUID()}@email.com`,
      username: randomUUID(),
      password: "Test123abcjs",
      password_confirmation: "Test321abcjs",
      token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|some_random_string",
    });
    expect(response.status).toEqual(400);
  });
});
