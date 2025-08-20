import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductsPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalProducts: number;
}

export function ProductsPagination({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalProducts,
}: ProductsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const pageSizes = [5, 10, 15, 20, 25, 30];

  // Generate page numbers to display (show up to 5 pages around the current page)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  console.log("Rendering ProductsPagination:", { currentPage, pageSize, totalProducts, totalPages });

  return (
    <div className="flex items-center justify-between mt-6 mb-4 border border-gray-200 p-4 rounded-md">
      <div className="text-sm text-muted-foreground">
        Showing {totalProducts > 0 ? Math.min((currentPage - 1) * pageSize + 1, totalProducts) : 0} to{" "}
        {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
      </div>
      <div className="flex items-center space-x-4">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            console.log("Changing pageSize to:", value);
            setPageSize(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            {pageSizes.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  console.log("Navigating to previous page:", currentPage - 1);
                  setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {getPageNumbers().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => {
                    console.log("Navigating to page:", page);
                    setCurrentPage(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  console.log("Navigating to next page:", currentPage + 1);
                  setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}