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

=> Resolved

3. Name dupplicates between firestore and woo Repository => Resolved

4. check system status at opening app => ensure that token is available!

5. do we actually need to validate woo api response type?

becareful validating the fields from woo. there can be nullish fields unexpected from sites that are not correctly built. therefore, no need to be strict.

6. logging order still not correct!

7. mounting mongodb docker doesnt work on github pipeline!