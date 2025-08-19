import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Service } from "./types";

interface CategoryHeaderProps {
  serviceId?: string;
  services: Service[];
  isLoading: boolean;
  canAddCategories: boolean;
  onAddCategory: () => void;
}

export function CategoryHeader({
  serviceId,
  services,
  isLoading,
  canAddCategories,
  onAddCategory
}: CategoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          {serviceId ? (
            isLoading || services.length === 0 ? (
              <span className="inline-block h-8 w-48 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              `Categories for ${services.find(s => s.id === serviceId)?.name || 'Service'}`
            )
          ) : (
            "All Categories"
          )}
        </h2>
        <p className="text-muted-foreground">
          Welcome to the Category Page, where you can create and manage categories.
        </p>
      </div>
      {canAddCategories && (
        <Button className="flex items-center gap-2" onClick={onAddCategory}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      )}
    </div>
  );
}