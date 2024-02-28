import type {
  ProductFromWooType,
  ProductType,
} from "../models/products.type.js";

export const convertWooProductToClient = (product: ProductFromWooType): ProductType => {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    stock_quantity: product.stock_quantity,
  };
};

export const convertWooProductsToClient = (products: ProductFromWooType[]): ProductType[] => {
  return products.map((product) => convertWooProductToClient(product));
};