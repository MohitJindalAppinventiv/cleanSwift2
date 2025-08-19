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
// import { OrderStatusBadge } from "./OrderStatusBadge";
// import {
//   Pagination as PaginationComponent,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { toast } from "sonner"; // or your toast hook
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import { useAppDispatch } from "@/hooks/redux";
// import { fetchOrders, updateOrderStatus } from "@/store/slices/orderSlice";

// interface OrdersTableViewProps {
//   orders: Order[];
//   pagination: Pagination | null;
//   onPageChange: (page: number) => void;
//   onStatusUpdated?: () => void; // optional callback to refresh list
// }

// const validStatuses = [
//   "pending",
//   "outForPickup",
//   "processing",
//   "ready",
//   "outForDelivery",
//   "delivered",
//   "completed",
//   "cancelled",
//   "confirmed"
// ];

// export function OrdersTableView({
//   orders,
//   pagination,
//   onPageChange,
//   onStatusUpdated,
// }: OrdersTableViewProps) {
//   const navigate = useNavigate();
//   const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

//   const dispatch=useAppDispatch();

//   const handleViewDetails = (orderId: string) => {
//     navigate(`/order-details/${orderId}`);
//   };



//   const handleUpdateStatus = async (orderId: string, status: string) => {
//   try {
//     await dispatch(updateOrderStatus({ orderId, status })).unwrap();
//     toast.success(`Order status updated to ${status}`);
//     await dispatch(fetchOrders({}))
//   } catch (error) {
//     toast.error("Failed to update status");
//   }
// };



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
//         pageNumbers.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1);
//       } else {
//         pageNumbers.push("ellipsis", page - 1, page, page + 1, "ellipsis");
//       }
//       pageNumbers.push(totalPages);
//     }

//     return (
//       <div className="flex items-center justify-between px-2">
//         <div className="flex-1 text-sm text-muted-foreground">
//           Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
//         </div>
//         <PaginationComponent className="mx-0 w-auto">
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 onClick={() => onPageChange(Math.max(1, page - 1))}
//                 className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
//               />
//             </PaginationItem>

//             {pageNumbers.map((pageNumber, index) => (
//               <PaginationItem key={index}>
//                 {pageNumber === "ellipsis" ? (
//                   <div className="flex h-9 w-9 items-center justify-center">...</div>
//                 ) : (
//                   <PaginationLink
//                     isActive={page === pageNumber}
//                     onClick={() => onPageChange(pageNumber as number)}
//                     className="cursor-pointer"
//                   >
//                     {pageNumber}
//                   </PaginationLink>
//                 )}
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//                 className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </PaginationComponent>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-4">
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Order ID</TableHead>
//               <TableHead>Customer</TableHead>
//               <TableHead>Address</TableHead>
//               <TableHead>Order Date</TableHead>
//               <TableHead>Total</TableHead>
//               <TableHead>Payment Method</TableHead>
//               <TableHead>Payment Status</TableHead>
//               <TableHead>Order Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orders?.length > 0 ? (
//               orders.map((order) => (
//                 <TableRow key={order.id}>
//                   <TableCell className="font-medium">{order.orderId}</TableCell>
//                   <TableCell>{order.customerName}</TableCell>
//                   <TableCell>
//                     <div className="max-w-[200px] truncate">
//                       {order.addressDetails?.addressLabel || "N/A"}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>${order.finalTotal?.toFixed(2) || "0.00"}</TableCell>
//                   <TableCell>
//                     <span className="capitalize">
//                       {order.paymentMethod?.replace("_", " ") || "N/A"}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <span
//                       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         order.paymentStatus === "paid"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {order.paymentStatus || "Pending"}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <OrderStatusBadge status={order.status} />
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="sm">
//                           Actions
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
//                           View details
//                         </DropdownMenuItem>
//                         <DropdownMenuLabel className="pt-2">Update Status</DropdownMenuLabel>
//                         {validStatuses.map((status) => (
//                           <DropdownMenuItem
//                             key={status}
//                             onClick={() => handleUpdateStatus(order.id, status)}
//                             disabled={loadingOrderId === order.id}
//                           >
//                             {status}
//                           </DropdownMenuItem>
//                         ))}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={9} className="text-center py-8">
//                   <div className="flex flex-col items-center justify-center space-y-2">
//                     <p className="text-muted-foreground">No orders found</p>
//                     <p className="text-sm text-muted-foreground">
//                       Try adjusting your search or filter criteria
//                     </p>
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
// import { OrderStatusBadge } from "./OrderStatusBadge";
// import {
//   Pagination as PaginationComponent,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { toast } from "sonner";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import { useAppDispatch } from "@/hooks/redux";
// import { fetchOrders, updateOrderStatus } from "@/store/slices/orderSlice";
// import { ChevronDown, Eye, Loader2 } from "lucide-react";

