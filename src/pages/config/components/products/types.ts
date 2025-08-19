export interface Product {
  id: string;
  name: string;
  price?: number;
  categoryId?: string;
  serviceId?: string;
  categoryName?: string;
  serviceName?: string;
}

export interface Service {
  id: string;
  name: string;
  pricingModel: "per_kg" | "per_item";
}

export interface Category {
  categoryId: string;
  categoryName: string;
  serviceName: string;
}

export interface ProductFormValues {
  name: string;
  price: number;
}

export interface BreadcrumbItem {
  label: string;
  to: string;
}

export interface DeleteDialogState {
  open: boolean;
  productId: string;
  loading: boolean;
}