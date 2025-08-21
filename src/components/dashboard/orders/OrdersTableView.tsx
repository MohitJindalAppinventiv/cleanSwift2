// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { Button } from "@/components/ui/button";
// import { Order, Pagination } from "./types";
// import { OrderStatus, OrderStatusBadge } from "./OrderStatusBadge";
// import {
//   Pagination as PaginationComponent,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { toast } from "sonner";
// import { useAppDispatch } from "@/hooks/redux";
// import { fetchOrders, updateOrderStatus } from "@/store/slices/orderSlice";
// import {
//   ChevronDown,
//   Eye,
//   Loader2,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   Filter,
//   Clock,
//   CheckCircle2,
//   PackageOpen,
//   Cog,
//   ClipboardCheck,
//   Truck,
//   CheckSquare,
//   XCircle,
// } from "lucide-react";

// interface OrdersTableViewProps {
//   orders: Order[];
//   pagination: Pagination | null;
//   onPageChange: (page: number) => void;
//   onStatusUpdated?: () => void;
//   pageSize?: number;
// }

// type SortField = "createdAt" | "finalTotal";
// type SortDirection = "asc" | "desc";

// interface SortConfig {
//   field: SortField | null;
//   direction: SortDirection;
// }

// interface FilterConfig {
//   paymentMethod: string[];
//   paymentStatus: string[];
// }

// const validStatuses = [
//   {
//     value: "pending",
//     label: "Pending",
//     color: "bg-yellow-100 text-yellow-800",
//     icon: <Clock className="w-4 h-4" />,
//   },
//   {
//     value: "confirmed",
//     label: "Confirmed",
//     color: "bg-blue-100 text-blue-800",
//     icon: <CheckCircle2 className="w-4 h-4" />,
//   },
//   {
//     value: "outForPickup",
//     label: "Out for Pickup",
//     color: "bg-orange-100 text-orange-800",
//     icon: <PackageOpen className="w-4 h-4" />,
//   },
//   {
//     value: "processing",
//     label: "Processing",
//     color: "bg-gray-200 text-gray-800",
//     icon: <Cog className="w-4 h-4 animate-spin-slow" />,
//   },
//   {
//     value: "ready",
//     label: "Ready",
//     color: "bg-cyan-100 text-cyan-800",
//     icon: <ClipboardCheck className="w-4 h-4" />,
//   },
//   {
//     value: "outForDelivery",
//     label: "Out for Delivery",
//     color: "bg-indigo-100 text-indigo-800",
//     icon: <Truck className="w-4 h-4" />,
//   },
//   {
//     value: "delivered",
//     label: "Delivered",
//     color: "bg-green-100 text-green-800",
//     icon: <CheckSquare className="w-4 h-4" />,
//   },
//   {
//     value: "cancelled",
//     label: "Cancelled",
//     color: "bg-red-100 text-red-800",
//     icon: <XCircle className="w-4 h-4" />,
//   },
// ];

// // Payment method options
// const paymentMethods = [
//   { value: "cod", label: "Cash on Delivery" },
//   { value: "online", label: "Online" },
// ];

// // Payment status options
// const paymentStatuses = [
//   { value: "pending", label: "Pending" },
//   { value: "paid", label: "Paid" },
//   { value: "refunded", label: "Refunded" },
// ];

// export function OrdersTableView({
//   orders,
//   pagination,
//   onPageChange,
//   onStatusUpdated,
//   pageSize = 10,
// }: OrdersTableViewProps) {
//   const navigate = useNavigate();
//   const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
//   const dispatch = useAppDispatch();

//   // Sorting state
//   const [sortConfig, setSortConfig] = useState<SortConfig>({
//     field: null,
//     direction: "asc",
//   });

//   // Filtering state
//   const [filters, setFilters] = useState<FilterConfig>({
//     paymentMethod: [],
//     paymentStatus: [],
//   });

//   const statusFlow = [
//     "pending",
//     "confirmed",
//     "outForPickup",
//     "processing",
//     "ready",
//     "outForDelivery",
//     "delivered",
//   ];

//   const getAllowedStatuses = (currentStatus: string) => {
//     // If status is pending, return empty array (no allowed status changes)
//     if (currentStatus === "pending") {
//       return [];
//     }

//     // If status is delivered, return empty array (no allowed status changes)
//     if (currentStatus === "delivered") {
//       return [];
//     }

