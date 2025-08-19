
// // // // import React from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import {
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableHead,
// // // //   TableHeader,
// // // //   TableRow,
// // // // } from "@/components/ui/table";
// // // // import {
// // // //   DropdownMenu,
// // // //   DropdownMenuContent,
// // // //   DropdownMenuItem,
// // // //   DropdownMenuLabel,
// // // //   DropdownMenuSeparator,
// // // //   DropdownMenuTrigger,
// // // // } from "@/components/ui/dropdown-menu";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Order, serviceLabels, PaginationProps } from "./types";
// // // // import { OrderStatusBadge } from "./OrderStatusBadge";
// // // // import {
// // // //   Pagination,
// // // //   PaginationContent,
// // // //   PaginationItem,
// // // //   PaginationLink,
// // // //   PaginationNext,
// // // //   PaginationPrevious,
// // // // } from "@/components/ui/pagination";
// // // // import { ChevronLeft, ChevronRight } from "lucide-react";

// // // // interface OrdersTableViewProps {
// // // //   orders: Order[];
// // // //   pagination?: PaginationProps;
// // // // }

// // // // export function OrdersTableView({ orders, pagination }: OrdersTableViewProps) {
// // // //   const navigate = useNavigate();

// // // //   const handleViewDetails = (orderId: string) => {
// // // //     navigate(`/order-details/${orderId}`);
// // // //   };

// // // //   // Calculate pagination values
// // // //   const renderPagination = () => {
// // // //     if (!pagination) return null;

// // // //     const { currentPage, pageSize, totalItems, onPageChange } = pagination;
// // // //     const totalPages = Math.ceil(totalItems / pageSize);
    
// // // //     // Don't render pagination if there's only one page
// // // //     if (totalPages <= 1) return null;

// // // //     // Generate page numbers to display
// // // //     const pageNumbers: (number | 'ellipsis')[] = [];
    
// // // //     if (totalPages <= 7) {
// // // //       // If 7 or fewer pages, show all
// // // //       for (let i = 1; i <= totalPages; i++) {
// // // //         pageNumbers.push(i);
// // // //       }
// // // //     } else {
// // // //       // Always show first page
// // // //       pageNumbers.push(1);
      
// // // //       // Complex logic for showing pages
// // // //       if (currentPage <= 3) {
// // // //         // Near the start
// // // //         pageNumbers.push(2, 3, 4, 'ellipsis');
// // // //       } else if (currentPage >= totalPages - 2) {
// // // //         // Near the end
// // // //         pageNumbers.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1);
// // // //       } else {
// // // //         // Somewhere in the middle
// // // //         pageNumbers.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis');
// // // //       }
      
// // // //       // Always show last page
// // // //       pageNumbers.push(totalPages);
// // // //     }

// // // //     return (
// // // //       <Pagination className="mt-4">
// // // //         <PaginationContent>
// // // //           <PaginationItem>
// // // //             <PaginationPrevious 
// // // //               onClick={() => onPageChange(Math.max(1, currentPage - 1))}
// // // //               className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
// // // //             />
// // // //           </PaginationItem>
          
// // // //           {pageNumbers.map((pageNumber, index) => (
// // // //             <PaginationItem key={index}>
// // // //               {pageNumber === 'ellipsis' ? (
// // // //                 <div className="flex h-9 w-9 items-center justify-center">...</div>
// // // //               ) : (
// // // //                 <PaginationLink
// // // //                   isActive={currentPage === pageNumber}
// // // //                   onClick={() => onPageChange(pageNumber)}
// // // //                 >
// // // //                   {pageNumber}
// // // //                 </PaginationLink>
// // // //               )}
// // // //             </PaginationItem>
// // // //           ))}
          
