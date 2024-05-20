import express from "express";

import { searchOrders } from "./search-orders.js";
import { syncOrders } from "./sync-orders.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const orderRouter = express.Router();

orderRouter.post("/api/v1/orders/sync", handleErrorFunction(syncOrders));

orderRouter.post("/api/v1/orders:search", handleErrorFunction(searchOrders));

export default orderRouter;
