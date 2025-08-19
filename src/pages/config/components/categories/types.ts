export interface Service {
  id: string;
  name: string;
  pricingModel: 'per_item' | 'per_kg' | 'per_hour' | 'subscription';
  isDeleted?: boolean;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface ServiceSpecificCategory {
  id: string;
  name: string;
  serviceId: string;
  isDeleted?: boolean;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface AllCategoriesResponse {
  categoryId: string;
  categoryName: string;
  serviceName: string;
  pricingModel: string;
}

export type Category = ServiceSpecificCategory | AllCategoriesResponse;

export function isAllCategoriesResponse(category: Category): category is AllCategoriesResponse {
  return 'categoryId' in category;
}

export interface CategoryFormValues {
  name: string;
  serviceId?: string;
  isActive?: boolean;
}