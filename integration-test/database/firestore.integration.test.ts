import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";

import {
  getDb,
  listItems,
  setDb,
} from "../../src/repository/firestore/index";

// Setup some mock data
const userId = "123";
const record = {
  name: "Test item",
  type: "Page",
  userId: userId,
  created: "1000000",
};

// Helper function to set up the test db instance
const authedApp = async () => {
  const app = await initializeAdminApp({ projectId: "bunny" });
  return app.firestore();
};

// beforeEach(async () => {
//   const app = await authedApp();
//   // Set the emulator database before each test
//   setDb(app);
// });

// beforeEach(async () => {
//   // Clear the database before each test
//   await clearFirestoreData({ projectId: "bunny" });
// });

// afterEach(async () => {
//   // Clean up the apps between tests.
//   await Promise.all(apps().map((app) => app.delete()));
// });

beforeAll(async () => {
  const app = await authedApp();
  // Set the emulator database before each test
  setDb(app);
  await getDb().collection("test-collection").add(record);
});

afterAll(async () => {
  // Clear the database before each test
  await clearFirestoreData({ projectId: "bunny" });
  // Clean up the apps between tests.
  await Promise.all(apps().map((app) => app.delete()));
});

it("should properly retrieve all items for a user", async () => {
  const resp = await listItems(userId);
  expect(resp).toBeDefined();
  expect(resp.length).toEqual(1);
  expect(resp[0]).toEqual(
    expect.objectContaining({
      name: "Test item",
      type: "Page",
      created: "1000000",
    }),
  );

  // Test that another user cannot see other user's items
  const resp2 = await listItems("124");
  expect(resp2.length).toEqual(0);
});