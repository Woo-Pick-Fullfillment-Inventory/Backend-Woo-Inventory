import {
  apps,
  clearFirestoreData,
} from "@firebase/rules-unit-testing";

import {
  getUserByAttribute,
  insertUser,
} from "../../src/repository/firestore";
import { mockUserWithHashedPassword } from "../common/mock-data";

beforeEach(async () => {
  await insertUser(mockUserWithHashedPassword);
});

afterEach(async () => {
  await clearFirestoreData({ projectId: "test-project" });
  await Promise.all(apps().map((app) => app.delete()));
});

it("should return mock user", async () => {
  const resp = await getUserByAttribute("username", mockUserWithHashedPassword.username);
  expect(resp).toEqual(mockUserWithHashedPassword);
});
