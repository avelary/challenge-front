export const productTypes = [
  { value: "souvenir", label: "Souvenir" },
  { value: "menu", label: "Cardápio" },
  { value: "clothing", label: "Vestuário" },
];

export const productCategories = [
  { id: "1", value: "gastronomy", label: "Gastronomia" },
  { id: "2", value: "clothing", label: "Vestuário" },
  { id: "3", value: "souvenir", label: "Souvenir" },
];

export type ProductCategoryValue = (typeof productCategories)[number]["value"];

export const categoryClassifications: Record<
  ProductCategoryValue,
  { id: string; value: string; label: string }[]
> = {
  gastronomy: [
    { id: "1", value: "vegan", label: "Vegano" },
    { id: "2", value: "italian", label: "Italiana" },
    { id: "3", value: "mexican", label: "Mexicana" },
  ],
  clothing: [
    { id: "4", value: "casual", label: "Casual" },
    { id: "5", value: "formal", label: "Formal" },
    { id: "6", value: "sport", label: "Esportivo" },
  ],
  souvenir: [
    { id: "7", label: "Decoração", value: "decor" },
    { id: "8", label: "Utensílios", value: "utensils" },
    { id: "9", label: "Acessórios", value: "accessories" },
    { id: "10", label: "Colecionáveis", value: "collectibles" },
    { id: "11", label: "Presentes", value: "gifts" },
  ],
};

export const productStatusOptions = [
  { value: "processing", label: "Processing" },
  { value: "released", label: "Released" },
  { value: "blocked", label: "Blocked" },
];

export const partnerOptions = [
  { value: "1", label: "McDonald's" },
  { value: "2", label: "Burger King" },
  { value: "3", label: "Nike" },
];

export const measureUnits = [
  { value: "un", label: "Unitário" },
  { value: "kg", label: "Quilograma" },
  { value: "m", label: "Metro" },
];

export const printerOptions = [
  { value: "1", label: "teste" },
  { value: "2", label: "teste02" }
];

export const categoriesByProductType: Record<
  string,
  { id: string; value: string; label: string }[]
> = {
  souvenir: [productCategories.find((cat) => cat.value === "souvenir")!],
  menu: [productCategories.find((cat) => cat.value === "gastronomy")!],
  clothing: [productCategories.find((cat) => cat.value === "clothing")!],
};

/**
 * Get category options based on selected product type.
 */
export function getCategoryOptionsByProductType(productType: string) {
  const categories = categoriesByProductType[productType] || [];
  return categories.map(({ id, label }) => ({ value: id, label }));
}

/**
 * Get classification options based on selected category value.
 */
export function getClassificationOptionsByCategory(category: ProductCategoryValue | "") {
  const classificationList = categoryClassifications[category as ProductCategoryValue] || [];
  return classificationList.map(({ id, label }) => ({ value: id, label }));
}

