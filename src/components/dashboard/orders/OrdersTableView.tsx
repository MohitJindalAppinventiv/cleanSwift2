
import React from "react";
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
import { Order, serviceLabels, PaginationProps } from "./types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersTableViewProps {
  orders: Order[];
  pagination?: PaginationProps;
}

export function OrdersTableView({ orders, pagination }: OrdersTableViewProps) {
  const navigate = useNavigate();

  const handleViewDetails = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  // Calculate pagination values
  const renderPagination = () => {
    if (!pagination) return null;

    const { currentPage, pageSize, totalItems, onPageChange } = pagination;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // Don't render pagination if there's only one page
    if (totalPages <= 1) return null;

    // Generate page numbers to display
    const pageNumbers: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Complex logic for showing pages
      if (currentPage <= 3) {
        // Near the start
        pageNumbers.push(2, 3, 4, 'ellipsis');
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // Somewhere in the middle
        pageNumbers.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {pageNumbers.map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === 'ellipsis' ? (
                <div className="flex h-9 w-9 items-center justify-center">...</div>
              ) : (
                <PaginationLink
                  isActive={currentPage === pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Order At</TableHead>
            <TableHead>Pickup Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{serviceLabels[order.service]}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.pickupDate}</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
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
                      <DropdownMenuItem>Update status</DropdownMenuItem>
                      <DropdownMenuItem>Contact customer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {renderPagination()}
    </div>
  );
}
