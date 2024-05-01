import {
  apps,
  clearFirestoreData,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";

import writeAllDataToFirestore from "../../src/modules/create-write-data-to-firestore-batch.js";
import { viewCollectionFactory } from "../../src/repository/firestore/collection/view-collection.js";
import { insertUserFactory } from "../../src/repository/firestore/users/insert-user";
import { generateOrdersArray } from "../common/faker/generate-mock-orders";
import { mockUserForSyncingOrders } from "../common/mock-data.js";

describe("batch data write firestore tests", () => {
  let db: FirebaseFirestore.Firestore;

  beforeEach(async () => {
    db = initializeAdminApp({ projectId: "test-project" }).firestore();
    await insertUserFactory(db)(mockUserForSyncingOrders);
  });

  afterEach(async () => {
    await clearFirestoreData({ projectId: "test-project" });
    await Promise.all(apps().map((app) => app.delete()));
  });

  it("should return 3 orders", async () => {
    const orders = await generateOrdersArray(3);

    await writeAllDataToFirestore(
      {
        data: orders,
        usecase: "orders",
        userId: mockUserForSyncingOrders.user_id,
      },
    );
    const ordersFromFirestore = await viewCollectionFactory(db)(
      `orders/users-${mockUserForSyncingOrders.user_id}/users-orders`,
    );
    expect(ordersFromFirestore.length).toEqual(3);
  });

  it("should return 817 orders", async () => {
    const orders = await generateOrdersArray(817);

    await writeAllDataToFirestore(
      {
        data: orders,
        usecase: "orders",
        userId: mockUserForSyncingOrders.user_id,
      },
    );
    const ordersFromFirestore = await viewCollectionFactory(db)(
      `orders/users-${mockUserForSyncingOrders.user_id}/users-orders`,
    );
    expect(ordersFromFirestore.length).toEqual(817);
  });

  it("should return 1417 orders", async () => {
    const orders = await generateOrdersArray(1417);

    await writeAllDataToFirestore(
      {
        data: orders,
        usecase: "orders",
        userId: mockUserForSyncingOrders.user_id,
      },
    );
    const ordersFromFirestore = await viewCollectionFactory(db)(
      `orders/users-${mockUserForSyncingOrders.user_id}/users-orders`,
    );
    expect(ordersFromFirestore.length).toEqual(1417);
  });
});
