import {
  apps,
  clearFirestoreData,
} from "@firebase/rules-unit-testing";

import {
  getUserByAttribute,
  insertUser,
} from "../../src/repository/firestore";
import { mockUser } from "../common/mock-data";

beforeEach(async () => {
  await insertUser(mockUser);
});

afterEach(async () => {
  await clearFirestoreData({ projectId: "test-project" });
  await Promise.all(apps().map((app) => app.delete()));
});

it("should return mock user", async () => {
  const resp = await getUserByAttribute("username", mockUser.username);
  expect(resp).toEqual(mockUser);
});
