import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "./CategoryCard";
import { Category, Service } from "./types";
import { 
  getCategoryId,
  getServiceForCategory, 
} from "./utils";

interface CategoryListProps {
  categories: Category[];
  services: Service[];
  isLoading: boolean;
  serviceId?: string;
  onEdit: (category: Category, e: React.MouseEvent) => void;
  onDelete: (category: Category, e: React.MouseEvent) => void;
  onClick: (category: Category) => void;
}

export function CategoryList({
  categories,
  services,
  isLoading,
  serviceId,
  onEdit,
  onDelete,
  onClick
}: CategoryListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 p-6 mb-6 shadow-lg">
            <Package className="h-12 w-12 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            {serviceId 
              ? "This service doesn't have any categories yet. Create your first category to get started."
              : "No categories have been created yet across all services."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const service = getServiceForCategory(category, services);
        return (
          <CategoryCard
            key={getCategoryId(category)}
            category={category}
            service={service}
            onEdit={(e) => onEdit(category, e)}
            onDelete={(e) => onDelete(category, e)}
            onClick={() => onClick(category)}
          />
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
          <div className="h-1 bg-gray-200 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-200 animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3.5 w-3.5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}