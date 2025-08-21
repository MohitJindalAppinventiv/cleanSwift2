import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { toast } from "@/components/ui/sonner";
import { Customer } from "../../components/customers/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import axios from "axios";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomerTableProps {
  customers: Customer[];
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchData: (page: number, limit: number) => void;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

export const CustomersTable = ({
  customers,
  totalPages,
  page,
  setPage,
  fetchData,
  limit,
  setLimit,
}: CustomerTableProps) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    setDeleting(true);

    try {
      await axiosInstance.delete(`/deleteUser`, {
        params: { userId: selectedUserId },
      });
      toast.success("User deleted successfully");
      fetchData(page, limit);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
        console.error(error);
      } else {
        console.error(error);
        toast.error("Failed to delete user");
      }
    } finally {
      setDeleting(false);
      setDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchData(newPage, limit);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchData(newPage, limit);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    const limitValue = parseInt(newLimit, 10);
    setLimit(limitValue);
    setPage(1); // Reset to first page when changing limit
    fetchData(1, limitValue);
  };

  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, page - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const goToPage = (pageNum: number) => {
    setPage(pageNum);
    fetchData(pageNum, limit);
  };

  const goToFirstPage = () => {
    setPage(1);
    fetchData(1, limit);
  };

  const goToLastPage = () => {
    setPage(totalPages);
    fetchData(totalPages, limit);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-muted-foreground">Loading users...</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Phone Numbers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deleted By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-6"
                  >
                    No customers found.
                    <br />
                    You can search customers by <b>User ID</b>, <b>Name</b>, or{" "}
                    <b>Phone Number</b>.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell><Link to={`/customer-details/${customer.id}`}>{customer.readableUserId}</Link></TableCell>
                    <TableCell>{customer.fullName}</TableCell>
                    <TableCell>
                      {customer.phoneNumber}
                      {customer.alternateNumber
                        ? ` / ${customer.alternateNumber}`
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.isActive ? "default" : "destructive"}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.isActive ? "default" : "destructive"}
                      >
                        {customer.isActive
                          ? "NA"
                          : customer.deletedByAdmin
                          ? "Admin"
                          : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/customer-details/${customer.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteClick(customer.id)}
                        disabled={!customer.isActive}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Show pagination only if more pages exist and results are >= limit */}
          {customers.length > 0 &&
            totalPages > 1 &&
            customers.length >= limit && (
              <div className="flex justify-end mt-6">
                <PaginationComponent className="mx-0 w-auto">
                  <PaginationContent className="gap-1">
                    {/* Previous */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={handlePrevious}
                        className={`${
                          page === 1
                            ? "pointer-events-none opacity-50 bg-gray-100"
                            : "cursor-pointer bg-white hover:bg-[#9B87F5] hover:text-white transition-colors"
                        } border rounded-md px-3 py-2`}
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {getVisiblePages().map((pageNumber, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={page === pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`h-9 w-9 flex items-center justify-center border rounded-md text-sm transition-colors
                ${
                  page === pageNumber
                    ? "bg-[#9B87F5] text-white border-[#9B87F5]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-[#9B87F5] hover:text-white"
                }`}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Next */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handleNext()}
                        className={`${
                          page === totalPages || totalPages === 0
                            ? "pointer-events-none opacity-50 bg-gray-100"
                            : "cursor-pointer bg-white hover:bg-[#9B87F5] hover:text-white transition-colors"
                        } border rounded-md px-3 py-2`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </PaginationComponent>
              </div>
            )}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this user?</div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