// // // //           <PaginationItem>
// // // //             <PaginationNext
// // // //               onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
// // // //               className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
// // // //             />
// // // //           </PaginationItem>
// // // //         </PaginationContent>
// // // //       </Pagination>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <Table>
// // // //         <TableHeader>
// // // //           <TableRow>
// // // //             <TableHead>Order ID</TableHead>
// // // //             <TableHead>Customer</TableHead>
// // // //             <TableHead>Service</TableHead>
// // // //             <TableHead>Order At</TableHead>
// // // //             <TableHead>Pickup Date</TableHead>
// // // //             <TableHead>Delivery Date</TableHead>
// // // //             <TableHead>Total</TableHead>
// // // //             <TableHead>Status</TableHead>
// // // //             <TableHead className="text-right">Actions</TableHead>
// // // //           </TableRow>
// // // //         </TableHeader>
// // // //         <TableBody>
// // // //           {orders.length > 0 ? (
// // // //             orders.map((order) => (
// // // //               <TableRow key={order.id}>
// // // //                 <TableCell className="font-medium">{order.id}</TableCell>
// // // //                 <TableCell>{order.customer}</TableCell>
// // // //                 <TableCell>{serviceLabels[order.service]}</TableCell>
// // // //                 <TableCell>{order.date}</TableCell>
// // // //                 <TableCell>{order.pickupDate}</TableCell>
// // // //                 <TableCell>{order.deliveryDate}</TableCell>
// // // //                 <TableCell>${order?.total?.toFixed(2)}</TableCell>
// // // //                 <TableCell>
// // // //                   <OrderStatusBadge status={order.status} />
// // // //                 </TableCell>
// // // //                 <TableCell className="text-right">
// // // //                   <DropdownMenu>
// // // //                     <DropdownMenuTrigger asChild>
// // // //                       <Button variant="ghost" size="sm">
// // // //                         Actions
// // // //                       </Button>
// // // //                     </DropdownMenuTrigger>
// // // //                     <DropdownMenuContent align="end">
// // // //                       <DropdownMenuLabel>Actions</DropdownMenuLabel>
// // // //                       <DropdownMenuSeparator />
// // // //                       <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
// // // //                         View details
// // // //                       </DropdownMenuItem>
// // // //                       <DropdownMenuItem>Update status</DropdownMenuItem>
// // // //                       <DropdownMenuItem>Contact customer</DropdownMenuItem>
// // // //                     </DropdownMenuContent>
// // // //                   </DropdownMenu>
// // // //                 </TableCell>
// // // //               </TableRow>
// // // //             ))
// // // //           ) : (
// // // //             <TableRow>
// // // //               <TableCell colSpan={9} className="text-center py-8">
// // // //                 No orders found
// // // //               </TableCell>
// // // //             </TableRow>
// // // //           )}
// // // //         </TableBody>
// // // //       </Table>
// // // //       {renderPagination()}
// // // //     </div>
// // // //   );
// // // // }



// // // import React from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import {
// // //   DropdownMenu,
// // //   DropdownMenuContent,
// // //   DropdownMenuItem,
// // //   DropdownMenuLabel,
// // //   DropdownMenuSeparator,
// // //   DropdownMenuTrigger,
// // // } from "@/components/ui/dropdown-menu";
// // // import { Button } from "@/components/ui/button";
// // // import { Order, PaginationProps } from "./types";
// // // import { OrderStatusBadge } from "./OrderStatusBadge";
// // // import {
// // //   Pagination,
// // //   PaginationContent,
// // //   PaginationItem,
// // //   PaginationLink,
// // //   PaginationNext,
// // //   PaginationPrevious,
// // // } from "@/components/ui/pagination";

// // // interface OrdersTableViewProps {
// // //   orders: Order[];
// // //   pagination?: PaginationProps;
// // // }

// // // export function OrdersTableView({ orders, pagination }: OrdersTableViewProps) {
// // //   const navigate = useNavigate();

// // //   const handleViewDetails = (orderId: string) => {
// // //     navigate(`/order-details/${orderId}`);
// // //   };

// // //   const renderPagination = () => {
// // //     if (!pagination) return null;

// // //     const { currentPage, pageSize, totalItems, onPageChange } = pagination;
// // //     const totalPages = Math.ceil(totalItems / pageSize);
    
// // //     if (totalPages <= 1) return null;

// // //     const pageNumbers: (number | 'ellipsis')[] = [];
    
// // //     if (totalPages <= 7) {
// // //       for (let i = 1; i <= totalPages; i++) {
// // //         pageNumbers.push(i);
// // //       }
// // //     } else {
// // //       pageNumbers.push(1);
      
// // //       if (currentPage <= 3) {
// // //         pageNumbers.push(2, 3, 4, 'ellipsis');
// // //       } else if (currentPage >= totalPages - 2) {
// // //         pageNumbers.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1);
// // //       } else {
// // //         pageNumbers.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis');
// // //       }
      
