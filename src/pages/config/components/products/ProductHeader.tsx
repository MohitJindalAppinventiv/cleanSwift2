// src/components/products/ProductsHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";

interface ProductsHeaderProps {
  breadcrumbItems: Array<{ label: string; to: string }>;
  title: string;
  context: {
    type: "all" | "service" | "category";
    name?: string;
    isLoading: boolean;
  };
  productsCount: number;
  totalValue: number;
  onCreate: () => void;
}

export function ProductsHeader({
  breadcrumbItems,
  title,
  context,
  productsCount,
  totalValue,
  onCreate,
}: ProductsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          </div>
          {context.type !== "all" && (
            context.isLoading ? (
              <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
            ) : context.name ? (
              <p className="text-muted-foreground">
                {context.type === "category"
                  ? `Managing products in "${context.name}" category`
                  : `Managing products for "${context.name}" service`}
              </p>
            ) : null
          )}
          <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              
              <span>Total Products : {productsCount === -1 ? "Loading..." : `${productsCount} Products`}</span>
            </div>
            
          </div>
        </div>
        <Button onClick={onCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>
    </div>
  );
}