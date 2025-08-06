import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Service, ServiceSpecificCategory, AllCategoriesResponse, Category, isAllCategoriesResponse } from "./types";

const API_BASE_URL = "https://us-central1-laundry-app-dee6a.cloudfunctions.net";

const convertFirestoreTimestamp = (timestamp: { _seconds: number; _nanoseconds: number } | undefined) => {
  if (!timestamp) return new Date();
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

export function CategoriesConfigManager() {
  const { serviceId } = useParams<{ serviceId?: string }>();
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const endpoint = serviceId 
        ? `/getAllCategoriesByServiceId?serviceId=${serviceId}`
        : "/getAllCategoriesWithServiceNames";
      
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const servicesResponse = await axios.get(`${API_BASE_URL}/getAllServices`);
        setServices(servicesResponse.data?.data || []);
        await fetchCategories();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [serviceId, toast]);

  const handleCategoryClick = (category: Category) => {
    // When viewing a specific service's categories, navigate to products page
    if (serviceId) {
      const categoryId = isAllCategoriesResponse(category) ? category.categoryId : category.id;
      navigate(`/config/products/${categoryId}`, {
  state: { idType: 'category' }
});
    } else {
      // When viewing all categories, navigate to the service's categories page
      const targetServiceId = isAllCategoriesResponse(category)
        ? services.find(s => s.name === category.serviceName)?.id
        : category.serviceId;
      
      if (targetServiceId) {
        navigate(`/config/categories/${targetServiceId}`);
      }
    }
  };

  const canAddCategories = (serviceId?: string) => {
    if (!serviceId) {
      return services.some(s => s.pricingModel === 'per_item');
    }
    const service = services.find(s => s.id === serviceId);
    return service?.pricingModel === 'per_item';
  };

  const getCategoryDisplayName = (category: Category): string => {
    if (isAllCategoriesResponse(category)) {
      return category.categoryName;
    }
    return category.name;
  };

  const getCategoryId = (category: Category): string => {
    if (isAllCategoriesResponse(category)) {
      return category.categoryId;
    }
    return category.id;
  };

  const getServiceName = (category: Category): string => {
    if (isAllCategoriesResponse(category)) {
      return category.serviceName;
    }
    const service = services.find(s => s.id === category.serviceId);
    return service?.name || 'Unknown Service';
  };

  const getServicePricingModel = (category: Category): string => {
    if (isAllCategoriesResponse(category)) {
      const service = services.find(s => s.name === category.serviceName);
      return service?.pricingModel || 'unknown';
    }
    const service = services.find(s => s.id === category.serviceId);
    return service?.pricingModel || 'unknown';
  };

  const canEditCategory = (category: Category): boolean => {
    return getServicePricingModel(category) === 'per_item';
  };

  const handleAddCategory = async (formData: { name: string; serviceId?: string }) => {
    try {
      const selectedServiceId = serviceId || formData.serviceId;
      if (!selectedServiceId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Service ID is required",
        });
        return;
      }

      const service = services.find(s => s.id === selectedServiceId);
      if (service?.pricingModel !== 'per_item') {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Categories can only be created for services with per-item pricing",
        });
        return;
      }

      const payload = {
        name: formData.name,
        serviceId: selectedServiceId,
      };

      const response = await axios.post(`${API_BASE_URL}/createCategory`, payload);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create category");
      }

      await fetchCategories();
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create category",
      });
    }
  };

  const handleEditCategory = async (categoryId: string, formData: { name: string }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/updateCategory`, 
        { name: formData.name },
        { 
          params: {
            categoryId
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update category");
      }

      await fetchCategories();
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteCategory`, {
        params: { categoryId }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete category");
      }

      await fetchCategories();
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
      });
    }
  };

  const openEditDialog = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteCategory(getCategoryId(category));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Configuration</CardTitle>
          <CardDescription>Loading category configuration...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {serviceId 
              ? `Categories for ${services.find(s => s.id === serviceId)?.name || 'Service'}`
              : "All Categories"}
          </h2>
          <p className="text-muted-foreground">
            {serviceId 
              ? "Manage categories specific to this service"
              : "View and manage all categories across services"}
          </p>
        </div>
        {canAddCategories(serviceId) && (
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
          <CardDescription>
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="rounded-full bg-gray-100 p-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No categories found</p>
              <p className="text-sm text-muted-foreground">
                {serviceId 
                  ? "This service doesn't have any categories yet"
                  : "No categories have been created yet"}
              </p>
              {canAddCategories(serviceId) && (
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => {
                const pricingModel = getServicePricingModel(category);
                const isPerItem = pricingModel === 'per_item';
                
                return (
                  <div 
                    key={getCategoryId(category)} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 cursor-pointer transition-colors"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{getCategoryDisplayName(category)}</h3>
                        {!isAllCategoriesResponse(category) && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            !category.isDeleted 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {!category.isDeleted ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </div>
                      {!serviceId && (
                        <div className="flex items-center space-x-4">
                          <p className="text-xs text-muted-foreground">
                            Service: {getServiceName(category)}
                          </p>
                          {/* <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isPerItem
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {isPerItem ? 'Per Item' : 'Per Kg'}
                          </span> */}
                        </div>
                      )}
                      {!isAllCategoriesResponse(category) && category.createdAt && (
                        <p className="text-xs text-muted-foreground">
                          Created: {convertFirestoreTimestamp(category.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      {canEditCategory(category) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => openEditDialog(category, e)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => handleDeleteClick(category, e)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm 
            onSubmit={handleAddCategory}
            onCancel={() => setAddDialogOpen(false)}
            services={serviceId ? undefined : services.filter(s => s.pricingModel === 'per_item')}
            initialData={serviceId ? { serviceId } : undefined}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && canEditCategory(selectedCategory) && (
            <CategoryForm 
              onSubmit={(data) => {
                handleEditCategory(getCategoryId(selectedCategory), { 
                  name: data.name
                });
              }}
              onCancel={() => setEditDialogOpen(false)}
              initialData={{
                name: getCategoryDisplayName(selectedCategory),
                isActive: isAllCategoriesResponse(selectedCategory) 
                  ? true 
                  : !selectedCategory.isDeleted,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}