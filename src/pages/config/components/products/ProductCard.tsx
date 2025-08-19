// src/components/products/ProductCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Tag, Settings, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price?: number;
    categoryName?: string;
    serviceName?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-lg">
              {product.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center space-x-1 mt-1">
               Rs. <span className="text-xl font-bold text-green-600">
                  {product.price !== undefined ? product.price.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3">
          {product.categoryName && (
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-orange-500" />
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {product.categoryName}
              </Badge>
            </div>
          )}
          {product.serviceName && (
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-500" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {product.serviceName}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}