import { randomUUID } from "crypto";
import { WireMockRestClient } from "wiremock-rest-client";

import { httpClient } from "../common/http-client";
const mambuApiMockServer = new WireMockRestClient("http://localhost:1080", { logLevel: "silent" });
describe("Signin test", () => {
  afterEach(async () => {
    await mambuApiMockServer.requests.deleteAllRequests();
  });

  it("should return token when signin is successful", async () => {
    const email = randomUUID();
    const signInResponse = await httpClient.post("api/v1/auth/signup",
      {
        appURL: "https://testwebsite.com",
        email: `${email}@gmail.com`,
        username: "test",
        password: "Test123abcjs",
        token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|cs_0843d7cdeb3bccc539e7ec2452c1be9520098cfb",
      });
    expect(signInResponse.status).toEqual(200);
    expect((await mambuApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/system_status",
    })).count).toEqual(1);
    const response = await httpClient.post("api/v1/auth/signin",
      {
        email: `${email}@gmail.com`,
        password: "Test123abcjs",
      });
    expect(response.status).toEqual(200);
  });

  it("should return 400 when credentials are falsy", async () => {
    const response = await httpClient.post("api/v1/auth/signin",
      {
        username: "john_doehehhee",
        password: "password123",
      });
    expect(response.status).toEqual(200);
  });

  it("should return 400 when request body is falsy", async () => {
    const response = await httpClient.post("api/v1/auth/signin",
      {
        email: "john_doehehhee",
        username: "john_doehehhee",
        password: "password123",
      });
    expect(response.status).toEqual(200);
  });

});