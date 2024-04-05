1. Retrieve all products from Woo Api
- grouped products attribute is still unknown
- expiration date idea still unknown

2. Add new Product

woo product type:
type = {
  sku: string;
  name: string;
  product_group: string;
  price: string;
  regular_price: string;
  sale_price: string;
  tax: {
    tax_class: "taxable" | "shipping";
    tax_status: string;
  };
  dimensions: "length" | "width" | "height";
  weight: string;
};
