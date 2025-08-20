import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Order, Pagination } from "./types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/redux";
import { fetchOrders, updateOrderStatus } from "@/store/slices/orderSlice";
import { ChevronDown, Eye, Loader2 } from "lucide-react";

interface OrdersTableViewProps {
  orders: Order[];
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onStatusUpdated?: () => void;
}

const validStatuses = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "outForPickup",
    label: "Out for Pickup",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-gray-200 text-gray-800",
  },
  { value: "ready", label: "Ready", color: "bg-cyan-100 text-cyan-800" },
  {
    value: "outForDelivery",
    label: "Out for Delivery",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  // { value: "completed", label: "Completed", color: "bg-emerald-100 text-emerald-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export function OrdersTableView({
  orders,
  pagination,
  onPageChange,
  onStatusUpdated,
}: OrdersTableViewProps) {
  const navigate = useNavigate();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Order status flow sequence
  // const statusFlow = [
  //   "pending",
  //   "confirmed",
  //   "outForPickup",
  //   "processing",
  //   "ready",
  //   "outForDelivery",
  //   "delivered",
  // ];

  // // Helper: get allowed statuses based on current one
  // const getAllowedStatuses = (currentStatus: string) => {
  //   const currentIndex = statusFlow.indexOf(currentStatus);
  //   if (currentIndex === -1) return ["cancelled"]; // fallback
  //   // forward statuses only + cancelled
  //   return [...statusFlow.slice(currentIndex + 1), "cancelled"];
  // };

  //   const statusFlow = [
  //   "pending",
  //   "confirmed",
  //   "outForPickup",
  //   "processing",
  //   "ready",
  //   "outForDelivery",
  //   "delivered",
  // ];

  // const getAllowedStatuses = (currentStatus: string) => {
  //   const currentIndex = statusFlow.indexOf(currentStatus);
  //   if (currentIndex === -1) return [];

  //   // forward statuses
  //   const nextStatuses = statusFlow.slice(currentIndex + 1);

  //   // allow cancelled only before outForDelivery
  //   if (currentStatus !== "outForDelivery" && currentStatus !== "delivered") {
  //     return [...nextStatuses, "cancelled"];
  //   }

  //   return nextStatuses; // no cancel option after outForDelivery
  // };

  const statusFlow = [
    "pending",
    "confirmed",
    "outForPickup",
    "processing",
    "ready",
    "outForDelivery",
    "delivered",
  ];

  const getAllowedStatuses = (currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1) return [];

    // forward statuses only
    const nextStatuses = statusFlow.slice(currentIndex + 1);

    // allow cancel only before outForPickup
    if (currentStatus === "pending" || currentStatus === "confirmed") {
      return [...nextStatuses, "cancelled"];
    }

    return nextStatuses;
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setLoadingOrderId(orderId);
      await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      toast.success(
        `Order status updated to ${
          validStatuses.find((s) => s.value === status)?.label
        }`
      );
      await dispatch(
        fetchOrders({ page: pagination?.page, limit: pagination?.limit })
      );
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const getStatusHoverColor = (status) => {
    const colorMap = {
      pending: "hover:bg-gray-50 text-gray-700 hover:text-gray-800",
      confirmed: "hover:bg-cyan-50 text-cyan-700 hover:text-cyan-800",
      outForPickup: "hover:bg-purple-50 text-purple-700 hover:text-purple-800",
      processing: "hover:bg-yellow-50 text-yellow-700 hover:text-yellow-800",
      ready: "hover:bg-blue-50 text-blue-700 hover:text-blue-800",
      outForDelivery:
        "hover:bg-orange-50 text-orange-700 hover:text-orange-800",
      delivered: "hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800",
      cancelled: "hover:bg-red-50 text-red-700 hover:text-red-800",
    };
    return colorMap[status] || "hover:bg-gray-50 text-gray-700";
  };

  const getStatusIconColor = (status) => {
    const iconColorMap = {
      pending: "text-gray-500",
      confirmed: "text-cyan-500",
      outForPickup: "text-purple-500",
      processing: "text-yellow-500",
      ready: "text-blue-500",
      outForDelivery: "text-orange-500",
      delivered: "text-indigo-500",
      cancelled: "text-red-500",
    };
    return iconColorMap[status] || "text-gray-500";
  };

  const renderPagination = () => {
    if (!pagination) return null;
    const { page, limit, total, totalPages } = pagination;
    if (totalPages <= 1) return null;

    const pageNumbers: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (page <= 3) {
        pageNumbers.push(2, 3, 4, "ellipsis");
      } else if (page >= totalPages - 2) {
        pageNumbers.push(
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1
        );
      } else {
        pageNumbers.push("ellipsis", page - 1, page, page + 1, "ellipsis");
      }
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        {/* Total Results */}
        <div className="text-sm text-gray-600 px-4 py-2 rounded-md border bg-white shadow-sm">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {(page - 1) * limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-800">
            {Math.min(page * limit, total)}
          </span>{" "}
          of <span className="font-semibold text-gray-800">{total}</span>{" "}
          results
        </div>

        {/* Pagination */}
        <PaginationComponent className="mx-0 w-auto">
          <PaginationContent className="gap-1">
            {/* Prev */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={`${
                  page === 1
                    ? "pointer-events-none opacity-50 bg-gray-100"
                    : "cursor-pointer bg-white hover:bg-[#9B87F5] hover:text-white transition-colors"
                } border rounded-md px-3 py-2`}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {pageNumbers.map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === "ellipsis" ? (
                  <div className="flex h-9 w-9 items-center justify-center text-gray-400 font-medium">
                    ...
                  </div>
                ) : (
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => onPageChange(pageNumber as number)}
                    className={`h-9 w-9 flex items-center justify-center border rounded-md text-sm transition-colors
                    ${
                      page === pageNumber
                        ? "bg-[#9B87F5] text-white border-[#9B87F5]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-[#9B87F5] hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={`${
                  page === totalPages
                    ? "pointer-events-none opacity-50 bg-gray-100"
                    : "cursor-pointer bg-white hover:bg-[#9B87F5] hover:text-white transition-colors"
                } border rounded-md px-3 py-2`}
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationComponent>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border shadow-sm bg-white overflow-hidden transition-all">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-800">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Address
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Order Date
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Total
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Payment Method
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Payment Status
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Order Status
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-800">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.length > 0 ? (
              orders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <TableCell className="font-medium text-gray-900">
                    {order.orderId}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {order.customerName}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-gray-600">
                      {order.addressLabel || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    ${order.finalTotal?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-gray-600">
                      {order.paymentMethod?.replace("_", " ") || "N/A"}
                    </span>
                  </TableCell>
                  {/* <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus || "Pending"}
                    </span>
                  </TableCell> */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors
                        ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.paymentStatus === "refunded"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {order.paymentStatus || "pending"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Details Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order.id)}
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loadingOrderId === order.id}
                            className="bg-gradient-to-r from-[#9B87F5] to-[#9B87F5] text-white hover:from-[#7C3AED] hover:to-[#9333EA] border-0 shadow-md transition-all duration-200 rounded-lg"
                          >
                            {loadingOrderId === order.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <ChevronDown className="h-4 w-4 mr-1" />
                            )}
                            Update Status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-52 bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-xl ring-1 ring-gray-200/50"
                        >
                          <DropdownMenuLabel className="text-slate-700 font-semibold bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-xl py-3 px-4 text-sm">
                            Change Status
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="border-gray-200/60" />
                          <div className="p-1">
                            {/* {validStatuses.map((statusItem) => (
                              <DropdownMenuItem
                                key={statusItem.value}
                                onClick={() =>
                                  handleUpdateStatus(order.id, statusItem.value)
                                }
                                disabled={
                                  loadingOrderId === order.id ||
                                  order.status === statusItem.value
                                }
                                className={`cursor-pointer transition-all duration-200 rounded-lg mx-1 mb-1 p-3 ${
                                  order.status === statusItem.value
                                    ? "bg-slate-100 text-slate-500 opacity-70 cursor-not-allowed"
                                    : getStatusHoverColor(statusItem.value)
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2">
                                    {statusItem.icon && (
                                      <span
                                        className={getStatusIconColor(
                                          statusItem.value
                                        )}
                                      >
                                        {statusItem.icon}
                                      </span>
                                    )}
                                    <span className="font-medium text-sm">
                                      {statusItem.label}
                                    </span>
                                  </div>
                                  {order.status === statusItem.value && (
                                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium">
                                      Current
                                    </span>
                                  )}
                                </div>
                              </DropdownMenuItem>
                            ))} */}

                            {validStatuses
                              .filter((statusItem) =>
                                getAllowedStatuses(order.status).includes(
                                  statusItem.value
                                )
                              )
                              .map((statusItem) => (
                                <DropdownMenuItem
                                  key={statusItem.value}
                                  onClick={() =>
                                    handleUpdateStatus(
                                      order.id,
                                      statusItem.value
                                    )
                                  }
                                  disabled={loadingOrderId === order.id}
                                  className={`cursor-pointer transition-all duration-200 rounded-lg mx-1 mb-1 p-3 ${getStatusHoverColor(
                                    statusItem.value
                                  )}`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      {statusItem.icon && (
                                        <span
                                          className={getStatusIconColor(
                                            statusItem.value
                                          )}
                                        >
                                          {statusItem.icon}
                                        </span>
                                      )}
                                      <span className="font-medium text-sm">
                                        {statusItem.label}
                                      </span>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v1a2 2 0 001 1.732l1 .607a.75.75 0 00.75 0l1-.607A2 2 0 0010 8V7a2 2 0 00-2-2zM5.25 6H.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5zM0 10.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H.75a.75.75 0 01-.75-.75zM0 13.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H.75a.75.75 0 01-.75-.75z"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 font-medium">
                        No orders found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination()}
    </div>
  );
}