// // //       pageNumbers.push(totalPages);
// // //     }

// // //     return (
// // //       <Pagination className="mt-4">
// // //         <PaginationContent>
// // //           <PaginationItem>
// // //             <PaginationPrevious 
// // //               onClick={() => onPageChange(Math.max(1, currentPage - 1))}
// // //               className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
// // //             />
// // //           </PaginationItem>
          
// // //           {pageNumbers.map((pageNumber, index) => (
// // //             <PaginationItem key={index}>
// // //               {pageNumber === 'ellipsis' ? (
// // //                 <div className="flex h-9 w-9 items-center justify-center">...</div>
// // //               ) : (
// // //                 <PaginationLink
// // //                   isActive={currentPage === pageNumber}
// // //                   onClick={() => onPageChange(pageNumber)}
// // //                 >
// // //                   {pageNumber}
// // //                 </PaginationLink>
// // //               )}
// // //             </PaginationItem>
// // //           ))}
          
// // //           <PaginationItem>
// // //             <PaginationNext
// // //               onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
// // //               className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
// // //             />
// // //           </PaginationItem>
// // //         </PaginationContent>
// // //       </Pagination>
// // //     );
// // //   };

// // //   return (
// // //     <div>
// // //       <Table>
// // //         <TableHeader>
// // //           <TableRow>
// // //             <TableHead>Order ID</TableHead>
// // //             <TableHead>Customer</TableHead>
// // //             <TableHead>Order Date</TableHead>
// // //             <TableHead>Pickup Date</TableHead>
// // //             <TableHead>Delivery Date</TableHead>
// // //             <TableHead>Total</TableHead>
// // //             <TableHead>Status</TableHead>
// // //             <TableHead className="text-right">Actions</TableHead>
// // //           </TableRow>
// // //         </TableHeader>
// // //         <TableBody>
// // //           {orders.length > 0 ? (
// // //             orders.map((order) => (
// // //               <TableRow key={order.id}>
// // //                 <TableCell className="font-medium">{order.orderId || order.id}</TableCell>
// // //                 <TableCell>{order.customerName || order.customer}</TableCell>
// // //                 <TableCell>
// // //                   {new Date(order.createdAt || order.date).toLocaleDateString()}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   {order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : '-'}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-'}
// // //                 </TableCell>
// // //                 <TableCell>${order.finalTotal || order.total?.toFixed(2)}</TableCell>
// // //                 <TableCell>
// // //                   <OrderStatusBadge status={order.status} />
// // //                 </TableCell>
// // //                 <TableCell className="text-right">
// // //                   <DropdownMenu>
// // //                     <DropdownMenuTrigger asChild>
// // //                       <Button variant="ghost" size="sm">
// // //                         Actions
// // //                       </Button>
// // //                     </DropdownMenuTrigger>
// // //                     <DropdownMenuContent align="end">
// // //                       <DropdownMenuLabel>Actions</DropdownMenuLabel>
// // //                       <DropdownMenuSeparator />
// // //                       <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
// // //                         View details
// // //                       </DropdownMenuItem>
// // //                       <DropdownMenuItem>Update status</DropdownMenuItem>
// // //                       <DropdownMenuItem>Contact customer</DropdownMenuItem>
// // //                     </DropdownMenuContent>
// // //                   </DropdownMenu>
// // //                 </TableCell>
// // //               </TableRow>
// // //             ))
// // //           ) : (
// // //             <TableRow>
// // //               <TableCell colSpan={8} className="text-center py-8">
// // //                 No orders found
// // //               </TableCell>
// // //             </TableRow>
// // //           )}
// // //         </TableBody>
// // //       </Table>
// // //       {renderPagination()}
// // //     </div>
// // //   );
// // // }


// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { Button } from "@/components/ui/button";
// // import { Order, Pagination as PaginationProps } from "./types";
// // import { OrderStatusBadge } from "./OrderStatusBadge";
// // import {
// //   Pagination,
// //   PaginationContent,
// //   PaginationItem,
// //   PaginationLink,
// //   PaginationNext,
// //   PaginationPrevious,
// // } from "@/components/ui/pagination";

