import express from "express";

import { getProducts } from "./get-products.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const productRouter = express.Router();

productRouter.get("/products", handleErrorFunction(getProducts));

export default productRouter;