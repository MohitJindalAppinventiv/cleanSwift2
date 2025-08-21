// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Trash2,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import { toast } from "@/components/ui/sonner";
// import { Customer } from "../../components/customers/types";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Loader2 } from "lucide-react";
// import axios from "axios";
// import {
//   Pagination as PaginationComponent,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// interface CustomerTableProps {
//   customers: Customer[];
//   totalPages: number;
//   page: number;
//   setPage: React.Dispatch<React.SetStateAction<number>>;
//   fetchData: (page: number, limit: number) => void;
//   limit: number;
//   setLimit: React.Dispatch<React.SetStateAction<number>>;
// }

// export const CustomersTable = ({
//   customers,
//   totalPages,
//   page,
//   setPage,
//   fetchData,
//   limit,
//   setLimit,
// }: CustomerTableProps) => {
//   const [loading, setLoading] = useState(false);

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [deleting, setDeleting] = useState(false);

//   const handleDeleteClick = (userId: string) => {
//     setSelectedUserId(userId);
//     setDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedUserId) return;
//     setDeleting(true);

//     try {
//       await axiosInstance.delete(`/deleteUser`, {
//         params: { userId: selectedUserId },
//       });
//       toast.success("User deleted successfully");
//       fetchData(page, limit);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         toast.error(error.message);
//         console.error(error);
//       } else {
//         console.error(error);
//         toast.error("Failed to delete user");
//       }
//     } finally {
//       setDeleting(false);
//       setDialogOpen(false);
//       setSelectedUserId(null);
//     }
//   };

//   const handlePrevious = () => {
//     if (page > 1) {
//       const newPage = page - 1;
//       setPage(newPage);
//       fetchData(newPage, limit);
//     }
//   };

//   const handleNext = () => {
//     if (page < totalPages) {
//       const newPage = page + 1;
//       setPage(newPage);
//       fetchData(newPage, limit);
//     }
//   };

//   const handleLimitChange = (newLimit: string) => {
//     const limitValue = parseInt(newLimit, 10);
//     setLimit(limitValue);
//     setPage(1); // Reset to first page when changing limit
//     fetchData(1, limitValue);
//   };

//   const getVisiblePages = () => {
//     const maxVisiblePages = 5;
//     const half = Math.floor(maxVisiblePages / 2);
//     let start = Math.max(1, page - half);
//     const end = Math.min(totalPages, start + maxVisiblePages - 1);

//     // Adjust if we're near the end
//     if (end - start + 1 < maxVisiblePages) {
//       start = Math.max(1, end - maxVisiblePages + 1);
//     }

//     const pages = [];
//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   const goToPage = (pageNum: number) => {
//     setPage(pageNum);
//     fetchData(pageNum, limit);
//   };

//   const goToFirstPage = () => {
//     setPage(1);
//     fetchData(1, limit);
//   };

//   const goToLastPage = () => {
//     setPage(totalPages);
//     fetchData(totalPages, limit);
//   };

//   return (
//     <div className="space-y-4">
//       {loading ? (
//         <div className="text-muted-foreground">Loading users...</div>
//       ) : (
//         <>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>User ID</TableHead>
//                 <TableHead>Full Name</TableHead>
//                 <TableHead>Phone Numbers</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Deleted By</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {customers?.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={6}
//                     className="text-center text-gray-500 py-6"
//                   >
//                     No customers found.
//                     <br />
//                     You can search customers by <b>User ID</b>, <b>Name</b>, or{" "}
//                     <b>Phone Number</b>.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 customers.map((customer) => (
//                   <TableRow key={customer.id}>
//                     <TableCell><Link to={`/customer-details/${customer.id}`}>{customer.readableUserId}</Link></TableCell>
//                     <TableCell>{customer.fullName}</TableCell>
//                     <TableCell>
//                       {customer.phoneNumber}
//                       {customer.alternateNumber
//                         ? ` / ${customer.alternateNumber}`
//                         : ""}
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={customer.isActive ? "default" : "destructive"}
//                       >
//                         {customer.isActive ? "Active" : "Inactive"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={customer.isActive ? "default" : "destructive"}
//                       >
//                         {customer.isActive
//                           ? "NA"
//                           : customer.deletedByAdmin
//                           ? "Admin"
//                           : "User"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right flex gap-2 justify-end">
//                       <Button variant="ghost" size="sm" asChild>
//                         <Link to={`/customer-details/${customer.id}`}>
//                           View
//                         </Link>
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="text-red-600"
//                         onClick={() => handleDeleteClick(customer.id)}
//                         disabled={!customer.isActive}
//                       >
//                         <Trash2 />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>

