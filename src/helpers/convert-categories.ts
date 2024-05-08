import type { ProductsCategoryMongoClientType } from "../repository/mongo/index.js";

type HierarchicalObjectType = {
  [key: number]: {
    id: number;
    name: string;
    slug: string;
    parent: number;
    children?: HierarchicalObjectType | null | ProductsCategoryMongoClientType[];
  };
};

export const convertCategoriesToCLient = ({
  data,
  parentId,
}: {
    data: ProductsCategoryMongoClientType[];
    parentId: number;
}): HierarchicalObjectType => {
  const children: ProductsCategoryMongoClientType[] = [];
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
