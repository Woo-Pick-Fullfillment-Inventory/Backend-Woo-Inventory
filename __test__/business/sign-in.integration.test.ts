import { randomUUID } from "crypto";

import { httpClient } from "../common/http-client"; describe("Signin test", () => {

  it("should return a token when log in was succesful", async () => {
    const responseEmail = await httpClient.post("api/v1/auth/signin",
      {
        email_or_username: "someone@gmail.com",
        password: "Test123abcjs",
      });
    console.log(responseEmail.data);

    expect(responseEmail.status).toEqual(200);
    const responseUsername = await httpClient.post("api/v1/auth/signin",
      {
        email_or_username: "someone",
        password: "Test123abcjs",
      });
    console.log(responseUsername.data);
    expect(responseUsername.status).toEqual(200);
  });

  it("should return a 400 error when credentials are falsy", async () => {
    const response = await httpClient.post("api/v1/auth/signin",
      {
        email_or_username: `${randomUUID()}@email.com`,
        password: "Test123abcjsasdasd",
      });
    expect(response.status).toEqual(400);
  });

  it("should return a 400 error when request body is falsy", async () => {
    const response = await httpClient.post("api/v1/auth/signin",
      {
        email_or_username: `${randomUUID()}@email.com`,
        password: "Test123abcjsasdasd",
        some_fucking_attribute: "something",
      });
    expect(response.status).toEqual(400);
  });

  it("should throw error when user type is falsy", async() => {
    const response = await httpClient.post("api/v1/auth/signin",
      {
        email_or_username: "wrong@gmail.com",
        password: "Test123abcjs",
      });
    console.log(response.data);
    expect(response.status).toEqual(500);
  });
});
