import createAxiosClient from "../../../modules/axios/create-axios-client.js";
import {
  axiosOnFulfillmentErrorLogger,
  axiosOnRejectedErrorLogger,
} from "../../../modules/axios/create-axios-error-logger-mappings.js";
import {
  type ProductFromWooType,
  ProductsFromWooSchema,
  type ProductsFromWooType,
} from "../index.js";
type getAllProductsPaginationResponse = {
  products: ProductFromWooType[];
  totalItems: number;
  totalPages: number;
};

export const getProductsPaginationFactory = async ({
  baseUrl,
  token,
  perPage,
  page,
}: {
  baseUrl: string;
  token: string;
  perPage: number;
  page: number;
}): Promise<getAllProductsPaginationResponse> => {
  const { get } = createAxiosClient<ProductsFromWooType>({
    config: {
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    interceptors: [
      {
        onFulfillment: axiosOnFulfillmentErrorLogger({
          expectedStatusCode: 200,
          expectedSchema: ProductsFromWooSchema,
        }),
        onRejected: axiosOnRejectedErrorLogger,
      },
    ],
  });

  const {
    data,
    headers,
  } = await get(
    `/wp-json/wc/v3/products?per_page=${perPage}&page=${page}`,
    { headers: { Authorization: token } },
  );

  if (
    headers["x-wp-total"] === undefined ||
    headers["x-wp-totalpages"] === undefined
  ) {
    throw new Error("Response headers not expected");
  }

  return {
    products: data.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      slug: product.slug,
      categories: product.categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
      images: product.images.map((image) => ({
        id: image.id,
        src: image.src,
      })),
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      tax_class: product.tax_class,
      tax_status: product.tax_status,
      stock_quantity: product.stock_quantity,
    })),
    totalItems: parseInt(headers["x-wp-total"] as string, 10),
    totalPages: parseInt(headers["x-wp-totalpages"] as string, 10),
  };
};
