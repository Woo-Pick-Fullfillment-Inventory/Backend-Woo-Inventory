import type {
  ProductFromWooType,
  ProductType,
  ProductsFromWooType,
  ProductsType,
} from "..";

export const convertWooProductToClient = (
  product: ProductFromWooType,
): ProductType => {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    categories: product.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })),
    regular_price: product.regular_price,
    sale_price: product.sale_price,
    stock_quantity: product.stock_quantity,
    images: product.images.map((image) => ({
      id: image.id,
      src: image.src,
    })),
  };
};

export const convertWooProductsToClient = (
  products: ProductsFromWooType,
): ProductsType => {
  return products.map((product) => convertWooProductToClient(product));
};
