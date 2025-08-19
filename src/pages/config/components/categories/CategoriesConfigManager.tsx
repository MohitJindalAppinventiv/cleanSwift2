import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { Category, Service } from "./types";
import { CategoryList } from "./CategoryList";
import { CategoryForm } from "./CategoryForm";
import { CategoryHeader } from "./CategoryHeader";
import { getCategoryDisplayName, getCategoryId} from "./utils";
import { isAllCategoriesResponse } from "./types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const [deleteState, setDeleteState] = useState({
    open: false,
    categoryId: null as string | null,
    deleting: false
  });

  const fetchCategories = async () => {
    try {
      const endpoint = serviceId 
        ? `${API.GET_ALL_CATEGORIES_BY_SERVICE_ID()}?serviceId=${serviceId}`
        : `${API.GET_ALL_CATEGORIES_BY_SERVICE_NAMES()}`;
      
      const response = await axiosInstance.get(endpoint);
      setCategories(response.data?.data || []);
    } catch (error) {
      handleError(error, "Failed to fetch categories");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const servicesResponse = await axiosInstance.get(API.GET_ALL_SERVICES());
        setServices(servicesResponse.data?.data || []);
        await fetchCategories();
      } catch (error) {
        handleError(error, "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const handleError = (error: unknown, defaultMessage: string) => {
    console.error(defaultMessage, error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : defaultMessage,
    });
  };

  const handleCategoryClick = (category: Category) => {
    if (serviceId) {
      navigate(`/config/products/${getCategoryId(category)}`, {
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

      const response = await axiosInstance.post(API.CREATE_CATEGORY(), payload);
      
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
      handleError(error, "Failed to create category");
    }
  };

  const handleEditCategory = async (categoryId: string, formData: { name: string }) => {
    try {
      const response = await axiosInstance.put(API.UPDATE_CATEGORY(), 
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
      handleError(error, "Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await axiosInstance.delete(API.DELETE_CATEGORY(), {
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
      handleError(error, "Failed to delete category");
    }
  };

  const openEditDialog = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteState({
      open: true,
      categoryId: getCategoryId(category),
      deleting: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.categoryId) return;
    
    setDeleteState(prev => ({...prev, deleting: true}));
    
    try {
      await handleDeleteCategory(deleteState.categoryId);
      setDeleteState({ open: false, categoryId: null, deleting: false });
    } catch (error) {
      setDeleteState(prev => ({...prev, deleting: false}));
    }
  };

  const breadcrumbItems = [
    { label: "Services", to: "/config/services" },
    { label: "Categories", to: serviceId ? `/config/categories/${serviceId}` : "/config/categories" },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumb items={breadcrumbItems} />
      
      <CategoryHeader
        serviceId={serviceId}
        services={services}
        isLoading={isLoading}
        canAddCategories={canAddCategories(serviceId)}
        onAddCategory={() => setAddDialogOpen(true)}
      />

      <CategoryList
        categories={categories}
        services={services}
        isLoading={isLoading}
        serviceId={serviceId}
        onEdit={openEditDialog}
        onDelete={handleDeleteClick}
        onClick={handleCategoryClick}
      />

      {/* Add Category Dialog */}
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

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm 
              onSubmit={async (data) => {
                await handleEditCategory(getCategoryId(selectedCategory), { 
                  name: data.name
                });
              }}
              onCancel={() => setEditDialogOpen(false)}
              initialData={{
                name: getCategoryDisplayName(selectedCategory),
                isActive: isAllCategoriesResponse(selectedCategory) 
                  ? true 
                  : !('isDeleted' in selectedCategory) || !selectedCategory.isDeleted,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteState.open}
        onOpenChange={(open) => {
          if (!deleteState.deleting) {
            setDeleteState({ open, categoryId: null, deleting: false });
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteState({ open: false, categoryId: null, deleting: false })}
              disabled={deleteState.deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteState.deleting}
            >
              {deleteState.deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}