import createAxiosClient from "../../../modules/axios/create-axios-client.js";
import {
  axiosOnFulfillmentErrorLogger,
  axiosOnRejectedErrorLogger,
} from "../../../modules/axios/create-axios-error-logger-mappings.js";
import {
  ProductFromWooSchema,
  type ProductFromWooType,
  type ProductWooClientType,
} from "../index.js";

type AddProductRequestFromUserType = {
  name: string;
  sku: string | undefined;
  categories: {
    id: string;
    name: string;
    slug: string;
  }[] | undefined;
  barcode: string | undefined;
  imei: string | undefined;
  supplier: string | undefined;
  purchase_price: string | undefined;
  regular_price: string | undefined;
  sale_price: string | undefined;
  tax_status: "taxable" | "shipping" | "none" | undefined;
  tax_class: "standard" | "reduced rate" | "zero rate" | undefined;
  unit: string | undefined;
  activate: boolean | undefined;
  images: {
    src: string;
  }[] | undefined;
}

export const postAddProductFactory = async ({
  baseUrl,
  token,
  addProductRequestFromUser,
}: {
  baseUrl: string;
  token: string;
  addProductRequestFromUser: AddProductRequestFromUserType;
}): Promise<Pick<ProductWooClientType, "id" | "images">> => {
  const { post } = createAxiosClient<ProductFromWooType>({
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
          expectedStatusCode: 201,
          expectedSchema: ProductFromWooSchema,
        }),
        onRejected: axiosOnRejectedErrorLogger,
      },
    ],
  });

  const { data } = await post(
    "/wp-json/wc/v3/products",
    addProductRequestFromUser,
    { headers: { Authorization: token } },
  );

  return {
    id: data.id,
    images: data.images,
  };
};
