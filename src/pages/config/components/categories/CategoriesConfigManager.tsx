
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryConfig } from "../../types/categories";
import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { useToast } from "@/hooks/use-toast";

const fetchCategoryConfig = async (): Promise<CategoryConfig> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        categories: [
          {
            id: "1",
            name: "Cleaning",
            description: "Cleaning services",
            isActive: true,
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z",
          },
          {
            id: "2",
            name: "Repairs",
            description: "Repair services",
            isActive: true,
            createdAt: "2023-01-02T00:00:00Z",
            updatedAt: "2023-01-02T00:00:00Z",
          }
        ],
      });
    }, 500);
  });
};

export function CategoriesConfigManager() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const { toast } = useToast();
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categoryConfig"],
    queryFn: fetchCategoryConfig,
  });

  const handleAddCategory = async (categoryData: any) => {
    // Here would typically be an API call to add the category
    console.log("Adding category:", categoryData);
    
    // Simulate successful API call
    toast({
      title: "Category added",
      description: `${categoryData.name} has been added successfully.`,
    });
    
    setAddDialogOpen(false);
    refetch();
  };

  const handleEditCategory = async (categoryData: any) => {
    // Here would typically be an API call to update the category
    console.log("Editing category:", categoryData);
    console.log("Original category:", selectedCategory);
    
    // Simulate successful API call
    toast({
      title: "Category updated",
      description: `${categoryData.name} has been updated successfully.`,
    });
    
    setEditDialogOpen(false);
    refetch();
  };

  const openEditDialog = (category: any) => {
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
        <h2 className="text-3xl font-bold">Category Configuration</h2>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Configure categories for your application. You can add, edit, or remove categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.categories.map((category) => (
            <div key={category.id} className="p-4 border rounded-md mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <Button variant="outline" className="mr-2" onClick={() => openEditDialog(category)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSubmit={handleAddCategory} onCancel={() => setAddDialogOpen(false)} />
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
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
