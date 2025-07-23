
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Plus } from "lucide-react";
import { ProductConfig, Product } from "../../types/products";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const fetchProductsConfig = async (): Promise<ProductConfig> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        products: [
          {
            id: "1",
            name: "Basic Cleaning Kit",
            description: "A complete kit for basic home cleaning",
            price: 29.99,
            categoryId: "1", // Cleaning category
            serviceId: "1", // Basic Cleaning service
            isActive: true,
            imageUrl: "/images/cleaning-kit.jpg",
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z",
          },
          {
            id: "2",
            name: "Premium Tools Set",
            description: "High-quality repair tools for professionals",
            price: 129.99,
            categoryId: "2", // Repairs category
            serviceId: "3", // Furniture Repair service
            isActive: true,
            imageUrl: "/images/tools-set.jpg",
            createdAt: "2023-01-02T00:00:00Z",
            updatedAt: "2023-01-02T00:00:00Z",
          }
        ],
      });
    }, 500);
  });
};

// Mock categories for demo
const mockCategories = [
  { id: "1", name: "Cleaning" },
  { id: "2", name: "Repairs" },
  { id: "3", name: "Installation" },
  { id: "4", name: "Maintenance" },
];

export function ProductsConfigManager() {
  const { toast } = useToast();
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["productsConfig"],
    queryFn: fetchProductsConfig,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products Configuration</CardTitle>
          <CardDescription>Loading products configuration...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Products Configuration</h2>
        <Button asChild>
          <Link to="/config/products/create">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Configure products for your application. You can add, edit, or remove products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.products.map((product) => (
            <div key={product.id} className="p-4 border rounded-md mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <Button variant="outline" className="mr-2">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
