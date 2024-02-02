import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import { randomUUID } from "crypto";
import { WireMockRestClient } from "wiremock-rest-client";

import { setfirestoreClient } from "../../src/repository/firestore";
import { insertUserFactory } from "../../src/repository/firestore/insert-user";
import { httpClient } from "../common/http-client";
import { mockUser } from "../common/mock-data";

const mambuApiMockServer = new WireMockRestClient("http://localhost:1080", { logLevel: "silent" });
describe("Signin test", () => {

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  beforeEach(async () => {
    const app = initializeAdminApp({ projectId: "test-project" }).firestore();
    setfirestoreClient(app);
    await insertUserFactory(app)(mockUser);
    await mambuApiMockServer.requests.deleteAllRequests();
  });

  it("should return a token when log in was succesful", async () => {
    const responseEmail = await httpClient.post("api/v1/auth/signin",
      {
        emailOrUsername: "someone@gmail.com",
        password: "Test123abcjs",
      });
    expect(responseEmail.status).toEqual(200);
    const responseUsername = await httpClient.post("api/v1/auth/signin",
      {
        emailOrUsername: "someone",
        password: "Test123abcjs",
      });
    expect(responseUsername.status).toEqual(200);
  });

  it("should return a error when credentials are falsy", async () => {
    const response = await httpClient.post("api/v1/auth/signin",
      {
        emailOrUsername: `${randomUUID()}@email.com`,
        password: "Test123abcjsasdasd",
      });
    expect(response.status).toEqual(400);
  });
});
