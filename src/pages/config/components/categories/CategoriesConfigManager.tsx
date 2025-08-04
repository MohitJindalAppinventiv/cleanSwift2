import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  serviceName?: string; // Added for the case when we fetch all categories with service names
}

interface Service {
  id: string;
  name: string;
}

export function CategoriesConfigManager() {
  const { serviceId } = useParams();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();

  // Fetch categories and services
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Always fetch services first
        await fetchServices();
        
        // Then fetch categories based on whether we have a serviceId
        if (serviceId) {
          await fetchCategoriesByService();
        } else {
          await fetchAllCategories();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [serviceId, toast]);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllServices"
      );
      const fetchedServices = Array.isArray(response.data?.data) 
        ? response.data.data 
        : [];
      const mappedServices = fetchedServices
        .filter((service: any) => service.id && service.name)
        .map((service: any) => ({
          id: service.id,
          name: service.name,
        }));
      setServices(mappedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  };

  const fetchCategoriesByService = async () => {
    try {
      const response = await axios.get(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllCategoriesByServiceId",
        { params: { serviceId } }
      );
      setCategories(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching categories by service:", error);
      throw error;
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllCategoriesWithServiceNames"
      );
      setCategories(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw error;
    }
  };

  const handleAddCategory = async (categoryData: any) => {
    try {
      // First add the category to the backend
      const response = await axios.post(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/addCategory",
        categoryData
      );
      
      // Then refetch the appropriate categories based on whether we're in service-specific view
      if (serviceId) {
        await fetchCategoriesByService();
      } else {
        await fetchAllCategories();
      }
      
      toast({
        title: "Category added",
        description: `${categoryData.name} has been added successfully.`,
      });
      
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async (categoryData: any) => {
    if (!selectedCategory) return;
    
    try {
      // First update the category in the backend
      await axios.put(
        `https://us-central1-laundry-app-dee6a.cloudfunctions.net/updateCategory/${selectedCategory.id}`,
        categoryData
      );
      
      // Then refetch the appropriate categories
      if (serviceId) {
        await fetchCategoriesByService();
      } else {
        await fetchAllCategories();
      }
      
      toast({
        title: "Category updated",
        description: `${categoryData.name} has been updated successfully.`,
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error editing category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // First delete the category from the backend
      await axios.delete(
        `https://us-central1-laundry-app-dee6a.cloudfunctions.net/deleteCategory/${categoryId}`
      );
      
      // Then refetch the appropriate categories
      if (serviceId) {
        await fetchCategoriesByService();
      } else {
        await fetchAllCategories();
      }
      
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Configuration</CardTitle>
          <CardDescription>Loading category configuration...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          {serviceId 
            ? `Categories for Service ${services.find(s => s.id === serviceId)?.name || ''}`
            : "All Categories"}
        </h2>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{serviceId ? "Service Categories" : "All Categories"}</CardTitle>
          <CardDescription>
            {serviceId 
              ? "Categories specific to this service"
              : "All categories across all services"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p>No categories found</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="p-4 border rounded-md mb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                    {!serviceId && category.serviceName && (
                      <p className="text-sm text-gray-500 mt-1">
                        Service: {category.serviceName}
                      </p>
                    )}
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm 
            onSubmit={handleAddCategory} 
            onCancel={() => setAddDialogOpen(false)}
            services={services}
            // If we're in service-specific view, preselect that service
            initialData={serviceId ? { serviceId } : undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm 
              onSubmit={handleEditCategory} 
              onCancel={() => setEditDialogOpen(false)}
              initialData={{
                name: selectedCategory.name,
                description: selectedCategory.description || "",
                isActive: selectedCategory.isActive,
                serviceId: selectedCategory.serviceId,
              }}
              services={services}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}