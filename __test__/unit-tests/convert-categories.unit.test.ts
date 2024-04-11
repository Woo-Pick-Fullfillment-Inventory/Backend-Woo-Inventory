import { convertCategoriesToCLient } from "../../src/helpers/convert-categories";

describe("products categories converter tests", () => {
  const categories = [
    {
      id: 1,
      name: "Category 1",
      slug: "category-1",
      parent: 0,
    },
    {
      id: 2,
      name: "Category 2",
      slug: "category-2",
      parent: 0,
    },
    {
      id: 3,
      name: "Subcategory 1",
      slug: "subcategory-1",
      parent: 1,
    },
    {
      id: 4,
      name: "Subcategory 2",
      slug: "subcategory-2",
      parent: 1,
    },
    {
      id: 5,
      name: "Subcategory 3",
      slug: "subcategory-3",
      parent: 2,
    },
    {
      id: 6,
      name: "Subcategory 4",
      slug: "subcategory-4",
      parent: 2,
    },
  ];
  it("should convert categories array to expected hierarchy", () => {
    const convertedCategories = convertCategoriesToCLient({
      data: categories,
      parentId: 0,
    });
    expect(convertedCategories).toEqual([
      {
        id: 1,
        name: "Category 1",
        parent: 0,
        slug: "category-1",
        children: [
          {
            children: [],
            id: 3,
            name: "Subcategory 1",
            parent: 1,
            slug: "subcategory-1",
          },
          {
            children: [],
            id: 4,
            name: "Subcategory 2",
            parent: 1,
            slug: "subcategory-2",
          },
        ],
      },
      {
        id: 2,
        name: "Category 2",
        parent: 0,
        slug: "category-2",
        children: [
          {
            children: [],
            id: 5,
            name: "Subcategory 3",
            parent: 2,
            slug: "subcategory-3",
          },
          {
            children: [],
            id: 6,
            name: "Subcategory 4",
            parent: 2,
            slug: "subcategory-4",
          },
        ],
      },
    ]);
  });

  it("should convert categories array to expected hierarchy", () => {
    const categories = [
      {
        id: 131,
        name: "Bia &amp; Rượu",
        slug: "bier-wein",
        parent: 128,
      },
      {
        id: 123,
        name: "Bột mì",
        slug: "mehl",
        parent: 121,
      },
      {
        id: 133,
        name: "Chén &amp; Đĩa",
        slug: "geschirr",
        parent: 132,
      },
      {
        id: 134,
        name: "Dao &amp; Kéo",
        slug: "messer-schere",
        parent: 132,
      },
      {
        id: 126,
        name: "Đậu phụ và đậu hộp",
        slug: "tofu",
        parent: 124,
      },
      {
        id: 127,
        name: "Đồ ăn vặt",
        slug: "snack",
        parent: 0,
      },
      {
        id: 132,
        name: "Đồ dùng gia đình",
        slug: "non-food",
        parent: 0,
      },
      {
        id: 124,
        name: "Đồ hộp",
        slug: "konservedosen",
        parent: 0,
      },
      {
        id: 128,
        name: "Đồ uống",
        slug: "do-uong",
        parent: 0,
      },
      {
        id: 118,
        name: "Gạo",
        slug: "reis",
        parent: 116,
      },
      {
        id: 116,
        name: "Gạo và Mì",
        slug: "reis-nudeln",
        parent: 0,
      },
      {
        id: 122,
        name: "Gia vị",
        slug: "gewurze",
        parent: 121,
      },
      {
        id: 121,
        name: "Gia vị và bột mì",
        slug: "gewurze-mehl",
        parent: 0,
      },
      {
        id: 119,
        name: "Mì",
        slug: "nudeln",
        parent: 116,
      },
      {
        id: 129,
        name: "Nước ngọt",
        slug: "suess-getraenke",
        parent: 128,
      },
      {
        id: 120,
        name: "Nước sốt",
        slug: "sauce",
        parent: 0,
      },
      {
        id: 135,
        name: "Phụ kiện nhà bếp",
        slug: "kuchenzubehoer",
        parent: 132,
      },
      {
        id: 117,
        name: "Rau củ quả",
        slug: "frisch-kuehlware",
        parent: 0,
      },
      {
        id: 125,
        name: "Rau củ quả",
        slug: "gemuese",
        parent: 124,
      },
      {
        id: 130,
        name: "Trà &amp; Cà phê",
        slug: "tee-cafe",
        parent: 128,
      },
      {
        id: 16,
        name: "Uncategorized",
        slug: "uncategorized",
        parent: 0,
      },
    ];

    const convertedCategories = convertCategoriesToCLient({
      data: categories,
      parentId: 0,
    });
    expect(convertedCategories).toEqual([
      {
        id: 127,
        name: "Đồ ăn vặt",
        parent: 0,
        slug: "snack",
        children: [],
      },
      {
        id: 132,
        name: "Đồ dùng gia đình",
        parent: 0,
        slug: "non-food",
        children: [
          {
            id: 133,
            name: "Chén &amp; Đĩa",
            parent: 132,
            slug: "geschirr",
            children: [],
          },
          {
            id: 134,
            name: "Dao &amp; Kéo",
            parent: 132,
            slug: "messer-schere",
            children: [],
          },
          {
            id: 135,
            name: "Phụ kiện nhà bếp",
            parent: 132,
            slug: "kuchenzubehoer",
            children: [],
          },
        ],
      },
      {
        id: 124,
        name: "Đồ hộp",
        parent: 0,
        slug: "konservedosen",
        children: [
          {
            id: 126,
            name: "Đậu phụ và đậu hộp",
            parent: 124,
            slug: "tofu",
            children: [],
          },
          {
            id: 125,
            name: "Rau củ quả",
            parent: 124,
            slug: "gemuese",
            children: [],
          },
        ],
      },
      {
        id: 128,
        name: "Đồ uống",
        parent: 0,
        slug: "do-uong",
        children: [
          {
            id: 131,
            name: "Bia &amp; Rượu",
            parent: 128,
            slug: "bier-wein",
            children: [],
          },
          {
            id: 129,
            name: "Nước ngọt",
            parent: 128,
            slug: "suess-getraenke",
            children: [],
          },
          {
            id: 130,
            name: "Trà &amp; Cà phê",
            parent: 128,
            slug: "tee-cafe",
            children: [],
          },
        ],
      },
      {
        id: 116,
        name: "Gạo và Mì",
        parent: 0,
        slug: "reis-nudeln",
        children: [
          {
            id: 118,
            name: "Gạo",
            slug: "reis",
            parent: 116,
            children: [],
          },
          {
            id: 119,
            name: "Mì",
            slug: "nudeln",
            parent: 116,
            children: [],
          },
        ],
      },
      {
        id: 121,
        name: "Gia vị và bột mì",
        slug: "gewurze-mehl",
        parent: 0,
        children: [
          {
            id: 123,
            name: "Bột mì",
            parent: 121,
            slug: "mehl",
            children: [],
          },
          {
            id: 122,
            name: "Gia vị",
            parent: 121,
            slug: "gewurze",
            children: [],
          },
        ],
      },
      {
        id: 120,
        name: "Nước sốt",
        parent: 0,
        slug: "sauce",
        children: [],
      },
      {
        id: 117,
        name: "Rau củ quả",
        parent: 0,
        slug: "frisch-kuehlware",
        children: [],
      },
      {
        id: 16,
        name: "Uncategorized",
        parent: 0,
        slug: "uncategorized",
        children: [],
      },
    ]);
  });
});