// // interface OrdersTableViewProps {
// //   orders: Order[];
// //   pagination?: PaginationProps;
// //   onPageChange:(page:number)=>void;
// // }


// // export function OrdersTableView({ orders, pagination }: OrdersTableViewProps) {
// //   const navigate = useNavigate();

// //   const handleViewDetails = (orderId: string) => {
// //     navigate(`/order-details/${orderId}`);
// //   };

// //   const onPageChange=(num:number)=>{

// //   }

// //   const renderPagination = () => {
// //     if (!pagination) return null;

// //     const { page, limit, total,totalPages  } = pagination;
    
// //     if (totalPages <= 1) return null;

// //     const pageNumbers: (number | 'ellipsis')[] = [];
    
// //     if (totalPages <= 7) {
// //       for (let i = 1; i <= totalPages; i++) {
// //         pageNumbers.push(i);
// //       }
// //     } else {
// //       pageNumbers.push(1);
      
// //       if (page <= 3) {
// //         pageNumbers.push(2, 3, 4, 'ellipsis');
// //       } else if (page >= totalPages - 2) {
// //         pageNumbers.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1);
// //       } else {
// //         pageNumbers.push('ellipsis', page - 1, page, page + 1, 'ellipsis');
// //       }
      
// //       pageNumbers.push(totalPages);
// //     }

// //     return (
// //       <Pagination className="mt-4">
// //         <PaginationContent>
// //           <PaginationItem>
// //             <PaginationPrevious 
// //               onClick={() => onPageChange(Math.max(1, page - 1))}
// //               className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
// //             />
// //           </PaginationItem>
          
// //           {pageNumbers.map((pageNumber, index) => (
// //             <PaginationItem key={index}>
// //               {pageNumber === 'ellipsis' ? (
// //                 <div className="flex h-9 w-9 items-center justify-center">...</div>
// //               ) : (
// //                 <PaginationLink
// //                   isActive={page === pageNumber}
// //                   onClick={() => onPageChange(pageNumber)}
// //                 >
// //                   {pageNumber}
// //                 </PaginationLink>
// //               )}
// //             </PaginationItem>
// //           ))}
          
// //           <PaginationItem>
// //             <PaginationNext
// //               onClick={() => onPageChange(Math.min(totalPages, page + 1))}
// //               className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
// //             />
// //           </PaginationItem>
// //         </PaginationContent>
// //       </Pagination>
// //     );
// //   };

// //   return (
// //     <div>
// //       <Table>
// //         <TableHeader>
// //           <TableRow>
// //             <TableHead>Order ID</TableHead>
// //             <TableHead>Customer</TableHead>
// //             <TableHead>Address</TableHead>
// //             <TableHead>Order Date</TableHead>
// //             <TableHead>Total</TableHead>
// //             <TableHead>Payment Method</TableHead>
// //             <TableHead>Payment Status</TableHead>
// //             <TableHead>Order Status</TableHead>
// //             <TableHead className="text-right">Actions</TableHead>
// //           </TableRow>
// //         </TableHeader>
// //         <TableBody>
// //           {orders.length > 0 ? (
// //             orders.map((order) => (
// //               <TableRow key={order.id}>
// //                 <TableCell className="font-medium">{order.orderId}</TableCell>
// //                 <TableCell>{order.customerName}</TableCell>
// //                 <TableCell>{order.addressDetails.addressLabel}</TableCell>
// //                 <TableCell>
// //                   {new Date(order.createdAt).toLocaleDateString()}
// //                 </TableCell>
// //                 <TableCell>${order.finalTotal.toFixed(2)}</TableCell>
// //                 <TableCell>{order.paymentMethod}</TableCell>
// //                 <TableCell>{order.paymentStatus}</TableCell>
// //                 <TableCell>
// //                   <OrderStatusBadge status={order.status} />
// //                 </TableCell>
// //                 <TableCell className="text-right">
// //                   <DropdownMenu>
// //                     <DropdownMenuTrigger asChild>
// //                       <Button variant="ghost" size="sm">
// //                         Actions
// //                       </Button>
// //                     </DropdownMenuTrigger>
// //                     <DropdownMenuContent align="end">
// //                       <DropdownMenuLabel>Actions</DropdownMenuLabel>
// //                       <DropdownMenuSeparator />
// //                       <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
// //                         View details
// //                       </DropdownMenuItem>
// //                       <DropdownMenuItem>Update status</DropdownMenuItem>
// //                       <DropdownMenuItem>Contact customer</DropdownMenuItem>
// //                     </DropdownMenuContent>
// //                   </DropdownMenu>
// //                 </TableCell>
// //               </TableRow>
// //             ))
// //           ) : (
// //             <TableRow>
// //               <TableCell colSpan={9} className="text-center py-8">
// //                 No orders found
// //               </TableCell>
// //             </TableRow>
// //           )}
// //         </TableBody>
// //       </Table>
// //       {renderPagination()}
// //     </div>
// //   );
// // }


