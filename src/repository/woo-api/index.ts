import { getProductsPaginationFactory } from "./products/get-products-pagination.js";
import { getSystemStatusFactory } from "./system/get-system-status.js";
export const wooApiRepository = {
  system: { getSystemStatus: getSystemStatusFactory },
  product: { getProductsPagination: getProductsPaginationFactory },
};