// interface OrdersTableViewProps {
//   orders: Order[];
//   pagination: Pagination | null;
//   onPageChange: (page: number) => void;
//   onStatusUpdated?: () => void;
// }

// const validStatuses = [
//   { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
//   { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
//   { value: "outForPickup", label: "Out for Pickup", color: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
//   { value: "processing", label: "Processing", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
//   { value: "ready", label: "Ready", color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200" },
//   { value: "outForDelivery", label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" },
//   { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800 hover:bg-green-200" },
//   { value: "completed", label: "Completed", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" },
//   { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800 hover:bg-red-200" }
// ];

// export function OrdersTableView({
//   orders,
//   pagination,
//   onPageChange,
//   onStatusUpdated,
// }: OrdersTableViewProps) {
//   const navigate = useNavigate();
//   const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
//   const dispatch = useAppDispatch();

//   const handleViewDetails = (orderId: string) => {
//     navigate(`/order-details/${orderId}`);
//   };

//   const handleUpdateStatus = async (orderId: string, status: string) => {
//     try {
//       setLoadingOrderId(orderId);
//       await dispatch(updateOrderStatus({ orderId, status })).unwrap();
//       toast.success(`Order status updated to ${validStatuses.find(s => s.value === status)?.label}`);
//       await dispatch(fetchOrders({}));
//     } catch (error) {
//       toast.error("Failed to update status");
//     } finally {
//       setLoadingOrderId(null);
//     }
//   };

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
//         pageNumbers.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1);
//       } else {
//         pageNumbers.push("ellipsis", page - 1, page, page + 1, "ellipsis");
//       }
//       pageNumbers.push(totalPages);
//     }

//     return (
//       <div className="flex flex-col items-center justify-center space-y-4 py-6">
//         <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border">
//           Showing <span className="font-semibold text-purple-600">{(page - 1) * limit + 1}</span> to{" "}
//           <span className="font-semibold text-purple-600">{Math.min(page * limit, total)}</span> of{" "}
//           <span className="font-semibold text-purple-600">{total}</span> results
//         </div>
        
//         <PaginationComponent className="mx-0 w-auto">
//           <PaginationContent className="gap-1">
//             <PaginationItem>
//               <PaginationPrevious
//                 onClick={() => onPageChange(Math.max(1, page - 1))}
//                 className={`
//                   ${page === 1 
//                     ? "pointer-events-none opacity-50 bg-gray-100" 
//                     : "cursor-pointer bg-white hover:bg-purple-50 hover:text-purple-700 border-purple-200 transition-all duration-200"
//                   }
//                   border shadow-sm
//                 `}
//               />
//             </PaginationItem>