//     const currentIndex = statusFlow.indexOf(currentStatus);
//     if (currentIndex === -1) return [];

//     const allowed: string[] = [];

//     // allow next status only (incremental flow)
//     if (currentIndex < statusFlow.length - 1) {
//       allowed.push(statusFlow[currentIndex + 1]);
//     }

//     // allow cancel only until outForPickup
//     if (["pending", "confirmed", "outForPickup"].includes(currentStatus)) {
//       allowed.push("cancelled");
//     }

//     return allowed;
//   };

//   // Sort function
//   const handleSort = (field: SortField) => {
//     setSortConfig((prevConfig) => ({
//       field,
//       direction:
//         prevConfig.field === field && prevConfig.direction === "asc"
//           ? "desc"
//           : "asc",
//     }));
//   };

//   // Filter functions
//   const handleFilterChange = (
//     filterType: keyof FilterConfig,
//     value: string
//   ) => {
//     setFilters((prevFilters) => {
//       const currentValues = prevFilters[filterType];
//       const updatedValues = currentValues.includes(value)
//         ? currentValues.filter((v) => v !== value)
//         : [...currentValues, value];

//       return {
//         ...prevFilters,
//         [filterType]: updatedValues,
//       };
//     });
//   };

//   const clearFilters = () => {
//     setFilters({
//       paymentMethod: [],
//       paymentStatus: [],
//     });
//   };

//   // Apply sorting and filtering
//   const processedOrders = React.useMemo(() => {
//     let processed = [...(orders || [])];

//     // Apply filters
//     if (filters.paymentMethod.length > 0) {
//       processed = processed.filter((order) =>
//         filters.paymentMethod.includes(order.paymentMethod || "")
//       );
//     }

//     if (filters.paymentStatus.length > 0) {
//       processed = processed.filter((order) =>
//         filters.paymentStatus.includes(order.paymentStatus || "")
//       );
//     }

//     // Apply sorting
//     if (sortConfig.field) {
//       processed.sort((a, b) => {
//         let aValue: number = 0;
//         let bValue: number = 0;

//         if (sortConfig.field === "createdAt") {
//           aValue = new Date(a.createdAt).getTime();
//           bValue = new Date(b.createdAt).getTime();
//         } else if (sortConfig.field === "finalTotal") {
//           aValue = a.finalTotal || 0;
//           bValue = b.finalTotal || 0;
//         }

//         if (aValue < bValue) {
//           return sortConfig.direction === "asc" ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === "asc" ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     return processed;
//   }, [orders, sortConfig, filters]);

//   const getSortIcon = (field: SortField) => {
//     if (sortConfig.field !== field) {
//       return <ArrowUpDown className="h-4 w-4 opacity-50" />;
//     }
//     return sortConfig.direction === "asc" ? (
//       <ArrowUp className="h-4 w-4" />
//     ) : (
//       <ArrowDown className="h-4 w-4" />
//     );
//   };

//   const handleViewDetails = (orderId: string) => {
//     navigate(`/order-details/${orderId}`);
//   };

//   const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
//     try {
//       setLoadingOrderId(orderId);
//       await dispatch(updateOrderStatus({ orderId, status })).unwrap();
//       toast.success(
//         `Order status updated to ${
//           validStatuses.find((s) => s.value === status)?.label
//         }`
//       );
//       await dispatch(
//         fetchOrders({ page: pagination?.page, limit: pagination?.limit })
//       );
//     } catch (error) {
//       toast.error("Failed to update status");
//     } finally {
//       setLoadingOrderId(null);
//     }
//   };

//   const getStatusHoverColor = (status: string) => {
//     const colorMap = {
//       pending: "hover:bg-gray-50 text-gray-700 hover:text-gray-800",
//       confirmed: "hover:bg-cyan-50 text-cyan-700 hover:text-cyan-800",
//       outForPickup: "hover:bg-purple-50 text-purple-700 hover:text-purple-800",
//       processing: "hover:bg-yellow-50 text-yellow-700 hover:text-yellow-800",
//       ready: "hover:bg-blue-50 text-blue-700 hover:text-blue-800",
//       outForDelivery:
//         "hover:bg-orange-50 text-orange-700 hover:text-orange-800",
//       delivered: "hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800",
//       cancelled: "hover:bg-red-50 text-red-700 hover:text-red-800",
//     };
//     return colorMap[status] || "hover:bg-gray-50 text-gray-700";
//   };

