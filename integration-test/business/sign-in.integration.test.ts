import { randomUUID } from "crypto";
import { WireMockRestClient } from "wiremock-rest-client";
import { httpClient } from "../common/http-client";
import { apps, clearFirestoreData, initializeAdminApp } from "@firebase/rules-unit-testing";
import { setDbClient } from "../../src/repository/firestore";

const mambuApiMockServer = new WireMockRestClient("http://localhost:1080", { logLevel: "silent" });
describe("Signin test", () => {
  
  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  }); 

  beforeEach(async () => {
    const app = initializeAdminApp({ projectId: "test-project" }).firestore();
    setDbClient(app);
    await mambuApiMockServer.requests.deleteAllRequests();
  });

  it("should return a token when log in was succesful", async () => {
    const email = `${randomUUID()}@test.com`;
    const username = randomUUID();
    const signUpResponse = await httpClient.post("api/v1/auth/signup",
      {
        appURL: "https://testwebsite.com",
        email: email,
        username: username,
        password: "Test123abcjs",
        passwordConfirmation: "Test123abcjs",
        token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|cs_0843d7cdeb3bccc539e7ec2452c1be9520098cfb",
      });
    expect(signUpResponse.status).toEqual(200);
    expect((await mambuApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/system_status",
    })).count).toEqual(1);
    const responseEmail = await httpClient.post("api/v1/auth/signin",
      {
        emailOrUsername: email,
        password: "Test123abcjs",
      });
    expect(responseEmail.status).toEqual(200);
    const responseUsername = await httpClient.post("api/v1/auth/signin",
      {
        emailOrUsername: username,
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