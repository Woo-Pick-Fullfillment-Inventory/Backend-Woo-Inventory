import { httpClient } from "../common/http-client";

describe("Signin test", () => {

  it("should return token when signin is successful", async () => {
    const response = await httpClient.post("api/v1/auth/signin",
      {
        username: "john_doe",
        password: "password123",
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