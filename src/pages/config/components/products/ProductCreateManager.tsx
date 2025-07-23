
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "./ProductForm";
import { useToast } from "@/hooks/use-toast";

// Mock categories for demo
const mockCategories = [
  { id: "1", name: "Cleaning" },
  { id: "2", name: "Repairs" },
  { id: "3", name: "Installation" },
  { id: "4", name: "Maintenance" },
];

// Mock services for demo
const mockServices = [
  { id: "1", name: "Basic Cleaning" },
  { id: "2", name: "Deep Cleaning" },
  { id: "3", name: "Furniture Repair" },
  { id: "4", name: "Appliance Installation" },
  { id: "5", name: "Regular Maintenance" },
];

export function ProductCreateManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddProduct = (formData: any) => {
    // Here we would typically send the data to an API
    console.log("Adding new product:", formData);
    
    // Simulate successful product creation
    toast({
      title: "Product added",
      description: `${formData.name} has been added successfully.`,
      variant: "default",
    });
    
    // Navigate back to products list
    setTimeout(() => {
      navigate("/config/products");
    }, 500);
  };

  const handleCancel = () => {
    navigate("/config/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Add New Product</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={handleCancel}
            categories={mockCategories}
            services={mockServices}
          />
        </CardContent>
      </Card>
    </div>
  );
}
