import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";
import { toast } from "sonner";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type { Coupon } from "@/store/slices/couponSlice";

// ✅ Zod schema
const couponSchema = z
  .object({
    couponName: z
      .string()
      .min(2, "Coupon name must be at least 2 characters")
      .max(50, "Coupon name must be less than 50 characters"),
    couponCode: z
      .string()
      .min(2, "Coupon code must be at least 2 characters")
      .max(20, "Coupon code must be less than 20 characters")
      .regex(
        /^[A-Z0-9]+$/,
        "Coupon code can only contain uppercase letters and numbers"
      ),
    maxDiscount: z.coerce
      .number({ required_error: "Max discount is required" })
      .positive("Max discount must be greater than 0"),
    minValue: z.coerce
      .number({ required_error: "Minimum order value is required" })
      .positive("Minimum order value must be greater than 0"),
    discountPercentage: z.coerce
      .number({ required_error: "Discount percentage is required" })
      .min(1, "Discount percentage must be at least 1%")
      .max(100, "Discount percentage cannot exceed 100%"),
    validTill: z
      .string()
      .min(1, "Valid till date is required")
      .refine((val) => new Date(val) >= new Date(new Date().toDateString()), {
        message: "Valid till date cannot be in the past",
      }),
    isActive: z.boolean(),
  })
  .refine((data) => data.maxDiscount <= data.minValue, {
    message: "Max discount cannot be greater than minimum order value",
    path: ["maxDiscount"],
  });

type CouponFormValues = z.infer<typeof couponSchema>;

interface Props {
  coupon: Coupon;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export function CouponFormModal({ coupon, onClose, onUpdateSuccess }: Props) {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    setFocus
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    mode: "onChange",
    defaultValues: {
      couponName: coupon.couponName,
      couponCode: coupon.couponCode,
      maxDiscount: coupon.maxDiscount,
      minValue: coupon.minValue,
      discountPercentage: coupon.discountPercentage,
      validTill: format(
        new Date(coupon.validTill._seconds * 1000),
        "yyyy-MM-dd"
      ),
      isActive: coupon.isActive,
    },
  });

  const watchedValues = watch();
  const isActive = watch("isActive");


  // ✅ Check if form values have changed
  const hasChanges = React.useMemo(() => {
    return (
      watchedValues.couponName !== coupon.couponName ||
      watchedValues.couponCode !== coupon.couponCode ||
      watchedValues.maxDiscount !== coupon.maxDiscount ||
      watchedValues.minValue !== coupon.minValue ||
      watchedValues.discountPercentage !== coupon.discountPercentage ||
      watchedValues.validTill !==
        format(new Date(coupon.validTill._seconds * 1000), "yyyy-MM-dd") ||
      watchedValues.isActive !== coupon.isActive
    );
  }, [watchedValues, coupon]);

  const onSubmit = async (data: CouponFormValues) => {
    setLoading(true);
    try {
      await axiosInstance.put(API.UPDATE_COUPON(), data, {
        params: { couponId: coupon.id },
      });
      toast.success("Coupon updated successfully");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      // ✅ Handle coupon name uniqueness
      if (error?.response?.status === 400 && error?.response?.data?.message) {
        const message: string = error.response.data.message;
        if (message.includes("already exists")) {
          setError("couponName", { type: "manual", message });
          toast.error(message);
        } else {
          toast.error(message);
        }
      } else {
        if (
          error.response.data.message === "Coupon with this code already exists"
        ) {
          setFocus("couponCode");
        } else if (
          error.response.data.message === "Coupon with this name already exists"
        ) {
          setFocus("couponName");
        }
        toast.error("Failed to update coupon");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
          <DialogDescription>
            Update your coupon details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Coupon Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Coupon Name
            </label>
            <Input
              {...register("couponName")}
              placeholder="Enter coupon name"
            />
            {errors.couponName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.couponName.message}
              </p>
            )}
          </div>

          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Coupon Code
            </label>
            <Input
              {...register("couponCode")}
              placeholder="e.g., SAVE20"
              style={{ textTransform: "uppercase" }}
              onChange={(e) =>
                setValue("couponCode", e.target.value.toUpperCase())
              }
            />
            {errors.couponCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.couponCode.message}
              </p>
            )}
          </div>

          {/* Max Discount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Max Discount (₹)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register("maxDiscount", { valueAsNumber: true })}
              placeholder="Maximum discount amount"
            />
            {errors.maxDiscount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxDiscount.message}
              </p>
            )}
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Discount Percentage (%)
            </label>
            <Input
              type="number"
              step="0.01"
              min="1"
              max="100"
              {...register("discountPercentage", { valueAsNumber: true })}
              placeholder="1-100"
            />
            {errors.discountPercentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountPercentage.message}
              </p>
            )}
          </div>

          {/* Minimum Order Value */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Order Value (₹)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register("minValue", { valueAsNumber: true })}
              placeholder="Minimum order amount"
            />
            {errors.minValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minValue.message}
              </p>
            )}
          </div>

          {/* Valid Till */}
          <div>
            <label className="block text-sm font-medium mb-1">Valid Till</label>
            <Input
              type="date"
              min={format(new Date(), "yyyy-MM-dd")} // ✅ Prevents past dates
              {...register("validTill")}
            />

            {errors.validTill && (
              <p className="text-red-500 text-sm mt-1">
                {errors.validTill.message}
              </p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between py-2">
            <label htmlFor="isActive" className="text-sm font-medium">
              Active Status
            </label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !hasChanges}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Coupon"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
