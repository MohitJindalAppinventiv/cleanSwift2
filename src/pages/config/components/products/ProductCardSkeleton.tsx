// src/components/products/ProductCardSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";

export const ProductCardSkeleton = () => (
  <Card className="group hover:shadow-md transition-all duration-200">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse"></div>
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);