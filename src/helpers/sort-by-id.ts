type IdentifiableType = {
  id: number;
};
type NestedItem = {
  id: number;
  children?: NestedItem[];
};
export const sortById = <T extends IdentifiableType>(data: T[]): T[] => {
  return data.sort((a, b) => a.id - b.id);
};

export const recursiveSortById = <T extends NestedItem>(data: T[]): T[] => {
  // First, sort the top-level array
  const sortedData = data.sort((a, b) => a.id - b.id);

  // Recursively sort each 'children' array, if it exists
  for (const item of sortedData) {
    if (item.children && Array.isArray(item.children)) {
      item.children = recursiveSortById(item.children); // Recursive call to sort nested arrays
    }
  }

  return sortedData;
};
