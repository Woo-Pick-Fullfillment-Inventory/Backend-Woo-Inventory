import { postAddProductFactory } from "./post-add-product.js";
import { getProductsPaginationFactory } from "./products/get-products-pagination.js";
import { getSystemStatusFactory } from "./system/get-system-status.js";
export const wooApiRepository = {
  system: { getSystemStatus: getSystemStatusFactory },
  product: {
    getProductsPagination: getProductsPaginationFactory,
    postAddProduct: postAddProductFactory,
  },
};
