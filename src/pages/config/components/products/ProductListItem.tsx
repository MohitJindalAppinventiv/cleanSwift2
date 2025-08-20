// src/components/products/ProductListItem.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {  Pencil, Trash2 } from "lucide-react";

interface ProductListItemProps {
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

export function ProductListItem({ product, onEdit, onDelete }: ProductListItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="group flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-semibold">
              {product.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-green-600">
                    Rs. {product.price !== undefined ? product.price.toFixed(2) : "0.00"}
                  </span>
                </div>
                {product.categoryName && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {product.categoryName}
                  </Badge>
                )}
                {product.serviceName && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {product.serviceName}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:border-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}