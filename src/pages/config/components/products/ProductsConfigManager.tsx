// src/components/products/ProductsConfigManager.tsx
// src/components/products/ProductsConfigManager.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ProductModal } from "./ProductModal";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { ProductsHeader } from "./ProductHeader";
import { ProductsControls } from "./ProductControls";
import { ProductsEmptyState } from "./ProductsEmptyState";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { ProductListItemSkeleton } from "./ProductListItemSkeleton";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { ProductFormValues } from "./ProductForm"; // Add this import

// ... rest of your component code remains the same

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
  const idType = state?.idType;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentContext = useMemo(() => {
    if (idType === "category" && paramCategoryId) {
      const category = categories.find((c) => c.categoryId === paramCategoryId);
      return {
        type: "category" as const,
        name: category?.categoryName,
        isLoading: !categoriesLoaded,
      };
    } else if (idType === "service" && paramServiceId) {
      const service = services.find((s) => s.id === paramServiceId);
      return {
        type: "service" as const,
        name: service?.name,
        isLoading: !servicesLoaded,
      };
    } else {
      return { type: "all" as const, isLoading: false };
    }
  }, [idType, paramServiceId, paramCategoryId, categories, services, categoriesLoaded, servicesLoaded]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.categoryName && product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.serviceName && product.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return (a.price || 0) - (b.price || 0);
        case "category":
          return (a.categoryName || "").localeCompare(b.categoryName || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, sortBy]);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      let endpoint = `${API.GET_ALL_PRODUCTS()}`;
      let params = {};

      if (idType === "category" && paramCategoryId) {
        endpoint = `${API.GET_ALL_PRODUCT_BY_CATEGORY_ID()}`;
        params = { categoryId: paramCategoryId };
      } else if (idType === "service" && paramServiceId) {
        endpoint = `${API.GET_ALL_PRODUCT_BY_SERVICE_ID()}`;
        params = { serviceId: paramServiceId };
      }

      const response = await axiosInstance.get(endpoint, { params });

      const fetchedProducts = response.data.data.map((item: any) => {
        const categoryId = item.categoryId || item.CategoryId;
        const serviceId = item.serviceId;
        
        let categoryName = item.categoryName;
        let serviceName = item.serviceName;
        
        if (idType === "category" && paramCategoryId) {
          const currentCategory = categories.find((c) => c.categoryId === paramCategoryId);
          if (currentCategory) {
            categoryName = currentCategory.categoryName;
            serviceName = currentCategory.serviceName;
          }
        }
        
        if (idType === "service" && paramServiceId) {
          const currentService = services.find((s) => s.id === paramServiceId);
          if (currentService) {
            serviceName = currentService.name;
          }
        }
        
        if (!categoryName && categoryId) {
          const category = categories.find((c) => c.categoryId === categoryId);
          if (category) {
            categoryName = category.categoryName;
            if (!serviceName) {
              serviceName = category.serviceName;
            }
          }
        }
        
        if (!serviceName && serviceId) {
          const service = services.find((s) => s.id === serviceId);
          if (service) {
            serviceName = service.name;
          }
        }

        return {
          id: item.productId || item.id,
          name: item.productName || item.name,
          price: item.price ?? 0,
          categoryId: categoryId,
          serviceId: serviceId,
          categoryName: categoryName,
          serviceName: serviceName,
        };
      });

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      setIsLoadingProducts(false);
    }
  }, [idType, paramServiceId, paramCategoryId, toast, categories, services]);

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          axiosInstance.get(`${API.GET_ALL_SERVICES()}`),
          axiosInstance.get(`${API.GET_ALL_CATEGORIES_BY_SERVICE_NAMES()}`)
        ]);

        if (mounted) {
          setServices(servicesRes.data.data);
          setServicesLoaded(true);
          setCategories(categoriesRes.data.data);
          setCategoriesLoaded(true);
        }
      } catch (error) {
        if (mounted) {
          console.error("Error fetching initial data:", error);
          toast({
            title: "Error",
            description: "Failed to load services and categories",
            variant: "destructive",
          });
          setServicesLoaded(true);
          setCategoriesLoaded(true);
        }
      }
    };

    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [toast]);

  useEffect(() => {
    if (servicesLoaded && categoriesLoaded) {
      fetchProducts();
    }
  }, [servicesLoaded, categoriesLoaded, fetchProducts]);

  const createProduct = async (productData: ProductFormValues) => {
    setIsSubmitting(true);
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

      const response = await axiosInstance.post(`${API.CREATE_PRODUCT()}`, {
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
      setProducts((prevProducts) => [
        ...prevProducts,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProduct = async (
    productId: string,
    productData: ProductFormValues
  ) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.put(
        `${API.UPDATE_PRODUCT()}`,
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
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;
    
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`${API.DELETE_PRODUCT()}`, {
        params: { productId: selectedProduct.id },
      });

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== selectedProduct.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const breadcrumbItems = useMemo(() => {
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
  }, [idType, paramCategoryId, paramServiceId, categories, services]);

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [products]);

  const shouldShowSkeleton = isLoadingProducts || !servicesLoaded || !categoriesLoaded;

  return (
    <div className="space-y-6">
      <ProductsHeader
        breadcrumbItems={breadcrumbItems}
        title="Products"
        context={currentContext}
        productsCount={shouldShowSkeleton ? -1 : filteredProducts.length}
        totalValue={totalValue}
        onCreate={() => setCreateModalOpen(true)}
      />

      <ProductsControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={(value: any) => setSortBy(value)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {shouldShowSkeleton ? (
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
      ) : filteredProducts.length === 0 ? (
        <ProductsEmptyState
          searchQuery={searchQuery}
          contextType={currentContext.type}
          onCreate={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
        }>
          {filteredProducts.map((product) => 
            viewMode === "grid" 
              ? (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onEdit={() => {
                    setSelectedProduct(product);
                    setEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteClick(product)}
                />
              )
              : (
                <ProductListItem 
                  key={product.id} 
                  product={product} 
                  onEdit={() => {
                    setSelectedProduct(product);
                    setEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteClick(product)}
                />
              )
          )}
        </div>
      )}

      <ProductModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={createProduct}
        title="Add New Product"
        isSubmitting={isSubmitting}
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
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={deleteProduct}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}