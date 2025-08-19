// ProductsDisplay.tsx (new smaller component, includes skeletons and no data state)
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DollarSign, Package, Pencil, Plus, Settings, Tag, Trash2 } from "lucide-react";

interface ProductsDisplayProps {
  viewMode: "grid" | "list";
  shouldShowSkeleton: boolean;
  filteredProducts: any[];
  currentContext: any;
  idType: any;
  setSelectedProduct: (product: any) => void;
  setEditModalOpen: (open: boolean) => void;
  handleDelete: (product: any) => void;
  searchQuery: string;
  setCreateModalOpen: (open: boolean) => void;
}

const ProductCardSkeleton = () => (
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

const ProductListItemSkeleton = () => (
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

const ProductCard = ({ product, setSelectedProduct, setEditModalOpen, handleDelete, currentContext, idType }: any) => (
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
            <DropdownMenuItem 
              onClick={() => {
                setSelectedProduct(product);
                setEditModalOpen(true);
              }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDelete(product)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-3">
        {(product.categoryName || (idType === "category" && currentContext.name)) && (
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-orange-500" />
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {product.categoryName || (idType === "category" && currentContext.name ? currentContext.name : "Loading...")}
            </Badge>
          </div>
        )}
        {(product.serviceName || (idType === "service" && currentContext.name)) && (
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-blue-500" />
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {product.serviceName || (idType === "service" && currentContext.name ? currentContext.name : "Loading...")}
            </Badge>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const ProductListItem = ({ product, setSelectedProduct, setEditModalOpen, handleDelete }: any) => (
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
                <DollarSign className="w-4 h-4 text-green-600" />
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
            onClick={() => {
              setSelectedProduct(product);
              setEditModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(product)}
            className="text-red-600 hover:text-red-700 hover:border-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function ProductsDisplay({
  viewMode,
  shouldShowSkeleton,
  filteredProducts,
  currentContext,
  idType,
  setSelectedProduct,
  setEditModalOpen,
  handleDelete,
  searchQuery,
  setCreateModalOpen,
}: ProductsDisplayProps) {
  if (shouldShowSkeleton) {
    return (
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
      }>
        {Array.from({ length: 8 }).map((_, index) => 
          viewMode === "grid" 
            ? <ProductCardSkeleton key={index} />
            : <ProductListItemSkeleton key={index} />
        )}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery 
              ? `No products found matching "${searchQuery}"`
              : currentContext.type === "category"
              ? "No products found under this category"
              : currentContext.type === "service"
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
            <Button onClick={() => setCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={
      viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "space-y-4"
    }>
      {filteredProducts.map((product) => 
        viewMode === "grid" 
          ? <ProductCard 
              key={product.id} 
              product={product} 
              setSelectedProduct={setSelectedProduct}
              setEditModalOpen={setEditModalOpen}
              handleDelete={handleDelete}
              currentContext={currentContext}
              idType={idType}
            />
          : <ProductListItem 
              key={product.id} 
              product={product} 
              setSelectedProduct={setSelectedProduct}
              setEditModalOpen={setEditModalOpen}
              handleDelete={handleDelete}
            />
      )}
    </div>
  );
}