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
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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

interface CustomerTableProps {
  customers: Customer[];
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchData: () => void;
}

export const CustomersTable = ({
  customers,
  totalPages,
  page,
  setPage,
  fetchData,
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
      fetchData();
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
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
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

          {/* Pagination Controls */}
          <div className="flex justify-center gap-6 items-center mt-4">
            <Button onClick={handlePrevious} disabled={page === 1}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {totalPages == 0 ? 0 : page} of {totalPages}
            </span>
            <Button onClick={handleNext} disabled={page === totalPages}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
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
