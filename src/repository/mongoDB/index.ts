import mongoClient from "./init-mongo.js";
import { getUserFactory } from "./users/get-user.js";
import { insertUserFactory } from "./users/insert-user.js";
import { updateUserFactory } from "./users/update-user.js";

const userCollection = mongoClient.db("test-database").collection("users");

export const mongoRepository = {
  user: {
    insertUser: insertUserFactory(userCollection),
    getUserByEmail: getUserFactory(userCollection)("email"),
    getUserByUsername: getUserFactory(userCollection)("username"),
    getUserById: getUserFactory(userCollection)("user_id"),
    updateUserLastLogin: updateUserFactory(userCollection)("last_login"),
    updateUserProductsSynced: updateUserFactory(userCollection)("sync.are_products_synced"),
    updateUserProductsCategoriesSynced: updateUserFactory(userCollection)("sync.are_products_categories_synced"),
    updateUserOrdersSynced: updateUserFactory(userCollection)("sync.are_orders_synced"),
  },
};
