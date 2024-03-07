import express from "express";

import { getProducts } from "./get-products.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";
import { areProductsSynced } from "./are-products-synced.js";

const productRouter = express.Router();

productRouter.get("/products", handleErrorFunction(getProducts));

productRouter.get("/products/synced", handleErrorFunction(areProductsSynced));

export default productRouter;