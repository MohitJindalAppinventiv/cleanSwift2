
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Order, mockOrders, OrderStatus, ServiceType } from "./orders/types";
import { OrdersMobileView } from "./orders/OrdersMobileView";
import { OrdersTableView } from "./orders/OrdersTableView";

interface OrdersTableProps {
  searchQuery?: string;
  statusFilter?: string;
  serviceFilter?: string;
}

export function OrdersTable({ 
  searchQuery = "", 
  statusFilter = "all", 
  serviceFilter = "all" 
}: OrdersTableProps) {
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [paginatedOrders, setPaginatedOrders] = useState<Order[]>([]);

  // Filter orders based on search query, status, and service
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter as OrderStatus);
    }
    
    // Apply service filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter(order => order.service === serviceFilter as ServiceType);
    }
    
    // Apply search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, serviceFilter, orders]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedOrders(filteredOrders.slice(startIndex, endIndex));
  }, [currentPage, pageSize, filteredOrders]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isMobile) {
    return <OrdersMobileView orders={paginatedOrders} />;
  }

  return (
    <OrdersTableView 
      orders={paginatedOrders} 
      pagination={{
        currentPage,
        pageSize,
        totalItems: filteredOrders.length,
        onPageChange: handlePageChange
      }} 
    />
  );
}
