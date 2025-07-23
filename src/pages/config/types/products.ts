
export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  serviceId: string;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductConfig = {
  products: Product[];
};

export type ProductFormData = {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  serviceId: string;
  isActive: boolean;
  imageUrl?: string;
};
