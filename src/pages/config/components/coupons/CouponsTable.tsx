import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { CouponFormModal } from "./CouponFormModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface Coupon {
  id: string;
  couponCode: string;
  couponName: string;
  maxDiscount: string;
  minValue: number;
  validFrom: FirestoreTimestamp;
  validTill: FirestoreTimestamp;
  isActive: boolean;
  currentUsage?: number;
}

interface Props {
  coupons: Coupon[];
  loading: boolean;
  refetchCoupons: () => void;
}

export function CouponsTable({ coupons, loading, refetchCoupons }: Props) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [couponIdToDelete, setCouponIdToDelete] = useState<string | null>(null);

  const convertFirestoreTimestamp = (ts: FirestoreTimestamp): Date =>
    new Date(ts._seconds * 1000);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await axiosInstance.delete(API.DELETE_COUPON(), {
        params: { couponId: id },
      });

      toast.success("Coupon deleted");
    } catch (error) {
      toast.error("Failed to delete coupon");
    } finally {
      setDeletingId(null);
      refetchCoupons();
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
        ))}
      </div>
    );
  }

  if (!coupons || coupons.length === 0) {
    return <p className="p-4 text-sm text-gray-500">No coupons available.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Max Discount</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.couponCode}</TableCell>
                <TableCell>{coupon.couponName}</TableCell>
                <TableCell>{coupon.maxDiscount}</TableCell>
                <TableCell>₹{coupon.minValue}</TableCell>
                <TableCell>
                  {format(
                    convertFirestoreTimestamp(coupon.validTill),
                    "MMM dd, yyyy"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={coupon.isActive ? "secondary" : "destructive"}
                    className={
                      coupon.isActive ? "bg-green-600 hover:bg-green-700" : ""
                    }
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSelectedCoupon(coupon)}
                  >
                    <Pencil className="text-blue-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCouponIdToDelete(coupon.id)}
                    disabled={deletingId === coupon.id}
                  >
                    {deletingId === coupon.id ? (
                      <Loader2 className="animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="text-red-600" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedCoupon && (
        <CouponFormModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onUpdateSuccess={refetchCoupons}
        />
      )}

      <Dialog
        open={!!couponIdToDelete}
        onOpenChange={() => setCouponIdToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this coupon? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setCouponIdToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (couponIdToDelete) {
                  handleDelete(couponIdToDelete);
                  setCouponIdToDelete(null);
                }
              }}
              disabled={!!deletingId}
            >
              {deletingId ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
