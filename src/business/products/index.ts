import express from "express";

import { addProduct } from "./add-product.js";
import { areProductsSynced } from "./are-products-synced.js";
import { getProductsCategories } from "./get-products-categories.js";
import { searchProducts } from "./search-products.js";
import { syncProductsCategories } from "./sync-products-categories.js";
import { syncProducts } from "./sync-products.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";
const productRouter = express.Router();

productRouter.post("/api/v1/products:search", handleErrorFunction(searchProducts));
productRouter.get("/api/v1/products/synced", handleErrorFunction(areProductsSynced));
productRouter.post("/api/v1/products/sync", handleErrorFunction(syncProducts));
productRouter.post("/api/v1/products", handleErrorFunction(addProduct));
productRouter.post("/api/v1/products/categories/sync", handleErrorFunction(syncProductsCategories));
productRouter.get("/api/v1/products/categories", handleErrorFunction(getProductsCategories));

export default productRouter;
