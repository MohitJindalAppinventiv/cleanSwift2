import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductModal } from "./ProductModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormValues } from "./ProductForm";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";

const API_BASE_URL = "https://us-central1-laundry-app-dee6a.cloudfunctions.net";

interface Product {
  id: string;
  name: string;
  price?: number;
  categoryId?: string;
  serviceId?: string;
  categoryName?: string;
  serviceName?: string;
}

interface Service {
  id: string;
  name: string;
  pricingModel: "per_kg" | "per_item";
}

interface Category {
  categoryId: string;
  categoryName: string;
  serviceName: string;
}

export function ProductsConfigManager() {
  const { toast } = useToast();
  const { state } = useLocation();
  const { serviceId: paramServiceId, serviceId: paramCategoryId } = useParams<{
    serviceId?: string;
    categoryId?: string;
  }>();
  const navigate = useNavigate();
  const idType = state?.idType;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [currentContext, setCurrentContext] = useState<{
    type: "category" | "service" | "all";
    name?: string;
  }>({ type: "all" });

  // Set current context based on navigation
  useEffect(() => {
    if (idType === "category" && paramCategoryId) {
      const category = categories.find((c) => c.categoryId === paramCategoryId);
      setCurrentContext({
        type: "category",
        name: category?.categoryName || "Unknown Category",
      });
    } else if (idType === "service" && paramServiceId) {
      const service = services.find((s) => s.id === paramServiceId);
      setCurrentContext({
        type: "service",
        name: service?.name || "Unknown Service",
      });
    } else {
      setCurrentContext({ type: "all" });
    }
  }, [idType, paramServiceId, paramCategoryId, categories, services]);

  // Fetch services and categories
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const servicesRes = await axios.get(`${API_BASE_URL}/getAllServices`);
        setServices(servicesRes.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        });
      }

      try {
        const categoriesRes = await axios.get(`${API_BASE_URL}/getAllCategoriesWithServiceNames`);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    fetchInitialData();
  }, [toast]);

  // Fetch products based on context
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let endpoint = `${API_BASE_URL}/getAllProducts`;
        let params = {};

        if (idType === "category" && paramCategoryId) {
          endpoint = `${API_BASE_URL}/getAllProductsByCategoryId`;
          params = { categoryId: paramCategoryId };
        } else if (idType === "service" && paramServiceId) {
          endpoint = `${API_BASE_URL}/getProductByServiceId`;
          params = { serviceId: paramServiceId };
        }

        const response = await axios.get(endpoint, { params });

        const fetchedProducts = response.data.data.map((item: any) => ({
          id: item.productId || item.id,
          name: item.productName || item.name,
          price: item.price ?? 0,
          categoryId: item.categoryId || item.CategoryId,
          serviceId: item.serviceId,
          categoryName: item.categoryName,
          serviceName: item.serviceName,
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load products for ${
            idType === "category"
              ? "category"
              : idType === "service"
              ? "service"
              : "all products"
          }`,
          variant: "destructive",
        });
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [idType, paramServiceId, paramCategoryId, toast]);

  const createProduct = async (productData: ProductFormValues) => {
    try {
      let categoryIdToUse: string | undefined;
      let serviceIdToUse: string | undefined;

      if (idType === "category" && paramCategoryId) {
        categoryIdToUse = paramCategoryId;
      } else if (idType === "service" && paramServiceId) {
        serviceIdToUse = paramServiceId;
      } else {
        if (!selectedService) {
          toast({
            title: "Error",
            description: "Please select a service first",
            variant: "destructive",
          });
          return;
        }

        const service = services.find((s) => s.id === selectedService);
        if (!service) {
          toast({
            title: "Error",
            description: "Selected service not found",
            variant: "destructive",
          });
          return;
        }

        if (service.pricingModel === "per_item") {
          if (!selectedCategory) {
            toast({
              title: "Error",
              description: "Please select a category for this service",
              variant: "destructive",
            });
            return;
          }
          categoryIdToUse = selectedCategory;
        } else {
          serviceIdToUse = service.id;
        }
      }

      const response = await axios.post(`${API_BASE_URL}/createProduct`, {
        name: productData.name,
        price: productData.price,
        ...(categoryIdToUse && { categoryId: categoryIdToUse }),
        ...(serviceIdToUse && { serviceId: serviceIdToUse }),
      });

      const category = categoryIdToUse
        ? categories.find((c) => c.categoryId === categoryIdToUse)
        : null;
      const service = serviceIdToUse
        ? services.find((s) => s.id === serviceIdToUse)
        : category
        ? services.find((s) => s.name === category.serviceName)
        : null;

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setCreateModalOpen(false);
      setProducts([
        ...products,
        {
          id: response.data.id,
          name: productData.name,
          price: productData.price,
          categoryId: categoryIdToUse,
          serviceId: serviceIdToUse,
          categoryName: category?.categoryName,
          serviceName: service?.name,
        },
      ]);
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (
    productId: string,
    productData: ProductFormValues
  ) => {
    try {
      await axios.put(
        `${API_BASE_URL}/updateProduct`,
        {
          name: productData.name,
          price: productData.price,
        },
        {
          params: { productId },
        }
      );

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setEditModalOpen(false);
      setProducts(
        products.map((p) =>
          p.id === productId
            ? { ...p, name: productData.name, price: productData.price }
            : p
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteProduct`, {
        params: { productId },
      });

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // Breadcrumb items
  const breadcrumbItems = () => {
    const baseItems = [{ label: "Services", to: "/config/services" }];

    if (idType === "category" && paramCategoryId) {
      const category = categories.find((c) => c.categoryId === paramCategoryId);
      const service = services.find((s) => s.name === category?.serviceName);
      return [
        ...baseItems,
        { label: "Categories", to: `/config/categories/${service?.id || ""}` },
        { label: "Products", to: `/config/products/${paramCategoryId}` },
      ];
    } else {
      return [...baseItems, { label: "Products", to: `/config/products${paramServiceId ? `/${paramServiceId}` : ""}` }];
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>Loading products...</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems()} />
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Products</h2>
          {currentContext.type !== "all" && (
            <p className="text-sm text-gray-500">
              {currentContext.type === "category"
                ? `Under Category: ${currentContext.name}`
                : `Under Service: ${currentContext.name}`}
            </p>
          )}
        </div>
        <div className="ml-auto">
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>

      <ProductModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={createProduct}
        title="Add New Product"
        isSubmitting={false}
        services={services}
        categories={categories}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showServiceCategorySelect={!idType}
      />

      <ProductModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSubmit={(data: ProductFormValues) => {
          if (selectedProduct) {
            updateProduct(selectedProduct.id, data);
          }
        }}
        initialData={
          selectedProduct
            ? { name: selectedProduct.name, price: selectedProduct.price ?? 0 }
            : undefined
        }
        title="Edit Product"
        isSubmitting={false}
      />

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          {currentContext.type !== "all" && (
            <p className="text-sm text-gray-500">
              Showing products{" "}
              {currentContext.type === "category"
                ? `for category "${currentContext.name}"`
                : `for service "${currentContext.name}"`}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {idType === "category"
                  ? "No products found under this category"
                  : idType === "service"
                  ? "No products found under this service"
                  : "No products found"}
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-4 border rounded-md"
              >
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm">
                    {product.price !== undefined
                      ? `$${product.price.toFixed(2)}`
                      : "Price not set"}
                  </p>
                  {product.categoryName && (
                    <p className="text-xs text-gray-500">
                      Category: {product.categoryName}
                    </p>
                  )}
                  {product.serviceName && (
                    <p className="text-xs text-gray-500">
                      Service: {product.serviceName}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setEditModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}