// import React from "react";
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

// interface OrdersTableViewProps {
//   orders: Order[];
//   pagination: Pagination | null;
//   onPageChange: (page: number) => void;
// }

// export function OrdersTableView({ orders, pagination, onPageChange }: OrdersTableViewProps) {
//   const navigate = useNavigate();

//   const handleViewDetails = (orderId: string) => {
//     navigate(`/order-details/${orderId}`);
//   };

//   const renderPagination = () => {
//     if (!pagination) return null;

//     const { page, limit, total, totalPages } = pagination;
    
//     if (totalPages <= 1) return null;

//     const pageNumbers: (number | 'ellipsis')[] = [];
    
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       pageNumbers.push(1);
      
//       if (page <= 3) {
//         pageNumbers.push(2, 3, 4, 'ellipsis');
//       } else if (page >= totalPages - 2) {
//         pageNumbers.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1);
//       } else {
//         pageNumbers.push('ellipsis', page - 1, page, page + 1, 'ellipsis');
//       }
      
//       pageNumbers.push(totalPages);
//     }

//     return (
//       <div className="flex items-center justify-between px-2">
//         <div className="flex-1 text-sm text-muted-foreground">
//           Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
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
//                 {pageNumber === 'ellipsis' ? (
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
//               orders?.map((order) => (
//                 <TableRow key={order.id}>
//                   <TableCell className="font-medium">{order.orderId}</TableCell>
//                   <TableCell>{order.customerName}</TableCell>
//                   <TableCell>
//                     <div className="max-w-[200px] truncate">
//                       {order.addressDetails?.addressLabel || 'N/A'}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>${order.finalTotal?.toFixed(2) || '0.00'}</TableCell>
//                   <TableCell>
//                     <span className="capitalize">
//                       {order.paymentMethod?.replace('_', ' ') || 'N/A'}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <span 
//                       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         order.paymentStatus === 'paid' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}
//                     >
//                       {order.paymentStatus || 'Pending'}
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
//                         <DropdownMenuItem>Update status</DropdownMenuItem>
//                         <DropdownMenuItem>Contact customer</DropdownMenuItem>
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


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { toast } from "sonner"; // or your toast hook
import { axiosInstance } from "@/api/axios/axiosInstance";

interface OrdersTableViewProps {
  orders: Order[];
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onStatusUpdated?: () => void; // optional callback to refresh list
}

const validStatuses = [
  "pending",
  "outForPickup",
  "processing",
  "ready",
  "outForDelivery",
  "delivered",
  "completed",
  "cancelled",
];

export function OrdersTableView({
  orders,
  pagination,
  onPageChange,
  onStatusUpdated,
}: OrdersTableViewProps) {
  const navigate = useNavigate();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const handleViewDetails = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setLoadingOrderId(orderId);
      await axiosInstance.post(`/updateOrderStatus`, { orderId,status });
      toast.success(`Order status updated to ${status}`);
      if (onStatusUpdated) onStatusUpdated(); // trigger refresh if provided
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
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
        </div>
        <PaginationComponent className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {pageNumbers.map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === "ellipsis" ? (
                  <div className="flex h-9 w-9 items-center justify-center">...</div>
                ) : (
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => onPageChange(pageNumber as number)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationComponent>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {order.addressDetails?.addressLabel || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.finalTotal?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {order.paymentMethod?.replace("_", " ") || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuLabel className="pt-2">Update Status</DropdownMenuLabel>
                        {validStatuses.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleUpdateStatus(order.id, status)}
                            disabled={loadingOrderId === order.id}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground">No orders found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
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
