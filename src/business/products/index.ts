import express from "express";

import { areProductsSynced } from "./are-products-synced.js";
import { searchProducts } from "./search-products.js";
import { syncProducts } from "./sync-products.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const productRouter = express.Router();

productRouter.post("/api/v1/products:search", handleErrorFunction(searchProducts));

productRouter.get("/api/v1/products/synced", handleErrorFunction(areProductsSynced));

productRouter.post("/api/v1/products/sync", handleErrorFunction(syncProducts));

export default productRouter;