//   const getStatusIconColor = (status: string) => {
//     const iconColorMap = {
//       pending: "text-gray-500",
//       confirmed: "text-cyan-500",
//       outForPickup: "text-purple-500",
//       processing: "text-yellow-500",
//       ready: "text-blue-500",
//       outForDelivery: "text-orange-500",
//       delivered: "text-indigo-500",
//       cancelled: "text-red-500",
//     };
//     return iconColorMap[status] || "text-gray-500";
//   };

//   const hasActiveFilters =
//     filters.paymentMethod.length > 0 || filters.paymentStatus.length > 0;

//   const renderPagination = () => {
//     if (!pagination) return null;
//     const { page, limit, total, totalPages } = pagination;
//     if (totalPages <= 1) return null;

//     const pageNumbers: (number | "ellipsis")[] = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
//     } else {
//       pageNumbers.push(1);
//       if (page <= 3) {
//         pageNumbers.push(2, 3, 4, "ellipsis");
//       } else if (page >= totalPages - 2) {
//         pageNumbers.push(
//           "ellipsis",
//           totalPages - 3,
//           totalPages - 2,
//           totalPages - 1
//         );
//       } else {
//         pageNumbers.push("ellipsis", page - 1, page, page + 1, "ellipsis");
//       }
//       pageNumbers.push(totalPages);
//     }

//     return (
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
//         <div className="text-sm text-gray-600 px-4 py-2 rounded-md border bg-white shadow-sm">
//           Showing{" "}
//           <span className="font-semibold text-gray-800">
//             {(page - 1) * limit + 1}
//           </span>{" "}
//           to{" "}
//           <span className="font-semibold text-gray-800">
//             {Math.min(page * limit, total)}
//           </span>{" "}
//           of <span className="font-semibold text-gray-800">{total}</span>{" "}
//           results ({limit} per page)
//         </div>

//         <PaginationComponent className="mx-0 w-auto">
//           <PaginationContent className="gap-1">
//             <PaginationItem>
//               <PaginationPrevious
//                 onClick={() => onPageChange(Math.max(1, page - 1))}
//                 className={`${
//                   page === 1
//                     ? "pointer-events-none opacity-50 bg-gray-100"
//                     : "cursor-pointer bg-white hover:bg-[#9B87F5] hover:text-white transition-colors"
//                 } border rounded-md px-3 py-2`}
//               />
//             </PaginationItem>

//             {pageNumbers.map((pageNumber, index) => (
//               <PaginationItem key={index}>
//                 {pageNumber === "ellipsis" ? (
//                   <div className="flex h-9 w-9 items-center justify-center text-gray-400 font-medium">
//                     ...
//                   </div>
//                 ) : (
//                   <PaginationLink
//                     isActive={page === pageNumber}
//                     onClick={() => onPageChange(pageNumber as number)}
//                     className={`h-9 w-9 flex items-center justify-center border rounded-md text-sm transition-colors
//                     ${
//                       page === pageNumber
//                         ? "bg-[#9B87F5] text-white border-[#9B87F5]"
//                         : "bg-white text-gray-700 border-gray-300 hover:bg-[#9B87F5] hover:text-white"
//                     }`}
//                   >
//                     {pageNumber}
//                   </PaginationLink>
//                 )}
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//                 className={`${
//                   page === totalPages
//                     ? "pointer-events-none opacity-50 bg-gray-100"
//                     : "cursor-pointer bg-white hover:bg-[#9B87F5] hover:text-white transition-colors"
//                 } border rounded-md px-3 py-2`}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </PaginationComponent>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Filter Summary */}
//       {hasActiveFilters && (
//         <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <div className="flex items-center gap-2">
//             <Filter className="h-4 w-4 text-blue-600" />
//             <span className="text-sm font-medium text-blue-700">
//               {processedOrders.length} of {orders?.length || 0} orders shown
//             </span>
//             <div className="flex items-center gap-2 ml-4">
//               {filters.paymentMethod.length > 0 && (
//                 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                   Payment Method: {filters.paymentMethod.length}
//                 </span>
//               )}
//               {filters.paymentStatus.length > 0 && (
//                 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                   Payment Status: {filters.paymentStatus.length}
//                 </span>
//               )}
//             </div>
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={clearFilters}
//             className="text-blue-700 border-blue-300 hover:bg-blue-100"
//           >
//             Clear Filters
//           </Button>
//         </div>
//       )}

