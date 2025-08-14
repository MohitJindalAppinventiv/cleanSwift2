// import React, { useState, useEffect } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { ProductModal } from "./ProductModal";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ProductFormValues } from "./ProductForm";
// import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";

// const API_BASE_URL = "https://us-central1-laundry-app-dee6a.cloudfunctions.net";

// interface Product {
//   id: string;
//   name: string;
//   price?: number;
//   categoryId?: string;
//   serviceId?: string;
//   categoryName?: string;
//   serviceName?: string;
// }

// interface Service {
//   id: string;
//   name: string;
//   pricingModel: "per_kg" | "per_item";
// }

// interface Category {
//   categoryId: string;
//   categoryName: string;
//   serviceName: string;
// }

// export function ProductsConfigManager() {
//   const { toast } = useToast();
//   const { state } = useLocation();
//   const { serviceId: paramServiceId, serviceId: paramCategoryId } = useParams<{
//     serviceId?: string;
//     categoryId?: string;
//   }>();
//   const navigate = useNavigate();
//   const idType = state?.idType;

//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [services, setServices] = useState<Service[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [selectedService, setSelectedService] = useState<string>("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");

//   const [currentContext, setCurrentContext] = useState<{
//     type: "category" | "service" | "all";
//     name?: string;
//   }>({ type: "all" });

//   // Set current context based on navigation
//   useEffect(() => {
//     if (idType === "category" && paramCategoryId) {
//       const category = categories.find((c) => c.categoryId === paramCategoryId);
//       setCurrentContext({
//         type: "category",
//         name: category?.categoryName || "Unknown Category",
//       });
//     } else if (idType === "service" && paramServiceId) {
//       const service = services.find((s) => s.id === paramServiceId);
//       setCurrentContext({
//         type: "service",
//         name: service?.name || "Unknown Service",
//       });
//     } else {
//       setCurrentContext({ type: "all" });
//     }
//   }, [idType, paramServiceId, paramCategoryId, categories, services]);

//   // Fetch services and categories
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const servicesRes = await axios.get(`${API_BASE_URL}/getAllServices`);
//         setServices(servicesRes.data.data);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load services",
//           variant: "destructive",
//         });
//       }

//       try {
//         const categoriesRes = await axios.get(`${API_BASE_URL}/getAllCategoriesWithServiceNames`);
//         setCategories(categoriesRes.data.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load categories",
//           variant: "destructive",
//         });
//       }
//     };
//     fetchInitialData();
//   }, [toast]);

//   // Fetch products based on context
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setIsLoading(true);
//       try {
//         let endpoint = `${API_BASE_URL}/getAllProducts`;
//         let params = {};

//         if (idType === "category" && paramCategoryId) {
//           endpoint = `${API_BASE_URL}/getAllProductsByCategoryId`;
//           params = { categoryId: paramCategoryId };
//         } else if (idType === "service" && paramServiceId) {
//           endpoint = `${API_BASE_URL}/getProductByServiceId`;
//           params = { serviceId: paramServiceId };
//         }

//         const response = await axios.get(endpoint, { params });

//         const fetchedProducts = response.data.data.map((item: any) => ({
//           id: item.productId || item.id,
//           name: item.productName || item.name,
//           price: item.price ?? 0,
//           categoryId: item.categoryId || item.CategoryId,
//           serviceId: item.serviceId,
//           categoryName: item.categoryName,
//           serviceName: item.serviceName,
//         }));

//         setProducts(fetchedProducts);
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: `Failed to load products for ${
//             idType === "category"
//               ? "category"
//               : idType === "service"
//               ? "service"
//               : "all products"
//           }`,
//           variant: "destructive",
//         });
//         setProducts([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [idType, paramServiceId, paramCategoryId, toast]);

//   const createProduct = async (productData: ProductFormValues) => {
//     try {
//       let categoryIdToUse: string | undefined;
//       let serviceIdToUse: string | undefined;

