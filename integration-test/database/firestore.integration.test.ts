import {
  apps,
  clearFirestoreData,
} from "@firebase/rules-unit-testing";

import { listItemsFactory } from "./firestore-mock-operation";
import { firestoreClient } from "../../src/repository/firestore";

const userId = "123";
const record = {
  name: "Test item",
  type: "Page",
  userId: userId,
  created: "1000000",
};

beforeEach(async () => {
  await firestoreClient.collection("test-collection").add(record);
});

afterEach(async () => {
  await clearFirestoreData({ projectId: "test-project" });
  await Promise.all(apps().map((app) => app.delete()));
});

it("should properly retrieve all items for a user", async () => {
  const resp = await listItemsFactory(firestoreClient)(userId);
  expect(resp).toBeDefined();
  expect(resp.length).toEqual(1);
  expect(resp[0]).toEqual(
    expect.objectContaining({
      name: "Test item",
      type: "Page",
      created: "1000000",
    }),
  );
  const resp2 = await listItemsFactory(firestoreClient)("124");
  expect(resp2.length).toEqual(0);
});