//       <div className="rounded-lg border shadow-sm bg-white overflow-hidden transition-all">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-50">
//               <TableHead className="font-semibold text-gray-800">
//                 Order ID
//               </TableHead>
//               <TableHead className="font-semibold text-gray-800">
//                 Customer
//               </TableHead>
//               <TableHead className="font-semibold text-gray-800">
//                 Address
//               </TableHead>
//               <TableHead className="font-semibold text-gray-800">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => handleSort("createdAt")}
//                   className="h-auto p-0 font-semibold text-gray-800 hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2"
//                 >
//                   Order Date
//                   {getSortIcon("createdAt")}
//                 </Button>
//               </TableHead>
//               <TableHead className="font-semibold text-gray-800">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => handleSort("finalTotal")}
//                   className="h-auto p-0 font-semibold text-gray-800 hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2"
//                 >
//                   Total
//                   {getSortIcon("finalTotal")}
//                 </Button>
//               </TableHead>
//               <TableHead className="font-semibold text-gray-800">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className={`h-auto p-0 font-semibold hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2 ${
//                         filters.paymentMethod.length > 0
//                           ? "text-[#9B87F5]"
//                           : "text-gray-800"
//                       }`}
//                     >
//                       Payment Method
//                       <Filter
//                         className={`h-3 w-3 ${
//                           filters.paymentMethod.length > 0
//                             ? "text-[#9B87F5]"
//                             : "text-gray-500"
//                         }`}
//                       />
//                       {filters.paymentMethod.length > 0 && (
//                         <span className="bg-[#9B87F5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                           {filters.paymentMethod.length}
//                         </span>
//                       )}
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="start" className="w-48">
//                     <DropdownMenuLabel>
//                       Filter by Payment Method
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     {paymentMethods.map((method) => (
//                       <DropdownMenuItem
//                         key={method.value}
//                         onClick={() =>
//                           handleFilterChange("paymentMethod", method.value)
//                         }
//                         className="cursor-pointer"
//                       >
//                         <div className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={filters.paymentMethod.includes(
//                               method.value
//                             )}
//                             onChange={() => {}}
//                             className="rounded border-gray-300"
//                           />
//                           <span>{method.label}</span>
//                         </div>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableHead>
//               <TableHead className="font-semibold text-gray-800">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className={`h-auto p-0 font-semibold hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2 ${
//                         filters.paymentStatus.length > 0
//                           ? "text-[#9B87F5]"
//                           : "text-gray-800"
//                       }`}
//                     >
//                       Payment Status
//                       <Filter
//                         className={`h-3 w-3 ${
//                           filters.paymentStatus.length > 0
//                             ? "text-[#9B87F5]"
//                             : "text-gray-500"
//                         }`}
//                       />
//                       {filters.paymentStatus.length > 0 && (
//                         <span className="bg-[#9B87F5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                           {filters.paymentStatus.length}
//                         </span>
//                       )}
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="start" className="w-48">
//                     <DropdownMenuLabel>
//                       Filter by Payment Status
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     {paymentStatuses.map((status) => (
//                       <DropdownMenuItem
//                         key={status.value}
//                         onClick={() =>
//                           handleFilterChange("paymentStatus", status.value)
//                         }
//                         className="cursor-pointer"
//                       >
//                         <div className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={filters.paymentStatus.includes(
//                               status.value
//                             )}
//                             onChange={() => {}}
//                             className="rounded border-gray-300"
//                           />
//                           <span>{status.label}</span>
//                         </div>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableHead>
//               <TableHead className="font-semibold text-gray-800">
//                 Order Status
//               </TableHead>
//               <TableHead className="text-right font-semibold text-gray-800">
//                 Actions
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {processedOrders?.length > 0 ? (
//               processedOrders.map((order, index) => (
//                 <TableRow
//                   key={order.id}
//                   className={`hover:bg-gray-50 transition-colors ${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   }`}
//                 >
//                   <TableCell className="font-medium text-gray-900">
//                     {order.orderId}
//                   </TableCell>
//                   <TableCell className="text-gray-700">
//                     {order.customerName}
//                   </TableCell>
//                   <TableCell>
//                     <div className="max-w-[200px] truncate text-gray-600">
//                       {order.addressLabel || "N/A"}
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-gray-600">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell className="font-semibold text-gray-900">
//                     ${order.finalTotal?.toFixed(2) || "0.00"}
//                   </TableCell>
//                   <TableCell>
//                     <span className="capitalize text-gray-600">
//                       {order.paymentMethod === "cod"
//                         ? "Cash on Delivery"
//                         : order.paymentMethod === "online"
//                         ? "Online"
//                         : "N/A"}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <span
//                       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors
//                         ${
//                           order.paymentStatus === "paid"
//                             ? "bg-green-100 text-green-800"
//                             : order.paymentStatus === "refunded"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                     >
//                       {order.paymentStatus || "pending"}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <OrderStatusBadge status={order.status} />
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       {/* View Details Button */}
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleViewDetails(order.id)}
//                         className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
//                       >
//                         <Eye className="h-4 w-4 mr-1" />
//                         View
//                       </Button>

//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={loadingOrderId === order.id}
//                             className="bg-gradient-to-r from-[#9B87F5] to-[#9B87F5] text-white hover:from-[#7C3AED] hover:to-[#9333EA] border-0 shadow-md transition-all duration-200 rounded-lg"
//                           >
//                             {loadingOrderId === order.id ? (
//                               <Loader2 className="h-4 w-4 mr-1 animate-spin" />
//                             ) : (
//                               <ChevronDown className="h-4 w-4 mr-1" />
//                             )}
//                             Update Status
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent
//                           align="end"
//                           className="w-52 bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-xl ring-1 ring-gray-200/50"
//                         >
//                           <DropdownMenuLabel className="text-slate-700 font-semibold bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-xl py-3 px-4 text-sm">
//                             Change Status
//                           </DropdownMenuLabel>
//                           <DropdownMenuSeparator className="border-gray-200/60" />
//                           <div className="p-1">
//                             {order.status === "pending" ? (
//                               <div className="p-3 text-center text-gray-500 text-sm">
//                                 <Clock className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
//                                 Order is pending. Cannot update status at this
//                                 time.
//                               </div>
//                             ) : order.status === "delivered" ? (
//                               <div className="p-3 text-center text-gray-500 text-sm">
//                                 <CheckSquare className="w-5 h-5 mx-auto mb-2 text-green-500" />
//                                 Order has been delivered. No further status
//                                 updates available.
//                               </div>
//                             ) : (
//                               validStatuses
//                                 .filter((statusItem) =>
//                                   getAllowedStatuses(order.status).includes(
//                                     statusItem.value
//                                   )
//                                 )
//                                 .map((statusItem) => (
//                                   <DropdownMenuItem
//                                     key={statusItem.value}
//                                     onClick={() =>
//                                       handleUpdateStatus(
//                                         order.id,
//                                         statusItem.value as OrderStatus
//                                       )
//                                     }
//                                     disabled={loadingOrderId === order.id}
//                                     className={`cursor-pointer transition-all duration-200 rounded-lg mx-1 mb-1 p-3 flex items-center gap-2 ${getStatusHoverColor(
//                                       statusItem.value
//                                     )}`}
//                                   >
//                                     <span
//                                       className={`flex items-center justify-center w-6 h-6 rounded-full ${statusItem.color}`}
//                                     >
//                                       {statusItem.icon}
//                                     </span>
//                                     <span className="font-medium text-sm">
//                                       {statusItem.label}
//                                     </span>
//                                   </DropdownMenuItem>
//                                 ))
//                             )}
//                           </div>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={9} className="text-center py-12">
//                   <div className="flex flex-col items-center justify-center space-y-3">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//                       <svg
//                         className="w-8 h-8 text-gray-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={1.5}
//                           d="M9 5H7a2 2 0 00-2 2v1a2 2 0 001 1.732l1 .607a.75.75 0 00.75 0l1-.607A2 2 0 0010 8V7a2 2 0 00-2-2zM5.25 6H.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5zM0 10.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H.75a.75.75 0 01-.75-.75zM0 13.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H.75a.75.75 0 01-.75-.75z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-gray-500 font-medium">
//                         {hasActiveFilters
//                           ? "No orders match your filters"
//                           : "No orders found"}
//                       </p>
//                       <p className="text-sm text-gray-400 mt-1">
//                         {hasActiveFilters
//                           ? "Try adjusting your filter criteria"
//                           : "Try adjusting your search or filter criteria"}
//                       </p>
//                     </div>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       {renderPagination()}
//     </div>
//   );
// }



import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Add useLocation
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
import { OrderStatus, OrderStatusBadge } from "./OrderStatusBadge";
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
import {
  ChevronDown,
  Eye,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Clock,
  CheckCircle2,
  PackageOpen,
  Cog,
  ClipboardCheck,
  Truck,
  CheckSquare,
  XCircle,
} from "lucide-react";

interface OrdersTableViewProps {
  orders: Order[];
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onStatusUpdated?: () => void;
  pageSize?: number;
}

type SortField = "createdAt" | "finalTotal";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}

interface FilterConfig {
  paymentMethod: string[];
  paymentStatus: string[];
}

const validStatuses = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    value: "outForPickup",
    label: "Out for Pickup",
    color: "bg-orange-100 text-orange-800",
    icon: <PackageOpen className="w-4 h-4" />,
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-gray-200 text-gray-800",
    icon: <Cog className="w-4 h-4 animate-spin-slow" />,
  },
  {
    value: "ready",
    label: "Ready",
    color: "bg-cyan-100 text-cyan-800",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  {
    value: "outForDelivery",
    label: "Out for Delivery",
    color: "bg-indigo-100 text-indigo-800",
    icon: <Truck className="w-4 h-4" />,
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: <CheckSquare className="w-4 h-4" />,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-4 h-4" />,
  },
];

const paymentMethods = [
  { value: "cod", label: "Cash on Delivery" },
  { value: "online", label: "Online" },
];

const paymentStatuses = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

export function OrdersTableView({
  orders,
  pagination,
  onPageChange,
  onStatusUpdated,
  pageSize = 10,
}: OrdersTableViewProps) {
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation to get current route
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Check if the current route is the home URL
  const isHomePage = location.pathname === "/";

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
    if (currentStatus === "pending") {
      return [];
    }
    if (currentStatus === "delivered") {
      return [];
    }
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1) return [];
    const allowed: string[] = [];
    if (currentIndex < statusFlow.length - 1) {
      allowed.push(statusFlow[currentIndex + 1]);
    }
    if (["pending", "confirmed", "outForPickup"].includes(currentStatus)) {
      allowed.push("cancelled");
    }
    return allowed;
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: "asc",
  });

  const [filters, setFilters] = useState<FilterConfig>({
    paymentMethod: [],
    paymentStatus: [],
  });

  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleFilterChange = (
    filterType: keyof FilterConfig,
    value: string
  ) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterType];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prevFilters,
        [filterType]: updatedValues,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      paymentMethod: [],
      paymentStatus: [],
    });
  };

  const processedOrders = React.useMemo(() => {
    let processed = [...(orders || [])];
    if (filters.paymentMethod.length > 0) {
      processed = processed.filter((order) =>
        filters.paymentMethod.includes(order.paymentMethod || "")
      );
    }
    if (filters.paymentStatus.length > 0) {
      processed = processed.filter((order) =>
        filters.paymentStatus.includes(order.paymentStatus || "")
      );
    }
    if (sortConfig.field) {
      processed.sort((a, b) => {
        let aValue: number = 0;
        let bValue: number = 0;
        if (sortConfig.field === "createdAt") {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        } else if (sortConfig.field === "finalTotal") {
          aValue = a.finalTotal || 0;
          bValue = b.finalTotal || 0;
        }
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return processed;
  }, [orders, sortConfig, filters]);

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setLoadingOrderId(orderId);
      await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      toast.success(
        `Order status updated to ${
          validStatuses.find((s) => s.value === status)?.label
        }`
      );

          // await new Promise((res) => setTimeout(res, 1000));

      await dispatch(
        fetchOrders({ page: pagination?.page, limit: pagination?.limit })
      );
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const getStatusHoverColor = (status: string) => {
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

  const getStatusIconColor = (status: string) => {
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

  const hasActiveFilters =
    filters.paymentMethod.length > 0 || filters.paymentStatus.length > 0;

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
          results ({limit} per page)
        </div>

        <PaginationComponent className="mx-0 w-auto">
          <PaginationContent className="gap-1">
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
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {processedOrders.length} of {orders?.length || 0} orders shown
            </span>
            <div className="flex items-center gap-2 ml-4">
              {filters.paymentMethod.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Payment Method: {filters.paymentMethod.length}
                </span>
              )}
              {filters.paymentStatus.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Payment Status: {filters.paymentStatus.length}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            Clear Filters
          </Button>
        </div>
      )}

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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("createdAt")}
                  className="h-auto p-0 font-semibold text-gray-800 hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2"
                >
                  Order Date
                  {getSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("finalTotal")}
                  className="h-auto p-0 font-semibold text-gray-800 hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2"
                >
                  Total
                  {getSortIcon("finalTotal")}
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-auto p-0 font-semibold hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2 ${
                        filters.paymentMethod.length > 0
                          ? "text-[#9B87F5]"
                          : "text-gray-800"
                      }`}
                    >
                      Payment Method
                      <Filter
                        className={`h-3 w-3 ${
                          filters.paymentMethod.length > 0
                            ? "text-[#9B87F5]"
                            : "text-gray-500"
                        }`}
                      />
                      {filters.paymentMethod.length > 0 && (
                        <span className="bg-[#9B87F5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {filters.paymentMethod.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>
                      Filter by Payment Method
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {paymentMethods.map((method) => (
                      <DropdownMenuItem
                        key={method.value}
                        onClick={() =>
                          handleFilterChange("paymentMethod", method.value)
                        }
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.paymentMethod.includes(
                              method.value
                            )}
                            onChange={() => {}}
                            className="rounded border-gray-300"
                          />
                          <span>{method.label}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-auto p-0 font-semibold hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2 ${
                        filters.paymentStatus.length > 0
                          ? "text-[#9B87F5]"
                          : "text-gray-800"
                      }`}
                    >
                      Payment Status
                      <Filter
                        className={`h-3 w-3 ${
                          filters.paymentStatus.length > 0
                            ? "text-[#9B87F5]"
                            : "text-gray-500"
                        }`}
                      />
                      {filters.paymentStatus.length > 0 && (
                        <span className="bg-[#9B87F5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {filters.paymentStatus.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>
                      Filter by Payment Status
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {paymentStatuses.map((status) => (
                      <DropdownMenuItem
                        key={status.value}
                        onClick={() =>
                          handleFilterChange("paymentStatus", status.value)
                        }
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.paymentStatus.includes(
                              status.value
                            )}
                            onChange={() => {}}
                            className="rounded border-gray-300"
                          />
                          <span>{status.label}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Order Status
              </TableHead>
              {/* Conditionally render Actions column */}
              {!isHomePage && (
                <TableHead className="text-right font-semibold text-gray-800">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedOrders?.length > 0 ? (
              processedOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <TableCell className="font-medium text-gray-900">
                    <Link to={`order-details/${order.id}`}>
                    {order.orderId}
                    </Link>
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
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod === "online"
                        ? "Online"
                        : "N/A"}
                    </span>
                  </TableCell>
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
                  {/* Conditionally render Actions cell */}
                  {!isHomePage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
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
                              {order.status === "pending" ? (
                                <div className="p-3 text-center text-gray-500 text-sm">
                                  <Clock className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                                  Order is pending. Cannot update status at this
                                  time.
                                </div>
                              ) : order.status === "delivered" ? (
                                <div className="p-3 text-center text-gray-500 text-sm">
                                  <CheckSquare className="w-5 h-5 mx-auto mb-2 text-green-500" />
                                  Order has been delivered. No further status
                                  updates available.
                                </div>
                              ) : (
                                validStatuses
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
                                          statusItem.value as OrderStatus
                                        )
                                      }
                                      disabled={loadingOrderId === order.id}
                                      className={`cursor-pointer transition-all duration-200 rounded-lg mx-1 mb-1 p-3 flex items-center gap-2 ${getStatusHoverColor(
                                        statusItem.value
                                      )}`}
                                    >
                                      <span
                                        className={`flex items-center justify-center w-6 h-6 rounded-full ${statusItem.color}`}
                                      >
                                        {statusItem.icon}
                                      </span>
                                      <span className="font-medium text-sm">
                                        {statusItem.label}
                                      </span>
                                    </DropdownMenuItem>
                                  ))
                              )}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* Adjust colSpan based on whether Actions column is shown */}
                <TableCell colSpan={isHomePage ? 8 : 9} className="text-center py-12">
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
                        {hasActiveFilters
                          ? "No orders match your filters"
                          : "No orders found"}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {hasActiveFilters
                          ? "Try adjusting your filter criteria"
                          : "Try adjusting your search or filter criteria"}
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