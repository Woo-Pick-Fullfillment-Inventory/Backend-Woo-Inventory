type ProductsCategoryType = {
  id: number;
  name: string;
  slug: string;
  parent: number;
};

type HierarchicalObjectType = {
  [key: number]: {
    id: number;
    name: string;
    slug: string;
    parent: number;
    children?: HierarchicalObjectType | null | ProductsCategoryType[];
  };
};

export const convertCategoriesToCLient = ({
  data,
  parentId,
}: {
    data: ProductsCategoryType[];
    parentId: number;
}): HierarchicalObjectType => {
  const children: ProductsCategoryType[] = [];
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
