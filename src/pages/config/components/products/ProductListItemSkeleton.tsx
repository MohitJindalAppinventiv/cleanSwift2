// src/components/products/ProductListItemSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";

export const ProductListItemSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="flex items-center space-x-4 mt-1">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);