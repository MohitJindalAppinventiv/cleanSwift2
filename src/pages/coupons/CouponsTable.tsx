import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Pencil,
  Trash2,
  Loader2,
  TicketPercent,
  Calendar,
  IndianRupee,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CouponFormModal } from "./CouponFormModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { deleteCoupon, fetchCoupons } from "@/store/slices/couponSlice";
import type { Coupon } from "@/store/slices/couponSlice";
import { useAppDispatch } from "@/hooks/redux";
interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface Props {
  coupons: Coupon[];
  loading: boolean;
}

export function CouponsCardView({ coupons, loading }: Props) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [couponIdToDelete, setCouponIdToDelete] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const convertFirestoreTimestamp = (ts: FirestoreTimestamp): Date =>
    new Date(ts._seconds * 1000);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      dispatch(deleteCoupon(id));
    } catch {
      setDeletingId(null);
    }
  };

  const refetchCoupon = async () => {
    await dispatch(fetchCoupons());
  };

  const isExpiringSoon = (validTill: FirestoreTimestamp) => {
    const expiry = convertFirestoreTimestamp(validTill);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (validTill: FirestoreTimestamp) => {
    const expiry = convertFirestoreTimestamp(validTill);
    return expiry < new Date();
  };

  if (loading) {
    return (
      <div className="grid gap-8 p-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card
            key={i}
            className="relative h-[22rem] border border-violet-200 bg-white/90 backdrop-blur-sm shadow-md"
          >
            <CardHeader className="p-6 pb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-16 w-full" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!coupons || coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-xl" />
          <div className="relative bg-gradient-to-br from-violet-500 to-fuchsia-600 p-6 rounded-2xl shadow-2xl">
            <TicketPercent className="h-12 w-12 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
          No coupons available
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Create your first coupon to start offering discounts to your
          customers.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 p-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {coupons.map((coupon) => {
          const expired = isExpired(coupon.validTill);
          const expiringSoon = isExpiringSoon(coupon.validTill);

          return (
            <div key={coupon.id} className="group relative">
              {/* Hover background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl transition-all duration-300 group-hover:from-violet-100 group-hover:via-purple-100 group-hover:to-fuchsia-100" />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-200/50 via-purple-200/50 to-fuchsia-200/50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />

              <Card className="relative h-full border border-violet-200 bg-white/90 backdrop-blur-sm shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] flex flex-col">
                {/* Coupon Icon */}
                <div className="absolute -top-4 -right-4 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-full blur-md opacity-60" />
                    <div className="relative bg-gradient-to-br from-violet-500 to-fuchsia-600 p-3 rounded-full shadow-lg transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                      <TicketPercent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Expiry Badge */}
                {(expired || expiringSoon) && (
                  <div className="absolute top-3 left-3 z-10">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expired
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {expired ? "⚠️ Expired" : "⏰ Expiring Soon"}
                    </div>
                  </div>
                )}

                <CardHeader className="p-6 pb-4">
                  <div className="space-y-3">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-purple-500 bg-clip-text text-transparent pr-16">
                      {coupon.couponCode}
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium">
                      {coupon.couponName}
                    </p>
                    <Badge
                      variant={
                        coupon.isActive && !expired
                          ? "secondary"
                          : "destructive"
                      }
                      className={`w-fit font-medium ${
                        coupon.isActive && !expired
                          ? "bg-violet-100 text-violet-700 hover:bg-violet-200 border-violet-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          coupon.isActive && !expired
                            ? "bg-violet-500"
                            : "bg-red-500"
                        }`}
                      />
                      {coupon.isActive && !expired
                        ? "Active"
                        : expired
                        ? "Expired"
                        : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-2 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Discount % - Keep purple */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-xl shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      <div className="relative">
                        <p className="text-xs text-violet-100 font-medium uppercase tracking-wider">
                          Discount %
                        </p>
                        <p className="text-xl font-bold text-white mt-1">
                          {coupon.discountPercentage
                            ? `${coupon.discountPercentage}%`
                            : "N/A"}
                        </p>
                      </div>
                      <Percent className="absolute bottom-2 right-2 h-6 w-6 text-white/60" />
                    </div>

                    {/* Max Discount - Slightly toned down */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-fuchsia-500 to-pink-500 p-4 rounded-xl shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      <div className="relative">
                        <p className="text-xs text-pink-100 font-medium uppercase tracking-wider">
                          Max Discount
                        </p>
                        <p className="text-xl font-bold text-white mt-1">
                          {coupon.maxDiscount}
                        </p>
                      </div>
                      <IndianRupee className="absolute bottom-2 right-2 h-6 w-6 text-white/60" />
                    </div>
                  </div>

                  {/* Additional Info - Neutral */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-3 w-3 text-violet-600" />
                        <p className="text-xs text-gray-700 font-medium uppercase tracking-wide">
                          Min Order
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        ₹{coupon.minValue.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3 w-3 text-gray-600" />
                        <p className="text-xs text-gray-700 font-medium uppercase tracking-wide">
                          Valid Until
                        </p>
                      </div>
                      <p className="text-xs font-bold text-gray-800 leading-tight">
                        {format(
                          convertFirestoreTimestamp(coupon.validTill),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>

                {/* Buttons */}
                <div className="mt-auto p-6 pt-4 pb-6 bg-gradient-to-t from-white/90 via-white/50 to-transparent">
                  <div className="flex gap-2">
                    <Button
                    disabled={coupon.id === deletingId}
                    
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-white/80 backdrop-blur-sm border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300"
                      onClick={() => setSelectedCoupon(coupon)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-white/80 backdrop-blur-sm border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50 hover:border-fuchsia-300"
                      onClick={() => setCouponIdToDelete(coupon.id)}
                      disabled={deletingId === coupon.id}
                    >
                      {deletingId === coupon.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Edit Coupon Modal */}
      {selectedCoupon && (
        <CouponFormModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onUpdateSuccess={refetchCoupon}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog
        open={!!couponIdToDelete}
        onOpenChange={() => setCouponIdToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 leading-relaxed">
              Are you sure you want to delete this coupon? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
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
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