//       if (idType === "category" && paramCategoryId) {
//         categoryIdToUse = paramCategoryId;
//       } else if (idType === "service" && paramServiceId) {
//         serviceIdToUse = paramServiceId;
//       } else {
//         if (!selectedService) {
//           toast({
//             title: "Error",
//             description: "Please select a service first",
//             variant: "destructive",
//           });
//           return;
//         }

//         const service = services.find((s) => s.id === selectedService);
//         if (!service) {
//           toast({
//             title: "Error",
//             description: "Selected service not found",
//             variant: "destructive",
//           });
//           return;
//         }

//         if (service.pricingModel === "per_item") {
//           if (!selectedCategory) {
//             toast({
//               title: "Error",
//               description: "Please select a category for this service",
//               variant: "destructive",
//             });
//             return;
//           }
//           categoryIdToUse = selectedCategory;
//         } else {
//           serviceIdToUse = service.id;
//         }
//       }

//       const response = await axios.post(`${API_BASE_URL}/createProduct`, {
//         name: productData.name,
//         price: productData.price,
//         ...(categoryIdToUse && { categoryId: categoryIdToUse }),
//         ...(serviceIdToUse && { serviceId: serviceIdToUse }),
//       });

//       const category = categoryIdToUse
//         ? categories.find((c) => c.categoryId === categoryIdToUse)
//         : null;
//       const service = serviceIdToUse
//         ? services.find((s) => s.id === serviceIdToUse)
//         : category
//         ? services.find((s) => s.name === category.serviceName)
//         : null;

//       toast({
//         title: "Success",
//         description: "Product created successfully",
//       });
//       setCreateModalOpen(false);
//       setProducts([
//         ...products,
//         {
//           id: response.data.id,
//           name: productData.name,
//           price: productData.price,
//           categoryId: categoryIdToUse,
//           serviceId: serviceIdToUse,
//           categoryName: category?.categoryName,
//           serviceName: service?.name,
//         },
//       ]);
//     } catch (error) {
//       console.error("Error creating product:", error);
//       toast({
//         title: "Error",
//         description: "Failed to create product",
//         variant: "destructive",
//       });
//     }
//   };

//   const updateProduct = async (
//     productId: string,
//     productData: ProductFormValues
//   ) => {
//     try {
//       await axios.put(
//         `${API_BASE_URL}/updateProduct`,
//         {
//           name: productData.name,
//           price: productData.price,
//         },
//         {
//           params: { productId },
//         }
//       );

//       toast({
//         title: "Success",
//         description: "Product updated successfully",
//       });
//       setEditModalOpen(false);
//       setProducts(
//         products.map((p) =>
//           p.id === productId
//             ? { ...p, name: productData.name, price: productData.price }
//             : p
//         )
//       );
//     } catch (error) {
//       console.error("Error updating product:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update product",
//         variant: "destructive",
//       });
//     }
//   };

//   const deleteProduct = async (productId: string) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/deleteProduct`, {
//         params: { productId },
//       });

