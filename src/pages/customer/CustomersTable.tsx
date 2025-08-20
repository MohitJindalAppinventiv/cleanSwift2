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
// import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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

// interface CustomerTableProps {
//   customers: Customer[];
//   totalPages: number;
//   page: number;
//   setPage: React.Dispatch<React.SetStateAction<number>>;
//   fetchData: () => void;
// }

// export const CustomersTable = ({
//   customers,
//   totalPages,
//   page,
//   setPage,
//   fetchData,
// }: CustomerTableProps) => {
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

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
//       fetchData();
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
//     if (page > 1) setPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (page < totalPages) setPage((prev) => prev + 1);
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
//               {customers?.map((customer) => (
//                 <TableRow key={customer.id}>
//                   <TableCell>{customer.readableUserId}</TableCell>
//                   <TableCell>{customer.fullName}</TableCell>
//                   <TableCell>
//                     {customer.phoneNumber}
//                     {customer.alternateNumber
//                       ? ` / ${customer.alternateNumber}`
//                       : ""}
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={customer.isActive ? "default" : "destructive"}
//                     >
//                       {customer.isActive ? "Active" : "Inactive"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={customer.isActive ? "default" : "destructive"}
//                     >
//                       {customer.isActive
//                         ? "NA"
//                         : customer.deletedByAdmin
//                         ? "Admin"
//                         : "User"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right flex gap-2 justify-end">
//                     <Button variant="ghost" size="sm" asChild>
//                       <Link to={`/customer-details/${customer.id}`}>View</Link>
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="text-red-600"
//                       onClick={() => handleDeleteClick(customer.id)}
//                       disabled={!customer.isActive}
//                     >
//                       <Trash2 />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           {/* Pagination Controls */}
//           <div className="flex justify-center gap-6 items-center mt-4">
//             <Button onClick={handlePrevious} disabled={page === 1}>
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Previous
//             </Button>
//             <span className="text-muted-foreground text-sm">
//               Page {totalPages == 0 ? 0 : page} of {totalPages}
//             </span>
//             <Button onClick={handleNext} disabled={page === totalPages}>
//               Next
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </div>
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.readableUserId}</TableCell>
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
                      <Link to={`/customer-details/${customer.id}`}>View</Link>
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
              ))}
            </TableBody>
          </Table>

          {/* Enhanced Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages || 1}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={goToFirstPage}
                disabled={page === 1}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={page === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getVisiblePages().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => goToPage(pageNum)}
                  className="h-8 w-8"
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={page === totalPages || totalPages === 0}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
                disabled={page === totalPages || totalPages === 0}
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
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