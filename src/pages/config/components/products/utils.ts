import { Category, Product } from "./types";

export const formatPrice = (price?: number): string => {
  return price !== undefined ? `Rs. ${price.toFixed(2)}` : "Rs. 0.00";
};

export const getInitialLetter = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

export const filterCategoriesByService = (
  categories: Category[],
  serviceName: string
): Category[] => {
  return categories.filter((cat) => cat.serviceName === serviceName);
};

export const calculateTotalValue = (products: Product[]): string => {
  const total = products.reduce((sum, p) => sum + (p.price || 0), 0);
  return formatPrice(total);
};