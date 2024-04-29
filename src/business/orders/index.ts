import express from "express";

import { syncOrders } from "./sync-orders.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const orderRouter = express.Router();

orderRouter.post("/api/v1/orders/sync", handleErrorFunction(syncOrders));

export default orderRouter;
