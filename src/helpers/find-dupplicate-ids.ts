import type {
  OrderWooType,
  ProductWooType,
  ProductsCategoryWooType,
} from "../repository/woo-api/index.js";

const findDuplicateIds = (data: ProductWooType[] | OrderWooType[] | ProductsCategoryWooType[]): number[] => {
  const idMap = new Map<number, number>();
  const duplicateIds: number[] = [];

  for (const item of data) {
    if (idMap.has(item.id)) {
      // eslint-disable-next-line
      idMap.set(item.id, idMap.get(item.id)! + 1);
    } else {
      idMap.set(item.id, 1);
    }
  }

  idMap.forEach((count, id) => {
    if (count > 1) {
      duplicateIds.push(id);
    }
  });

  return duplicateIds;
};

export default findDuplicateIds;