//           {/* Show pagination only if more pages exist and results are >= limit */}
//           {customers.length > 0 &&
//             totalPages > 1 &&
//             customers.length >= limit && (
//               <div className="flex justify-end mt-6">
//                 <PaginationComponent className="mx-0 w-auto">
//                   <PaginationContent className="gap-1">
//                     {/* Previous */}
//                     <PaginationItem>
//                       <PaginationPrevious
//                         onClick={handlePrevious}
//                         className={`${
//                           page === 1
//                             ? "pointer-events-none opacity-50 bg-gray-100"
//                             : "cursor-pointer bg-white hover:bg-[#9B87F5] hover:text-white transition-colors"
//                         } border rounded-md px-3 py-2`}
//                       />
//                     </PaginationItem>

//                     {/* Page Numbers */}
//                     {getVisiblePages().map((pageNumber, index) => (
//                       <PaginationItem key={index}>
//                         <PaginationLink
//                           isActive={page === pageNumber}
//                           onClick={() => goToPage(pageNumber)}
//                           className={`h-9 w-9 flex items-center justify-center border rounded-md text-sm transition-colors
//                 ${
//                   page === pageNumber
//                     ? "bg-[#9B87F5] text-white border-[#9B87F5]"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-[#9B87F5] hover:text-white"
//                 }`}
//                         >
//                           {pageNumber}
//                         </PaginationLink>
//                       </PaginationItem>
//                     ))}

//                     {/* Next */}
//                     <PaginationItem>
//                       <PaginationNext
//                         onClick={() => handleNext()}
//                         className={`${
//                           page === totalPages || totalPages === 0
//                             ? "pointer-events-none opacity-50 bg-gray-100"
//                             : "cursor-pointer bg-white hover:bg-[#9B87F5] hover:text-white transition-colors"
//                         } border rounded-md px-3 py-2`}
//                       />
//                     </PaginationItem>
//                   </PaginationContent>
//                 </PaginationComponent>
//               </div>
//             )}
//         </>
//       )}

//       {/* Confirmation Dialog */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//           </DialogHeader>
//           <div>Are you sure you want to delete this user?</div>
//           <DialogFooter className="gap-2">
//             <Button variant="outline" onClick={() => setDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={confirmDelete}
//               disabled={deleting}
//               className="bg-red-600 text-white hover:bg-red-700"
//             >
//               {deleting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
//               Confirm
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };



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
    setPage(1);
    fetchData(1, limitValue);
  };

  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, page - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

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
            {Math.min(page * limit, customers.length)}
          </span>{" "}
          of <span className="font-semibold text-gray-800">{customers.length}</span>{" "}
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
              <TableHead className="font-semibold text-gray-800">User ID</TableHead>
              <TableHead className="font-semibold text-gray-800">Full Name</TableHead>
              <TableHead className="font-semibold text-gray-800">Phone Numbers</TableHead>
              <TableHead className="font-semibold text-gray-800">Status</TableHead>
              <TableHead className="font-semibold text-gray-800">Deleted By</TableHead>
              <TableHead className="text-right font-semibold text-gray-800">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="text-muted-foreground">Loading users...</div>
                </TableCell>
              </TableRow>
            ) : customers?.length === 0 ? (
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
                      <p className="text-gray-500 font-medium">No customers found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        You can search customers by <b>User ID</b>, <b>Name</b>, or{" "}
                        <b>Phone Number</b>.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer, index) => (
                <TableRow
                  key={customer.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <TableCell className="font-medium text-gray-900">
                    <Link 
                      to={`/customer-details/${customer.id}`}
                      className="text-black hover:underline transition-colors"
                    >
                      {customer.readableUserId}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-700">{customer.fullName}</TableCell>
                  <TableCell className="text-gray-600">
                    {customer.phoneNumber}
                    {customer.alternateNumber
                      ? ` / ${customer.alternateNumber}`
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        customer.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      } transition-colors`}
                    >
                      {customer.isActive ? "Active" : "Inactive"}
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
      {customers.length > 0 && totalPages > 1 && customers.length >= limit && renderPagination()}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="text-gray-600">Are you sure you want to delete this user?</div>
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