//       toast({
//         title: "Success",
//         description: "Product deleted successfully",
//       });
//       setProducts(products.filter((p) => p.id !== productId));
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       toast({
//         title: "Error",
//         description: "Failed to delete product",
//         variant: "destructive",
//       });
//     }
//   };

//   // Breadcrumb items
//   const breadcrumbItems = () => {
//     const baseItems = [{ label: "Services", to: "/config/services" }];

//     if (idType === "category" && paramCategoryId) {
//       const category = categories.find((c) => c.categoryId === paramCategoryId);
//       const service = services.find((s) => s.name === category?.serviceName);
//       return [
//         ...baseItems,
//         { label: "Categories", to: `/config/categories/${service?.id || ""}` },
//         { label: "Products", to: `/config/products/${paramCategoryId}` },
//       ];
//     } else {
//       return [...baseItems, { label: "Products", to: `/config/products${paramServiceId ? `/${paramServiceId}` : ""}` }];
//     }
//   };

//   if (isLoading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Products</CardTitle>
//         </CardHeader>
//         <CardContent>Loading products...</CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <Breadcrumb items={breadcrumbItems()} />
//       <div className="flex items-center gap-4">
//         <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
//           <ArrowLeft className="h-4 w-4" />
//         </Button>
//         <div>
//           <h2 className="text-3xl font-bold">Products</h2>
//           {currentContext.type !== "all" && (
//             <p className="text-sm text-gray-500">
//               {currentContext.type === "category"
//                 ? `Under Category: ${currentContext.name}`
//                 : `Under Service: ${currentContext.name}`}
//             </p>
//           )}
//         </div>
//         <div className="ml-auto">
//           <Button onClick={() => setCreateModalOpen(true)}>
//             <Plus className="mr-2 h-4 w-4" /> Add New Product
//           </Button>
//         </div>
//       </div>

//       <ProductModal
//         open={createModalOpen}
//         onOpenChange={setCreateModalOpen}
//         onSubmit={createProduct}
//         title="Add New Product"
//         isSubmitting={false}
//         services={services}
//         categories={categories}
//         selectedService={selectedService}
//         setSelectedService={setSelectedService}
//         selectedCategory={selectedCategory}
//         setSelectedCategory={setSelectedCategory}
//         showServiceCategorySelect={!idType}
//       />

//       <ProductModal
//         open={editModalOpen}
//         onOpenChange={setEditModalOpen}
//         onSubmit={(data: ProductFormValues) => {
//           if (selectedProduct) {
//             updateProduct(selectedProduct.id, data);
//           }
//         }}
//         initialData={
//           selectedProduct
//             ? { name: selectedProduct.name, price: selectedProduct.price ?? 0 }
//             : undefined
//         }
//         title="Edit Product"
//         isSubmitting={false}
//       />

//       <Card>
//         <CardHeader>
//           <CardTitle>Product List</CardTitle>
//           {currentContext.type !== "all" && (
//             <p className="text-sm text-gray-500">
//               Showing products{" "}
//               {currentContext.type === "category"
//                 ? `for category "${currentContext.name}"`
//                 : `for service "${currentContext.name}"`}
//             </p>
//           )}
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {products.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">
//                 {idType === "category"
//                   ? "No products found under this category"
//                   : idType === "service"
//                   ? "No products found under this service"
//                   : "No products found"}
//               </p>
//             </div>
//           ) : (
//             products.map((product) => (
//               <div
//                 key={product.id}
//                 className="flex justify-between items-center p-4 border rounded-md"
//               >
//                 <div>
//                   <h3 className="font-medium">{product.name}</h3>
//                   <p className="text-sm">
//                     {product.price !== undefined
//                       ? `$${product.price.toFixed(2)}`
//                       : "Price not set"}
//                   </p>
//                   {product.categoryName && (
//                     <p className="text-xs text-gray-500">
//                       Category: {product.categoryName}
//                     </p>
//                   )}
//                   {product.serviceName && (
//                     <p className="text-xs text-gray-500">
//                       Service: {product.serviceName}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       setSelectedProduct(product);
//                       setEditModalOpen(true);
//                     }}
//                   >
//                     <Pencil className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => deleteProduct(product.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Package,
  DollarSign,
  Tag,
  Settings
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductModal } from "./ProductModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name");

  // Memoized current context to prevent unnecessary re-renders
  const currentContext = useMemo(() => {
    if (idType === "category" && paramCategoryId) {
      const category = categories.find((c) => c.categoryId === paramCategoryId);
      return {
        type: "category" as const,
        name: category?.categoryName || "Unknown Category",
      };
    } else if (idType === "service" && paramServiceId) {
      const service = services.find((s) => s.id === paramServiceId);
      return {
        type: "service" as const,
        name: service?.name || "Unknown Service",
      };
    } else {
      return { type: "all" as const };
    }
  }, [idType, paramServiceId, paramCategoryId, categories, services]);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.categoryName && product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.serviceName && product.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort products
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

  // Fetch services and categories only once
  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/getAllServices`),
          axios.get(`${API_BASE_URL}/getAllCategoriesWithServiceNames`)
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
          // Set as loaded even if failed to prevent infinite loading
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

  // Memoized product fetching function
  const fetchProducts = useCallback(async () => {
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

      const fetchedProducts = response.data.data.map((item: any) => {
        const categoryId = item.categoryId || item.CategoryId;
        const serviceId = item.serviceId;
        
        // Enhanced logic to find category and service names
        let categoryName = item.categoryName;
        let serviceName = item.serviceName;
        
        // If we're fetching by categoryId, we know the category
        if (idType === "category" && paramCategoryId) {
          const currentCategory = categories.find((c) => c.categoryId === paramCategoryId);
          if (currentCategory) {
            categoryName = currentCategory.categoryName;
            serviceName = currentCategory.serviceName;
          }
        }
        
        // If we're fetching by serviceId, we know the service
        if (idType === "service" && paramServiceId) {
          const currentService = services.find((s) => s.id === paramServiceId);
          if (currentService) {
            serviceName = currentService.name;
          }
        }
        
        // Fallback: try to find from our loaded data
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
      setIsLoading(false);
    }
  }, [idType, paramServiceId, paramCategoryId, toast, categories, services]);

  // Fetch products only when reference data is loaded and context changes
  useEffect(() => {
    // Wait for both services and categories to be loaded before fetching products
    if (servicesLoaded && categoriesLoaded) {
      fetchProducts();
    }
  }, [servicesLoaded, categoriesLoaded, fetchProducts]);

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
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // Memoized breadcrumb items
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

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-lg">
              {product.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center space-x-1 mt-1">
               Rs.  <span className="text-xl font-bold text-green-600">
                  {product.price !== undefined ? product.price.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => {
                  setSelectedProduct(product);
                  setEditModalOpen(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => deleteProduct(product.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3">
          {(product.categoryName || (idType === "category" && currentContext.name)) && (
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-orange-500" />
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {product.categoryName || (idType === "category" ? currentContext.name : "Unknown Category")}
              </Badge>
            </div>
          )}
          {(product.serviceName || (idType === "service" && currentContext.name)) && (
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-500" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {product.serviceName || (idType === "service" ? currentContext.name : "Unknown Service")}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card>
      <CardContent className="p-4">
        <div className="group flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-semibold">
              {product.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-600">
                    Rs. {product.price !== undefined ? product.price.toFixed(2) : "0.00"}
                  </span>
                </div>
                {product.categoryName && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {product.categoryName}
                  </Badge>
                )}
                {product.serviceName && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {product.serviceName}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedProduct(product);
                setEditModalOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteProduct(product.id)}
              className="text-red-600 hover:text-red-700 hover:border-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Show loading state while initial data is being fetched
  if (!servicesLoaded || !categoriesLoaded || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-primary">Products</h2>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Products</h2>
          </div>
          {currentContext.type !== "all" && (
            <p className="text-sm text-muted-foreground mt-1">
              {currentContext.type === "category"
                ? `Managing products in "${currentContext.name}" category`
                : `Managing products for "${currentContext.name}" service`}
            </p>
          )}
          <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>{filteredProducts.length} Products</span>
            </div>
            {products.length > 0 && (
              <div className="flex items-center space-x-2">
                <span>
                  Total Value: Rs. {products.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* Controls Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products, categories, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                  <SelectItem value="category">Sort by Category</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery 
                ? `No products found matching "${searchQuery}"`
                : currentContext.type === "category"
                ? "No products found under this category"
                : currentContext.type === "service"
                ? "No products found under this service"
                : "No products found"
              }
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "Get started by adding your first product"
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
        }>
          {filteredProducts.map((product) => 
            viewMode === "grid" 
              ? <ProductCard key={product.id} product={product} />
              : <ProductListItem key={product.id} product={product} />
          )}
        </div>
      )}

      {/* Modals */}
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
    </div>
  );
}