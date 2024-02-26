import type {
  ProductFromWooType,
  ProductType,
} from "../models/products.type.js";

export const convertWooProductToClient = (product: ProductFromWooType): ProductType => {
  return {
    name: product.name,
    sku: product.sku,
    price: product.price,
  };
};

export const convertWooProductsToClient = (products: ProductFromWooType[]): ProductType[] => {
  return products.map((product) => convertWooProductToClient(product));
};