import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Package, Calendar, Building2, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Service, ServiceSpecificCategory, AllCategoriesResponse, Category, isAllCategoriesResponse } from "./types";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";

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
    if (serviceId) {
      const categoryId = isAllCategoriesResponse(category) ? category.categoryId : category.id;
      navigate(`/config/products/${categoryId}`, {
        state: { idType: 'category' },
      });
    } else {
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
          params: { categoryId }
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

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Services", to: "/config/services" },
    { label: "Categories", to: serviceId ? `/config/categories/${serviceId}` : "/config/categories" },
  ];

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
      <Breadcrumb items={breadcrumbItems} />
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

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 p-6 mb-6 shadow-lg">
              <Package className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {serviceId 
                ? "This service doesn't have any categories yet. Create your first category to get started."
                : "No categories have been created yet across all services."}
            </p>
            {canAddCategories(serviceId) && (
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create First Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const pricingModel = getServicePricingModel(category);
            const isPerItem = pricingModel === 'per_item';
            const serviceName = getServiceName(category);
            const isActive = isAllCategoriesResponse(category) ? true : !category.isDeleted;
            
            return (
              <Card 
                key={getCategoryId(category)} 
                className="group relative overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:bg-gray-50/50 transform hover:-translate-y-1 hover:scale-[1.02]"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 group-hover:from-purple-200 group-hover:to-indigo-200 transition-colors shadow-sm">
                        <Tag className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                          {getCategoryDisplayName(category)}
                        </CardTitle>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            isActive 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                              isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      {canEditCategory(category) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-700"
                          onClick={(e) => openEditDialog(category, e)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                        onClick={(e) => handleDeleteClick(category, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Service Information */}
                    <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-purple-50/30 border border-gray-100 shadow-sm">
                      <Building2 className="h-4 w-4 text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {serviceName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {pricingModel.replace('_', ' ')} pricing
                        </p>
                      </div>
                    </div>

                    {/* Created Date */}
                    {!isAllCategoriesResponse(category) && category.createdAt && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Created {convertFirestoreTimestamp(category.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    )}

                    {/* Action Indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {serviceId 
                          ? "Click to view products" 
                          : "Click to view categories under this service"}
                      </span>
                      <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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