//             {pageNumbers.map((pageNumber, index) => (
//               <PaginationItem key={index}>
//                 {pageNumber === "ellipsis" ? (
//                   <div className="flex h-10 w-10 items-center justify-center text-purple-400 font-medium">
//                     ...
//                   </div>
//                 ) : (
//                   <PaginationLink
//                     isActive={page === pageNumber}
//                     onClick={() => onPageChange(pageNumber as number)}
//                     className={`
//                       cursor-pointer h-10 w-10 border shadow-sm transition-all duration-200
//                       ${page === pageNumber
//                         ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-600 shadow-purple-200"
//                         : "bg-white hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 text-gray-700 border-gray-200"
//                       }
//                     `}
//                   >
//                     {pageNumber}
//                   </PaginationLink>
//                 )}
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//                 className={`
//                   ${page === totalPages
//                     ? "pointer-events-none opacity-50 bg-gray-100"
//                     : "cursor-pointer bg-white hover:bg-purple-50 hover:text-purple-700 border-purple-200 transition-all duration-200"
//                   }
//                   border shadow-sm
//                 `}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </PaginationComponent>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150">
//               <TableHead className="font-semibold text-purple-900">Order ID</TableHead>
//               <TableHead className="font-semibold text-purple-900">Customer</TableHead>
//               <TableHead className="font-semibold text-purple-900">Address</TableHead>
//               <TableHead className="font-semibold text-purple-900">Order Date</TableHead>
//               <TableHead className="font-semibold text-purple-900">Total</TableHead>
//               <TableHead className="font-semibold text-purple-900">Payment Method</TableHead>
//               <TableHead className="font-semibold text-purple-900">Payment Status</TableHead>
//               <TableHead className="font-semibold text-purple-900">Order Status</TableHead>
//               <TableHead className="text-right font-semibold text-purple-900">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orders?.length > 0 ? (
//               orders.map((order, index) => (
//                 <TableRow 
//                   key={order.id} 
//                   className={`
//                     hover:bg-purple-50 transition-colors duration-150
//                     ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                   `}
//                 >
//                   <TableCell className="font-medium text-gray-900">{order.orderId}</TableCell>
//                   <TableCell className="text-gray-700">{order.customerName}</TableCell>
//                   <TableCell>
//                     <div className="max-w-[200px] truncate text-gray-600">
//                       {order.addressDetails?.addressLabel || "N/A"}
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
//                       {order.paymentMethod?.replace("_", " ") || "N/A"}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <span
//                       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
//                         order.paymentStatus === "paid"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {order.paymentStatus || "Pending"}
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
//                         className="bg-white hover:bg-purple-50 hover:border-purple-300 border-gray-200 text-gray-700 hover:text-purple-700 transition-all duration-200"
//                       >
//                         <Eye className="h-4 w-4 mr-1" />
//                         View
//                       </Button>

