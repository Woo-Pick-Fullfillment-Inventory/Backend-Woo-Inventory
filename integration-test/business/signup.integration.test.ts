import { WireMockRestClient } from "wiremock-rest-client";

import { httpClient } from "../common/http-client";

const mambuApiMockServer = new WireMockRestClient("http://localhost:1080", { logLevel: "silent" });

describe("Signup test", () => {
  afterEach(async () => {
    await mambuApiMockServer.requests.deleteAllRequests();
  });

  it("should return token when signup is successful", async () => {
    const response = await httpClient.post("api/v1/auth/signup",
      {
        appURL: "https://thanhcong-asia-gmbh.de",
        username: "test",
        password: "test",
        token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|cs_0843d7cdeb3bccc539e7ec2452c1be9520098cfb",
      });
    expect(response.status).toEqual(200);
    expect((await mambuApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products",
    })).count).toEqual(1);
  });

  it("should return error when token is invalid", async () => {
    const response = await httpClient.post("api/v1/auth/signup",
      {
        appURL: "https://thanhcong-asia-gmbh.de",
        username: "test",
        password: "test",
        token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29|some_random_string",
      });
    expect(response.status).toEqual(401);
    expect((await mambuApiMockServer.requests.getCount({
      method: "GET",
      url: "/wp-json/wc/v3/products",
    })).count).toEqual(1);
  });
});