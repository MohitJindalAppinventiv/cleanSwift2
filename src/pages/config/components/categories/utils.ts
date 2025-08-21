import { Category, Service, isAllCategoriesResponse } from "./types";

export const convertFirestoreTimestamp = (timestamp: { 
  _seconds: number; 
  _nanoseconds: number 
} | string | undefined): Date => {
  if (!timestamp) {
    return new Date(); // Fallback to current date if timestamp is undefined
  }
  if (typeof timestamp === 'string') {
    const parsedDate = new Date(timestamp);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate; // Fallback if invalid ISO string
  }
  if (typeof timestamp._seconds !== 'number' || isNaN(timestamp._seconds)) {
    return new Date(); // Fallback if timestamp object is invalid
  }
  return new Date(timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1000000));
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