//                       {/* Status Update Dropdown */}
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={loadingOrderId === order.id}
//                             className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-600 hover:border-purple-700 transition-all duration-200 shadow-sm"
//                           >
//                             {loadingOrderId === order.id ? (
//                               <Loader2 className="h-4 w-4 mr-1 animate-spin" />
//                             ) : (
//                               <ChevronDown className="h-4 w-4 mr-1" />
//                             )}
//                             Update Status
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg rounded-lg">
//                           <DropdownMenuLabel className="text-purple-900 font-semibold bg-purple-50">
//                             Change Status
//                           </DropdownMenuLabel>
//                           <DropdownMenuSeparator />
//                           <div className="max-h-64 overflow-y-auto">
//                             {validStatuses.map((statusItem) => (
//                               <DropdownMenuItem
//                                 key={statusItem.value}
//                                 onClick={() => handleUpdateStatus(order.id, statusItem.value)}
//                                 disabled={loadingOrderId === order.id || order.status === statusItem.value}
//                                 className={`
//                                   cursor-pointer transition-all duration-150 mx-1 my-0.5 rounded
//                                   ${order.status === statusItem.value 
//                                     ? "bg-purple-100 text-purple-800 opacity-60 cursor-not-allowed" 
//                                     : `${statusItem.color} cursor-pointer`
//                                   }
//                                 `}
//                               >
//                                 <div className="flex items-center justify-between w-full">
//                                   <span className="font-medium">{statusItem.label}</span>
//                                   {order.status === statusItem.value && (
//                                     <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
//                                       Current
//                                     </span>
//                                   )}
//                                 </div>
//                               </DropdownMenuItem>
//                             ))}
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
//                     <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
//                       <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v1a2 2 0 001 1.732l1 .607a.75.75 0 00.75 0l1-.607A2 2 0 0010 8V7a2 2 0 00-2-2zM5.25 6H.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5zM0 10.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H.75a.75.75 0 01-.75-.75zM0 13.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H.75a.75.75 0 01-.75-.75z" />
//                       </svg>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-gray-500 font-medium">No orders found</p>
//                       <p className="text-sm text-gray-400 mt-1">
//                         Try adjusting your search or filter criteria
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
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "outForPickup", label: "Out for Pickup", color: "bg-orange-100 text-orange-800" },
  { value: "processing", label: "Processing", color: "bg-gray-200 text-gray-800" },
  { value: "ready", label: "Ready", color: "bg-cyan-100 text-cyan-800" },
  { value: "outForDelivery", label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "completed", label: "Completed", color: "bg-emerald-100 text-emerald-800" },
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

  const handleViewDetails = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  }; 

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setLoadingOrderId(orderId);
      await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      toast.success(
        `Order status updated to ${validStatuses.find((s) => s.value === status)?.label}`
      );
      await dispatch(fetchOrders({}));
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoadingOrderId(null);
    }
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
        pageNumbers.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pageNumbers.push("ellipsis", page - 1, page, page + 1, "ellipsis");
      }
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-6">
        <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-md border">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {(page - 1) * limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-800">
            {Math.min(page * limit, total)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{total}</span> results
        </div>

        <PaginationComponent className="mx-0 w-auto">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={`${
                  page === 1
                    ? "pointer-events-none opacity-50 bg-gray-100"
                    : "cursor-pointer bg-white hover:bg-gray-100 transition-colors"
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
                          ? "bg-gray-800 text-white border-gray-800"
                          : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
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
                    : "cursor-pointer bg-white hover:bg-gray-100 transition-colors"
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
              <TableHead className="font-semibold text-gray-800">Order ID</TableHead>
              <TableHead className="font-semibold text-gray-800">Customer</TableHead>
              <TableHead className="font-semibold text-gray-800">Address</TableHead>
              <TableHead className="font-semibold text-gray-800">Order Date</TableHead>
              <TableHead className="font-semibold text-gray-800">Total</TableHead>
              <TableHead className="font-semibold text-gray-800">Payment Method</TableHead>
              <TableHead className="font-semibold text-gray-800">Payment Status</TableHead>
              <TableHead className="font-semibold text-gray-800">Order Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-800">Actions</TableHead>
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
                  <TableCell className="font-medium text-gray-900">{order.orderId}</TableCell>
                  <TableCell className="text-gray-700">{order.customerName}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-gray-600">
                      {order.addressDetails?.addressLabel || "N/A"}
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
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus || "Pending"}
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

                      {/* Status Update Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loadingOrderId === order.id}
                            className="bg-[#9B87F5] text-white hover:bg-[#9B87F5] border-[#9B87F5] transition-all"
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
                          className="w-48 bg-white border shadow-lg rounded-md max-h-64 overflow-y-auto scroll-smooth"
                        >
                          <DropdownMenuLabel className="text-[#9B87F5] font-semibold bg-gray-50">
                            Change Status
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="max-h-60 overflow-y-auto scroll-smooth">
                            {validStatuses.map((statusItem) => (
                              <DropdownMenuItem
                                key={statusItem.value}
                                onClick={() => handleUpdateStatus(order.id, statusItem.value)}
                                disabled={
                                  loadingOrderId === order.id ||
                                  order.status === statusItem.value
                                }
                                className={`cursor-pointer transition-colors rounded ${
                                  order.status === statusItem.value
                                    ? "bg-gray-100 text-gray-600 opacity-60 cursor-not-allowed"
                                    : `${statusItem.color} hover:opacity-80`
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium">{statusItem.label}</span>
                                  {order.status === statusItem.value && (
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                      Current
                                    </span>
                                  )}
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
                      <p className="text-gray-500 font-medium">No orders found</p>
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
