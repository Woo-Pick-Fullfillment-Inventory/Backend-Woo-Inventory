import {
  ProductsCategoriesFromWooSchema,
  ProductsCategoryFromWooSchema,
} from "./models/category.tye.js";
import {
  ProductFromWooSchema,
  ProductsFromWooSchema,
} from "./models/products.type.js";
import { SystemStatusFromWooSchema } from "./models/systems.type.js";
import { getProductsCategoriesPaginationFactory } from "./products/get-products-categories-pagination.js";
import { getProductsPaginationFactory } from "./products/get-products-pagination.js";
import { postAddProductFactory } from "./products/post-add-product.js";
import { getSystemStatusFactory } from "./system/get-system-status.js";

import type {
  ProductsCategoriesFromWooType,
  ProductsCategoriesWooClientType,
  ProductsCategoryFromWooType,
  ProductsCategoryWooClientType,
} from "./models/category.tye.js";
import type {
  ProductFromWooType,
  ProductWooClientType,
  ProductsFromWooType,
  ProductsWooClientType,
} from "./models/products.type.js";
import type { SystemStatusFromWooType } from "./models/systems.type.js";

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
  ProductWooClientType,
  ProductsWooClientType,
  SystemStatusFromWooType,
  ProductsCategoryFromWooType,
  ProductsCategoriesFromWooType,
  ProductsCategoryWooClientType,
  ProductsCategoriesWooClientType,
  SystemStatusFromWooSchema,
  ProductsFromWooSchema,
  ProductFromWooSchema,
  ProductsCategoryFromWooSchema,
  ProductsCategoriesFromWooSchema,
};
