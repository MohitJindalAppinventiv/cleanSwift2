import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { ProductFormValues } from "./ProductForm";

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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function ProductsConfigManager() {
  const { toast } = useToast();
  const { state } = useLocation();
  const { serviceId: paramServiceId, categoryId: paramCategoryId } = useParams<{
    serviceId?: string;
    categoryId?: string;
  }>();
  const idType = state?.idType;

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });
    return sorted;
  }, [products, sortBy]);

  const fetchProducts = useCallback(async (page: number, limit: number) => {
    setIsPaginating(true);
    setIsLoadingProducts(page === 1 && !products.length);
    try {
      let endpoint = `${API.GET_ALL_PRODUCTS()}`;
      let params: any = {
        page,
        limit,
        offset: (page - 1) * limit,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (idType === "category" && paramCategoryId) {
        endpoint = `${API.GET_ALL_PRODUCT_BY_CATEGORY_ID()}`;
        params.categoryId = paramCategoryId;
      } else if (idType === "service" && paramServiceId) {
        endpoint = `${API.GET_ALL_PRODUCT_BY_SERVICE_ID()}`;
        params.serviceId = paramServiceId;
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

      const totalItems = response.data.pagination?.total || response.data.total || response.data.totalCount || response.data.meta?.total || fetchedProducts.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / limit));
      
      setPagination({
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: `Failed to load products`,
        variant: "destructive",
      });
      setProducts([]);
      setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1 }));
    } finally {
      setIsLoadingProducts(false);
      setIsPaginating(false);
    }
  }, [idType, paramServiceId, paramCategoryId, toast, categories, services, searchQuery]);

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
      fetchProducts(pagination.currentPage, pagination.itemsPerPage);
    }
  }, [servicesLoaded, categoriesLoaded, fetchProducts, pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ 
      ...prev, 
      itemsPerPage: newLimit, 
      currentPage: 1 
    }));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

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

      await axiosInstance.post(`${API.CREATE_PRODUCT()}`, {
        name: productData.name,
        price: productData.price,
        ...(categoryIdToUse && { categoryId: categoryIdToUse }),
        ...(serviceIdToUse && { serviceId: serviceIdToUse }),
      });

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setCreateModalOpen(false);
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      fetchProducts(1, pagination.itemsPerPage);
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
      fetchProducts(pagination.currentPage, pagination.itemsPerPage);
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
      setDeleteModalOpen(false);
      if (products.length === 1 && pagination.currentPage > 1) {
        setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
        fetchProducts(pagination.currentPage - 1, pagination.itemsPerPage);
      } else {
        fetchProducts(pagination.currentPage, pagination.itemsPerPage);
      }
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
    return sortedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [sortedProducts]);

  const shouldShowSkeleton = isLoadingProducts || !servicesLoaded || !categoriesLoaded;

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;

    if (totalPages <= 1) return [1];

    pages.push(1);

    if (totalPages <= 5) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [pagination.totalPages, pagination.currentPage]);

  return (
    <div className="space-y-6">
      <ProductsHeader
        breadcrumbItems={breadcrumbItems}
        title="Products"
        context={currentContext}
        productsCount={shouldShowSkeleton ? -1 : pagination.totalItems}
        totalValue={totalValue}
        onCreate={() => setCreateModalOpen(true)}
      />

      <ProductsControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        itemsPerPage={pagination.itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {shouldShowSkeleton ? (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
        }>
          {Array.from({ length: pagination.itemsPerPage }).map((_, index) => 
            viewMode === "grid" 
              ? <ProductCardSkeleton key={index} />
              : <ProductListItemSkeleton key={index} />
          )}
        </div>
      ) : products.length === 0 ? (
        <ProductsEmptyState
          searchQuery={searchQuery}
          contextType={currentContext.type}
          onCreate={() => setCreateModalOpen(true)}
        />
      ) : (
        <>
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
          }>
            {isPaginating ? (
              Array.from({ length: pagination.itemsPerPage }).map((_, index) => 
                viewMode === "grid" 
                  ? <ProductCardSkeleton key={index} />
                  : <ProductListItemSkeleton key={index} />
              )
            ) : (
              sortedProducts.map((product) => 
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
              )
            )}
          </div>

          <div className="flex items-center mt-6 p-4 border-t border-gray-200">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.totalItems > 0 ? ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1 : 0} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} products
            </div>
            <div className="flex-1 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.currentPage > 1) {
                          handlePageChange(pagination.currentPage - 1);
                        }
                      }}
                      className={`cursor-pointer ${pagination.currentPage === 1 || isPaginating ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map((pageNum, index) => (
                    <PaginationItem key={`${pageNum}-${index}`}>
                      {pageNum === '...' ? (
                        <span className="px-3 py-2 text-sm">...</span>
                      ) : (
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          isActive={pagination.currentPage === pageNum}
                          className={`cursor-pointer ${isPaginating ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.currentPage < pagination.totalPages) {
                          handlePageChange(pagination.currentPage + 1);
                        }
                      }}
                      className={`cursor-pointer ${pagination.currentPage === pagination.totalPages || isPaginating ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </>
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