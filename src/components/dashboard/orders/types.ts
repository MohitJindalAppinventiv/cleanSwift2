import type { OrderStatus } from "./OrderStatusBadge";

export type ServiceType = "wash_fold" | "dry_clean" | "express";

// ✅ Updated PaymentStatus
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}



export interface Order {
  addressLabel: string;
  createdAt: Date;
  customerName: string;
  finalTotal: number;
  id: string;
  orderId: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export const serviceLabels: Record<ServiceType, string> = {
  wash_fold: "Wash & Fold",
  dry_clean: "Dry Clean",
  express: "Express",
};

// Pagination interface
export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

