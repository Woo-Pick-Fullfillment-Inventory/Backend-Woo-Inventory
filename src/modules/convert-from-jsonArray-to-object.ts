import type { Rows } from "@google-cloud/spanner/build/src/transaction";

type SpannerArrayType = {
    name: string;
    value: string;
}

type SpannerObject = {
    [key: string]: string | boolean;
}

export const fromJsonArrayToObject = (jsonArray: Rows): SpannerObject | undefined => {
  if (jsonArray.length !== 1 || jsonArray[0]=== undefined) return undefined;
  return jsonArray[0].reduce((obj: SpannerObject, item: SpannerArrayType) => {
    obj[item.name] = item.value;
    return obj; }
  , {});
};
