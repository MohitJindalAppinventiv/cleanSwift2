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
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
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
  fetchData: (page: number, limit: number, resetPage?: boolean) => void;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  sortBy: "asc" | "desc" | "";
  sortField: string;
  onSort: (field: string) => void;
}

export const CustomersTable = ({
  customers,
  totalPages,
  page,
  setPage,
  fetchData,
  limit,
  setLimit,
  sortBy,
  sortField,
  onSort,
}: CustomerTableProps) => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<{
    active: boolean;
    deleted: boolean;
  }>({ active: true, deleted: true });

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
    setPage(1);
    fetchData(1, limitValue);
  };

  const goToPage = (pageNum: number) => {
    setPage(pageNum);
    fetchData(pageNum, limit);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }

    if (sortBy === "asc") {
      return <ChevronUp className="h-4 w-4 text-blue-600" />;
    } else if (sortBy === "desc") {
      return <ChevronDown className="h-4 w-4 text-blue-600" />;
    } else {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
  };

  // const filteredCustomers = customers.filter(customer => {
  //   if (!statusFilter.active && customer.isActive) return false;
  //   if (!statusFilter.inactive && !customer.isActive) return false;
  //   return true;
  // });

  const filteredCustomers = customers.filter((customer) => {
    if (!statusFilter.active && customer.isActive) return false;
    if (!statusFilter.deleted && !customer.isActive) return false;
    return true;
  });

  // const handleStatusFilterChange = (type: 'active' | 'inactive', checked: boolean) => {
  //   setStatusFilter(prev => ({
  //     ...prev,
  //     [type]: checked
  //   }));
  // };

  const handleStatusFilterChange = (
    type: "active" | "deleted",
    checked: boolean
  ) => {
    setStatusFilter((prev) => ({
      ...prev,
      [type]: checked,
    }));
  };

  // const resetStatusFilter = () => {
  //   setStatusFilter({ active: true, inactive: true });
  // };

  const resetStatusFilter = () => {
    setStatusFilter({ active: true, deleted: true });
  };

  const renderPagination = () => {
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
            {Math.min(page * limit, filteredCustomers.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {filteredCustomers.length}
          </span>{" "}
          results ({limit} per page)
        </div>

        <PaginationComponent className="mx-0 w-auto">
          <PaginationContent className="gap-1">
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

            {pageNumbers.map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === "ellipsis" ? (
                  <div className="flex h-9 w-9 items-center justify-center text-gray-400 font-medium">
                    ...
                  </div>
                ) : (
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => goToPage(pageNumber as number)}
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
                onClick={handleNext}
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
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border shadow-sm bg-white overflow-hidden transition-all">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {/* User ID Column with Sorting */}
              <TableHead className="font-semibold text-gray-800">
                <Button
                  variant="ghost"
                  onClick={() => onSort("readableUserId")}
                  className="h-auto p-0 font-semibold text-gray-800 hover:text-blue-600 hover:bg-transparent flex items-center gap-2"
                >
                  User ID
                  {getSortIcon("readableUserId")}
                </Button>
              </TableHead>

              <TableHead className="font-semibold text-gray-800">
                Full Name
              </TableHead>
              <TableHead className="font-semibold text-gray-800">
                Phone Numbers
              </TableHead>

              {/* Status Column with Filter */}
              <TableHead className="font-semibold text-gray-800">
                <div className="flex items-center gap-2">
                  <span>Status</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                      >
                        <Filter className="h-3 w-3 text-gray-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-3" align="start">
                      <div className="space-y-3">
                        <div className="font-medium text-sm">
                          Filter by Status
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="active"
                              checked={statusFilter.active}
                              onCheckedChange={(checked) =>
                                handleStatusFilterChange(
                                  "active",
                                  checked as boolean
                                )
                              }
                            />
                            <label htmlFor="active" className="text-sm">
                              Active
                            </label>
                          </div>
                          {/* <div className="flex items-center space-x-2">
                            <Checkbox
                              id="inactive"
                              checked={statusFilter.inactive}
                              onCheckedChange={(checked) => 
                                handleStatusFilterChange('inactive', checked as boolean)
                              }
                            />
                            <label htmlFor="inactive" className="text-sm">Inactive</label>
                          </div> */}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="deleted"
                              checked={statusFilter.deleted}
                              onCheckedChange={(checked) =>
                                handleStatusFilterChange(
                                  "deleted",
                                  checked as boolean
                                )
                              }
                            />
                            <label htmlFor="deleted" className="text-sm">
                              Deleted
                            </label>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetStatusFilter}
                          className="w-full h-7 text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableHead>

              <TableHead className="font-semibold text-gray-800">
                Deleted By
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-800">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="text-muted-foreground">Loading users...</div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 font-medium">
                        No customers found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        You can search customers by <b>User ID</b>, <b>Name</b>,
                        or <b>Phone Number</b>.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer, index) => (
                <TableRow
                  key={customer.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <TableCell className="font-medium text-gray-900">
                    <Link
                      to={`/customer-details/${customer.id}`}
                      className="text-black hover:underline transition-colors text-blue-600"
                    >
                      {customer.readableUserId}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {customer.fullName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {customer.phoneNumber}
                  </TableCell>
                  <TableCell>
                    {/* <Badge
                      className={`${
                        customer.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      } transition-colors`}
                    >
                      {customer.isActive ? "Active" : "Inactive"}
                    </Badge> */}
                    <Badge
                      className={`${
                        customer.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      } transition-colors`}
                    >
                      {customer.isActive ? "Active" : "Deleted"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        customer.isActive
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : customer.deletedByAdmin
                          ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      } transition-colors`}
                    >
                      {customer.isActive
                        ? "NA"
                        : customer.deletedByAdmin
                        ? "Admin"
                        : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Link to={`/customer-details/${customer.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors"
                        onClick={() => handleDeleteClick(customer.id)}
                        disabled={!customer.isActive}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Show pagination only if more pages exist and results are >= limit */}
      {filteredCustomers.length > 0 &&
        totalPages > 1 &&
        filteredCustomers.length >= limit &&
        renderPagination()}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="text-gray-600">
            Are you sure you want to delete this user?
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors"
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
