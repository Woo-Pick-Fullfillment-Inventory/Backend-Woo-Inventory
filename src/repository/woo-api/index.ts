import {
  ProductSchema,
  ProductsSchema,
} from "./models/products.type.js";
import { SystemStatusSchema } from "./models/system-status.type.js";
import { getProductsPaginationFactory } from "./products/get-products-pagination.js";
import { postAddProductFactory } from "./products/post-add-product.js";
import { getSystemStatusFactory } from "./system/get-system-status.js";

import type {
  ProductFromWooType,
  ProductType,
  ProductsFromWooType,
  ProductsType,
} from "./models/products.type.js";
import type { SystemStatusType } from "./models/system-status.type.js";

export const wooApiRepository = {
  system: { getSystemStatus: getSystemStatusFactory },
  product: {
    getProductsPagination: getProductsPaginationFactory,
    postAddProduct: postAddProductFactory,
  },
};

export {
  ProductFromWooType,
  ProductsFromWooType,
  ProductType,
  ProductsType,
  SystemStatusType,
  SystemStatusSchema,
  ProductsSchema,
  ProductSchema,
};
