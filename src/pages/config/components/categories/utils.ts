import { Category, Service, isAllCategoriesResponse } from "./types";

export const convertFirestoreTimestamp = (timestamp: { 
  _seconds: number; 
  _nanoseconds: number 
} | undefined): Date => {
  if (!timestamp) return new Date();
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

export const getCategoryDisplayName = (category: Category): string => {
  return isAllCategoriesResponse(category) ? category.categoryName : category.name;
};

export const getCategoryId = (category: Category): string => {
  return isAllCategoriesResponse(category) ? category.categoryId : category.id;
};

export const getServiceForCategory = (category: Category, services: Service[]): Service | undefined => {
  return isAllCategoriesResponse(category)
    ? services.find(s => s.name === category.serviceName)
    : services.find(s => s.id === category.serviceId);
};