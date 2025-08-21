
// // import { useState, useEffect } from "react";
// // import { useIsMobile } from "@/hooks/use-mobile";
// // import { Order, OrderStatus, Pagination as PaginationType } from "./orders/types";
// // // import { OrdersMobileView } from "./orders/OrdersMobileView";
// // import { OrdersTableView } from "./orders/OrdersTableView";
// // import { axiosInstance } from "@/api/axios/axiosInstance";
// // import { Pagination } from "../ui/pagination";

// // interface OrdersTableProps {
// //   searchQuery?: string;
// //   statusFilter?: string;
// // }

// // interface ApiResponse {
// //   orders: Order[];
// //   pagination?: {
// //     page: number;
// //     limit: number;
// //     total: number;
// //     totalPages: number;
// //   };
// // }

// // export function OrdersTable({ 
// //   searchQuery = "", 
// //   statusFilter = "all", 
// // }: OrdersTableProps) {
// //   const isMobile = useIsMobile();
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
// //   const [isLoading, setIsLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
  
// //   // Pagination states
// //   const [currentPage, setCurrentPage] = useState<number>(1);
// //   const [pageSize, setPageSize] = useState<number>(5);
// //   const [totalItems, setTotalItems] = useState<number>(0);
// //   const [pagintation,setPagination]=useState<PaginationType>();
// //   const [paginatedOrders, setPaginatedOrders] = useState<Order[]>([]);

// //   async function fetchOrders() {
// //     setIsLoading(true);
// //     setError(null);
// //     try {
// //       const response = await axiosInstance.get("/getAllOrders", {
// //         params: {
// //           page: currentPage,
// //           limit: pageSize,
// //           status: statusFilter !== "all" ? statusFilter : undefined,
// //           search: searchQuery.trim() !== "" ? searchQuery : undefined,
// //         },
// //       });
// //       console.log(response);

// //       if (response.data.data) {
// //         setOrders(response.data.data.orders);
// //         // setFilteredOrders(response.data.data.pagination);
// //         setPagination(response.data.data.pagination)
        
// //         // if (response.data.pagination) {
// //         //   setTotalItems(response.data.pagination.total);
// //         // } else {
// //         //   // Client-side fallback
// //         //   setTotalItems(response.data.data.length);
// //         // }
// //       }
// //     } catch (err) {
// //       console.error("Failed to fetch orders:", err);
// //       setError("Failed to fetch orders. Please try again later.");
// //       setOrders([]);
// //       setFilteredOrders([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Initial fetch and when filters/pagination change
// //   useEffect(() => {
// //     fetchOrders();
// //   }, [currentPage, pageSize, statusFilter, searchQuery]);

// //   // Client-side filtering (if you prefer to do it client-side)
// //   useEffect(() => {
// //     if (!orders.length) return;

// //     let filtered = [...orders];
    
// //     // Apply status filter
// //     if (statusFilter !== "all") {
// //       filtered = filtered.filter(order => order.status === statusFilter as OrderStatus);
// //     }
    
// //     // Apply search query filter
// //     if (searchQuery.trim() !== "") {
// //       const query = searchQuery.toLowerCase();
// //       filtered = filtered.filter(
// //         (order) =>
// //           (order.id && order.id.toLowerCase().includes(query)) ||
// //           (order.customerName && order.customerName.toLowerCase().includes(query)) ||
// //           (order.orderId && order.orderId.toLowerCase().includes(query))
// //       );
// //     }
    
// //     setFilteredOrders(filtered);
// //     setTotalItems(filtered.length);
// //     setCurrentPage(1); // Reset to first page when filters change
// //   }, [searchQuery, statusFilter, orders]);

// //   // Client-side pagination (if you're not using server-side pagination)
// //   useEffect(() => {
// //     const startIndex = (currentPage - 1) * pageSize;
// //     const endIndex = startIndex + pageSize;
// //     setPaginatedOrders(filteredOrders.slice(startIndex, endIndex));
// //   }, [currentPage, pageSize, filteredOrders]);

// //   // Handle page change
// //   const handlePageChange = (page: number) => {
// //     setCurrentPage(page);
// //   };

// //   if (isLoading) {
// //     return <div>Loading orders...</div>;
// //   }

// //   if (error) {
// //     return <div className="text-red-500">{error}</div>;
// //   }

// //   // if (isMobile) {
// //   //   return <OrdersMobileView orders={paginatedOrders} />;
// //   // }

// //   return (
// //     <OrdersTableView 
// //       orders={paginatedOrders} 
// //       pagination={pagintation}
// //         onPageChange={ handlePageChange}
// //         // onPageSizeChange: setPageSize

// //     />
// //   );
// // }



// import { Order, Pagination } from "./orders/types";
// import { OrdersTableView } from "./orders/OrdersTableView";
// import OrdersTableSkeleton from "./orders/OrderTableSkeleton";
// interface OrdersTableProps {
//   orders: Order[];
//   pagination: Pagination | null;
//   isLoading: boolean;
//   onPageChange: (page: number) => void;
// }

// export function OrdersTable({ 
//   orders,
//   pagination,
//   isLoading,
//   onPageChange
// }: OrdersTableProps) {

//   // if (isLoading) {
//   //   return (
//   //     <OrdersTableSkeleton/>
//   //   );
//   // }
 
//   return (
//     <OrdersTableView 
//       orders={orders} 
//       pagination={pagination}
//       onPageChange={onPageChange}
//     />
//   );
// }


import { Order, Pagination } from "./orders/types";
import { OrdersTableView } from "./orders/OrdersTableView";
import OrdersTableSkeleton from "./orders/OrderTableSkeleton";

interface OrdersTableProps {
  orders: Order[];
  pagination: Pagination | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

export function OrdersTable({ 
  orders,
  pagination,
  isLoading,
  onPageChange,
  pageSize = 10
}: OrdersTableProps) { 

  // if (isLoading) {
  //   return (
  //     <OrdersTableSkeleton/>
  //   );
  // }
 
  return (
    <OrdersTableView 
      orders={orders} 
      pagination={pagination}
      onPageChange={onPageChange}
      pageSize={pageSize}
    />
  );
}