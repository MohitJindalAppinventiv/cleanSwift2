// src/components/products/ProductsEmptyState.tsx
import React from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductsEmptyStateProps {
  searchQuery: string;
  contextType: "all" | "service" | "category";
  onCreate: () => void;
}

export function ProductsEmptyState({
  searchQuery,
  contextType,
  onCreate,
}: ProductsEmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-16">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {searchQuery 
            ? `No products found matching "${searchQuery}"`
            : contextType === "category"
            ? "No products found under this category"
            : contextType === "service"
            ? "No products found under this service"
            : "No products found"
          }
        </h3>
        <p className="text-muted-foreground mb-6">
          {searchQuery 
            ? "Try adjusting your search terms"
            : "Get started by adding your first product"
          }
        </p>
        {!searchQuery && (
          <Button onClick={onCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Product
          </Button>
        )}
      </CardContent>
    </Card>
  );
}