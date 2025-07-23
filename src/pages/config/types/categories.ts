
export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryConfig {
  categories: Category[];
}
