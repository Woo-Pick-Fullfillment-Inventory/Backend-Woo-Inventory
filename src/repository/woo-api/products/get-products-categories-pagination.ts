import createAxiosClient from "../../../modules/axios/create-axios-client.js";
import {
  axiosOnFulfillmentErrorLogger,
  axiosOnRejectedErrorLogger,
} from "../../../modules/axios/create-axios-error-logger-mappings.js";
import {
  ProductsCategoriesFromWooSchema,
  type ProductsCategoriesFromWooType,
} from "../index.js";

type getAllProductsPaginationResponse = {
  categories: ProductsCategoriesFromWooType;
  totalItems: number;
  totalPages: number;
};

export const getProductsCategoriesPaginationFactory = async ({
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
  const { get } = createAxiosClient<ProductsCategoriesFromWooType>({
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
          expectedSchema: ProductsCategoriesFromWooSchema,
        }),
        onRejected: axiosOnRejectedErrorLogger,
      },
    ],
  });

  const {
    data,
    headers,
  } = await get(
    `/wp-json/wc/v3/products/categories?per_page=${perPage}&page=${page}`,
    { headers: { Authorization: token } },
  );

  if (
    headers["x-wp-total"] === undefined ||
    headers["x-wp-totalpages"] === undefined
  ) {
    throw new Error("Response headers not expected");
  }

  return {
    categories: data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parent: category.parent,
      description: category.description,
      display: category.display,
      image: category.image ? {
        id: category.image.id,
        src: category.image.src,
      } : null,
      menu_order: category.menu_order || null,
      count: category.count || null,
    })),
    totalItems: parseInt(headers["x-wp-total"] as string, 10),
    totalPages: parseInt(headers["x-wp-totalpages"] as string, 10),
  };
};
