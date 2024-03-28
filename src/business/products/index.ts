import express from "express";

import { addProduct } from "./add-products.js";
import { areProductsSynced } from "./are-products-synced.js";
import { searchProducts } from "./search-products.js";
import { syncProducts } from "./sync-products.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const productRouter = express.Router();

productRouter.post("/products:search", handleErrorFunction(searchProducts));
productRouter.post("/products", handleErrorFunction(addProduct));

productRouter.get("/products/synced", handleErrorFunction(areProductsSynced));

productRouter.post("/products/sync", handleErrorFunction(syncProducts));

export default productRouter;