import type { ProductsCategoryFireStoreClientType } from "../repository/firestore/index.js";

type HierarchicalObjectType = {
  [key: number]: {
    id: number;
    name: string;
    slug: string;
    parent: number;
    children?: HierarchicalObjectType | null | ProductsCategoryFireStoreClientType[];
  };
};

export const convertCategoriesToCLient = ({
  data,
  parentId,
}: {
    data: ProductsCategoryFireStoreClientType[];
    parentId: number;
}): HierarchicalObjectType => {
  const children: ProductsCategoryFireStoreClientType[] = [];
  data
    .filter((item) => item.parent === parentId)
    .forEach((item) => {
      const child = {
        ...item,
        children: convertCategoriesToCLient({
          data,
          parentId: item.id,
        }),
      };
      children.push(child);
    });
  return children;
};
