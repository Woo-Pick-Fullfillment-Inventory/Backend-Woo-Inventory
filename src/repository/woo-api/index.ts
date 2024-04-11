import {
  ProductFromWooType,
  ProductSchema,
  ProductType,
  ProductsCategoriesFromWooType,
  ProductsCategoriesSchema,
  type ProductsCategoriesType,

  ProductsCategoryFromWooType,
  ProductsCategorySchema,
  type ProductsCategoryType,
  ProductsFromWooType,
  ProductsSchema,
  ProductsType,
} from "./models/products.type.js";
import { SystemStatusSchema } from "./models/systems.type.js";
import { getProductsCategoriesPaginationFactory } from "./products/get-products-categories-pagination.js";
import { getProductsPaginationFactory } from "./products/get-products-pagination.js";
import { postAddProductFactory } from "./products/post-add-product.js";
import { getSystemStatusFactory } from "./system/get-system-status.js";

import type { SystemStatusType } from "./models/systems.type.js";

export const wooApiRepository = {
  system: { getSystemStatus: getSystemStatusFactory },
  product: {
    getProductsPagination: getProductsPaginationFactory,
    getProductsCategoriesPagination: getProductsCategoriesPaginationFactory,
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
  ProductsCategorySchema,
  ProductsCategoriesSchema,
  ProductsCategoryFromWooType,
  ProductsCategoriesFromWooType,
  ProductsCategoryType,
  ProductsCategoriesType,
};
