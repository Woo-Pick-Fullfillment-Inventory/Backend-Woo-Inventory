import express from "express";

import { areProductsSynced } from "./are-products-synced.js";
import { postGetProducts } from "./post-get-products.js";
import { syncProducts } from "./sync-products.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const productRouter = express.Router();

productRouter.post("/products:search", handleErrorFunction(postGetProducts));

productRouter.get("/products/synced", handleErrorFunction(areProductsSynced));

productRouter.post("/products/sync", handleErrorFunction(syncProducts));

export default productRouter;