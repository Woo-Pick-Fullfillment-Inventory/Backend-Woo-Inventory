import {
  ProductsCategoriesWooSchema,
  ProductsCategoryWooSchema,
} from "./models/category.tye.js";
import {
  ImageWooSchema,
  type ImageWooType,
} from "./models/image.type.js";
import {
  OrderWooSchema,
  OrdersWooSchema,
} from "./models/order.type.js";
import {
  ProductWooSchema,
  ProductsWooSchema,
} from "./models/product.type.js";
import {
  SystemStatusWooSchema,
  type SystemStatusWooType,
} from "./models/system.type.js";
import { getOrdersPaginationFactory } from "./orders/get-orders-pagination.js";
import { getProductsCategoriesPaginationFactory } from "./products/get-products-categories-pagination.js";
import { getProductsPaginationFactory } from "./products/get-products-pagination.js";
import { postAddProductFactory } from "./products/post-add-product.js";
import { getSystemStatusFactory } from "./system/get-system-status.js";

import type {
  ProductsCategoriesWooType,
  ProductsCategoryWooType,
} from "./models/category.tye.js";
import type {
  OrderWooType,
  OrdersWooType,
} from "./models/order.type.js";
import type {
  ProductWooType,
  ProductsWooType,
} from "./models/product.type.js";

export const wooApiRepository = {
  system: { getSystemStatus: getSystemStatusFactory },
  product: {
    getProductsPagination: getProductsPaginationFactory,
    getProductsCategoriesPagination: getProductsCategoriesPaginationFactory,
    postAddProduct: postAddProductFactory,
  },
  order: { getOrdersPagination: getOrdersPaginationFactory },
};

export {
  ProductWooType,
  ProductsWooType,
  SystemStatusWooType,
  ProductsCategoryWooType,
  ProductsCategoriesWooType,
  ImageWooType,
  OrderWooType,
  OrdersWooType,
  SystemStatusWooSchema,
  ProductsWooSchema,
  ProductWooSchema,
  ProductsCategoryWooSchema,
  ProductsCategoriesWooSchema,
  ImageWooSchema,
  OrderWooSchema,
  OrdersWooSchema,
};
