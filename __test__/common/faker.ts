import { faker } from "@faker-js/faker";

import type {
  ProductType,
  ProductsType,
} from "../../src/repository/woo-api";

let productIdCounter = 0;

const generateRandomProduct = (): ProductType => {
  productIdCounter++;

  return {
    id: productIdCounter,
    name: faker.commerce.productName(),
    sku: faker.string.alpha(),
    regular_price: faker.number.int({
      min: 1,
      max: 1000,
    }).toString(),
    sale_price: faker.number.int({
      min: 1,
      max: 1000,
    }).toString(),
    stock_quantity: faker.number.int({
      min: 0,
      max: 100,
    }),
    images: Array.from(
      {
        length: faker.number.int({
          min: 1,
          max: 5,
        }),
      },
      () => ({
        id: faker.number.int({
          min: 100,
          max: 200,
        }),
        src: faker.image.url(),
      }),
    ),
    categories: Array.from(
      {
        length: faker.number.int({
          min: 1,
          max: 5,
        }),
      },
      () => ({
        id: faker.number.int({
          min: 100,
          max: 200,
        }),
        name: faker.commerce.department(),
        slug: faker.helpers.slugify(faker.commerce.department()),
      }),
    ),
    slug: faker.helpers.slugify(faker.commerce.productName()),

  };
};

export const generateProductsArray = async (
  numberOfProducts: number,
): Promise<ProductsType> => {
  productIdCounter = 0;
  return Array.from({ length: numberOfProducts }, () =>
    generateRandomProduct(),
  );
};
