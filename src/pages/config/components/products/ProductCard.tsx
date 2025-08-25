import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Tag, Settings, Pencil, Trash2, IndianRupee } from "lucide-react";
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
    <Card className="group relative overflow-hidden hover:shadow-2xl border-0 bg-gray-100">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100" />
      
      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 blur-sm" />
      
      <CardContent className="relative p-6 z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text capitalize">
                {product.name.toLowerCase()}
              </h3>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-2 rounded-full border border-green-200/50 group-hover:border-green-300">
                  <IndianRupee className="w-5 h-5 text-green-600 mr-1" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {product.price !== undefined ? product.price.toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={onEdit}
                className="hover:bg-blue-50 hover:text-blue-700"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-4">
          {product.categoryName && (
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 group-hover:from-orange-200 group-hover:to-amber-200">
                <Tag className="w-4 h-4 text-orange-600" />
              </div>
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200 hover:border-orange-300 hover:shadow-sm"
              >
                {product.categoryName}
              </Badge>
            </div>
          )}
          
          {product.serviceName && (
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 hover:border-blue-300 hover:shadow-sm"
              >
                {product.serviceName}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Static accent elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 group-hover:opacity-60" />
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 group-hover:opacity-70" />
      </CardContent>
    </Card>
  );
}