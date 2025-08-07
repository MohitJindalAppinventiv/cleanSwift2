// import React from "react";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import API from "@/api/endpoints/endpoint";
// import { toast } from "sonner";
// import { format } from "date-fns";

// const couponSchema = z.object({
//   couponName: z.string().min(2),
//   couponCode: z.string().min(2),
//   maxDiscount: z.string(),
//   minValue: z.coerce.number().positive(),
//   validFrom: z.string(),
//   validTill: z.string(),
// });

// type CouponFormValues = z.infer<typeof couponSchema>;

// interface Props {
//   coupon: {
//     id: string;
//     couponName: string;
//     couponCode: string;
//     maxDiscount: string;
//     minValue: number;
//     validFrom: { _seconds: number };
//     validTill: { _seconds: number };
//   };
//   onClose: () => void;
//   onUpdateSuccess: () => void;
// }

// export function CouponFormModal({ coupon, onClose, onUpdateSuccess }: Props) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CouponFormValues>({
//     resolver: zodResolver(couponSchema),
//     defaultValues: {
//       couponName: coupon.couponName,
//       couponCode: coupon.couponCode,
//       maxDiscount: coupon.maxDiscount,
//       minValue: coupon.minValue,
//       validFrom: format(new Date(coupon.validFrom._seconds * 1000), "yyyy-MM-dd"),
//       validTill: format(new Date(coupon.validTill._seconds * 1000), "yyyy-MM-dd"),
//     },
//   });

//   const onSubmit = async (data: CouponFormValues) => {
//     try {
//       await axiosInstance.put(API.UPDATE_COUPON(coupon.id), data);
//       toast.success("Coupon updated successfully");
//       onUpdateSuccess();
//       onClose();
//     } catch (error) {
//       toast.error("Failed to update coupon");
//     }
//   };

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Edit Coupon</DialogTitle>
//           <DialogDescription>Update your coupon details below.</DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label>Coupon Name</label>
//             <Input {...register("couponName")} />
//             {errors.couponName && (
//               <p className="text-red-500 text-sm">{errors.couponName.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Coupon Code</label>
//             <Input {...register("couponCode")} />
//             {errors.couponCode && (
//               <p className="text-red-500 text-sm">{errors.couponCode.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Max Discount</label>
//             <Input {...register("maxDiscount")} />
//             {errors.maxDiscount && (
//               <p className="text-red-500 text-sm">{errors.maxDiscount.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Minimum Order Value</label>
//             <Input type="number" {...register("minValue")} />
//             {errors.minValue && (
//               <p className="text-red-500 text-sm">{errors.minValue.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Valid From</label>
//             <Input type="date" {...register("validFrom")} />
//           </div>

//           <div>
//             <label>Valid Till</label>
//             <Input type="date" {...register("validTill")} />
//           </div>

//           <div className="flex justify-end gap-2 pt-4">
//             <Button variant="outline" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit">Update</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import API from "@/api/endpoints/endpoint";
// import { toast } from "sonner";
// import { format } from "date-fns";

// const couponSchema = z.object({
//   couponName: z.string().min(2),
//   couponCode: z.string().min(2),
//   maxDiscount: z.string(),
//   minValue: z.coerce.number().positive(),
//   maxUsage: z.coerce.number().min(1),
//   validFrom: z.string(),
//   validTill: z.string(),
// });

// type CouponFormValues = z.infer<typeof couponSchema>;

// interface Props {
//   coupon: {
//     id: string;
//     couponName: string;
//     couponCode: string;
//     maxDiscount: number;
//     minValue: number;
//     maxUsage: number;
//     validFrom: { _seconds: number };
//     validTill: { _seconds: number };
//   };
//   onClose: () => void;
//   onUpdateSuccess: () => void;
// }

// export function CouponFormModal({ coupon, onClose, onUpdateSuccess }: Props) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CouponFormValues>({
//     resolver: zodResolver(couponSchema),
//     defaultValues: {
//       couponName: coupon.couponName,
//       couponCode: coupon.couponCode,
//       maxDiscount: coupon.maxDiscount,
//       minValue: coupon.minValue,
//       maxUsage: coupon.maxUsage,
//       validFrom: format(new Date(coupon.validFrom._seconds * 1000), "yyyy-MM-dd"),
//       validTill: format(new Date(coupon.validTill._seconds * 1000), "yyyy-MM-dd"),
//     },
//   });

//   const onSubmit = async (data: CouponFormValues) => {
//     try {
//       await axiosInstance.put(API.UPDATE_COUPON(), data,{
//         params:{
//             id:coupon.id
//         }
//       });
//       toast.success("Coupon updated successfully");
//       onUpdateSuccess();
//       onClose();
//     } catch (error) {
//       toast.error("Failed to update coupon");
//     }
//   };

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Edit Coupon</DialogTitle>
//           <DialogDescription>Update your coupon details below.</DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label>Coupon Name</label>
//             <Input {...register("couponName")} />
//             {errors.couponName && (
//               <p className="text-red-500 text-sm">{errors.couponName.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Coupon Code</label>
//             <Input {...register("couponCode")} />
//             {errors.couponCode && (
//               <p className="text-red-500 text-sm">{errors.couponCode.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Max Discount</label>
//             <Input {...register("maxDiscount")} />
//             {errors.maxDiscount && (
//               <p className="text-red-500 text-sm">{errors.maxDiscount.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Minimum Order Value</label>
//             <Input type="number" {...register("minValue")} />
//             {errors.minValue && (
//               <p className="text-red-500 text-sm">{errors.minValue.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Max Usage</label>
//             <Input type="number" {...register("maxUsage")} />
//             {errors.maxUsage && (
//               <p className="text-red-500 text-sm">{errors.maxUsage.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Valid From</label>
//             <Input type="date" {...register("validFrom")} />
//           </div>

//           <div>
//             <label>Valid Till</label>
//             <Input type="date" {...register("validTill")} />
//           </div>

//           <div className="flex justify-end gap-2 pt-4">
//             <Button variant="outline" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit">Update</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import API from "@/api/endpoints/endpoint";
// import { toast } from "sonner";
// import { format } from "date-fns";

// const couponSchema = z.object({
//   couponName: z.string().min(2),
//   couponCode: z.string().min(2),
//   maxDiscount: z.coerce.number().positive(),
//   minValue: z.coerce.number().positive(),
//   validFrom: z.string(),
//   validTill: z.string(),
// //   maxUsage: z.coerce.number().positive(),
// });

// type CouponFormValues = z.infer<typeof couponSchema>;

// interface Props {
//   coupon: {
//     id: string;
//     couponName: string;
//     couponCode: string;
//     maxDiscount: number;
//     minValue: number;
//     validFrom: { _seconds: number };
//     validTill: { _seconds: number };
//     maxUsage: number;
//   };
//   onClose: () => void;
//   onUpdateSuccess: () => void;
// }

// export function CouponFormModal({ coupon, onClose, onUpdateSuccess }: Props) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CouponFormValues>({
//     resolver: zodResolver(couponSchema),
//     defaultValues: {
//       couponName: coupon.couponName,
//       couponCode: coupon.couponCode,
//       maxDiscount: coupon.maxDiscount,
//       minValue: coupon.minValue,
//       validFrom: format(new Date(coupon.validFrom._seconds * 1000), "yyyy-MM-dd"),
//       validTill: format(new Date(coupon.validTill._seconds * 1000), "yyyy-MM-dd"),
//     //   maxUsage: coupon.maxUsage,
//     },
//   });

//   const onSubmit = async (data: CouponFormValues) => {
//     try {
//       await axiosInstance.put(API.UPDATE_COUPON(), data,{
//         params:{
//             couponId:coupon.id
//         }
//       });
//       toast.success("Coupon updated successfully");
//       onUpdateSuccess();
//       onClose();
//     } catch (error) {
//       toast.error("Failed to update coupon");
//     }
//   };

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Edit Coupon</DialogTitle>
//           <DialogDescription>Update your coupon details below.</DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label>Coupon Name</label>
//             <Input {...register("couponName")} />
//             {errors.couponName && (
//               <p className="text-red-500 text-sm">{errors.couponName.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Coupon Code</label>
//             <Input {...register("couponCode")} />
//             {errors.couponCode && (
//               <p className="text-red-500 text-sm">{errors.couponCode.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Max Discount</label>
//             <Input type="number" {...register("maxDiscount")} />
//             {errors.maxDiscount && (
//               <p className="text-red-500 text-sm">{errors.maxDiscount.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Minimum Order Value</label>
//             <Input type="number" {...register("minValue")} />
//             {errors.minValue && (
//               <p className="text-red-500 text-sm">{errors.minValue.message}</p>
//             )}
//           </div>

//           {/* <div>
//             <label>Max Usage</label>
//             <Input type="number" {...register("maxUsage")} />
//             {errors.maxUsage && (
//               <p className="text-red-500 text-sm">{errors.maxUsage.message}</p>
//             )}
//           </div> */}

//           <div>
//             <label>Valid From</label>
//             <Input type="date" {...register("validFrom")} />
//           </div>

//           <div>
//             <label>Valid Till</label>
//             <Input type="date" {...register("validTill")} />
//           </div>

//           <div className="flex justify-end gap-2 pt-4">
//             <Button variant="outline" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit">Update</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { Switch } from "@/components/ui/switch"; // Make sure this exists
import { Loader2 } from "lucide-react"; // Optional spinner

const couponSchema = z.object({
  couponName: z.string().min(2),
  couponCode: z.string().min(2),
  maxDiscount: z.coerce.number().positive(),
  minValue: z.coerce.number().positive(),
  discountPercentage:z.coerce.number().min(1).max(100),
  validFrom: z.string(),
  validTill: z.string(),
  isActive: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface Props {
  coupon: {
    id: string;
    couponName: string;
    couponCode: string;
    maxDiscount: number;
    minValue: number;
    discountPercentage:number;
    validFrom: { _seconds: number };
    validTill: { _seconds: number };
    isActive: boolean;
    maxUsage: number;
  };
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
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponName: coupon.couponName,
      couponCode: coupon.couponCode,
      maxDiscount: coupon.maxDiscount,
      minValue: coupon.minValue,
      discountPercentage:coupon.discountPercentage,
      validFrom: format(
        new Date(coupon.validFrom._seconds * 1000),
        "yyyy-MM-dd"
      ),
      validTill: format(
        new Date(coupon.validTill._seconds * 1000),
        "yyyy-MM-dd"
      ),
      isActive: coupon.isActive,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = async (data: CouponFormValues) => {
    console.log(data);
    setLoading(true);

    try {
      await axiosInstance.put(API.UPDATE_COUPON(), data, {
        params: {
          couponId: coupon.id,
        },
      });
      toast.success("Coupon updated successfully");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
          <DialogDescription>
            Update your coupon details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Coupon Name</label>
            <Input {...register("couponName")} />
            {errors.couponName && (
              <p className="text-red-500 text-sm">
                {errors.couponName.message}
              </p>
            )}
          </div>

          <div>
            <label>Coupon Code</label>
            <Input {...register("couponCode")} />
            {errors.couponCode && (
              <p className="text-red-500 text-sm">
                {errors.couponCode.message}
              </p>
            )}
          </div>

          <div>
            <label>Max Discount</label>
            <Input type="number" {...register("maxDiscount")} />
            {errors.maxDiscount && (
              <p className="text-red-500 text-sm">
                {errors.maxDiscount.message}
              </p>
            )}
          </div>

                    <div>
            <label>Discount Percentage</label>
            <Input type="number" {...register("discountPercentage")} />
            {errors.discountPercentage && (
              <p className="text-red-500 text-sm">
                {errors.discountPercentage.message}
              </p>
            )}
          </div>

          <div>
            <label>Minimum Order Value</label>
            <Input type="number" {...register("minValue")} />
            {errors.minValue && (
              <p className="text-red-500 text-sm">{errors.minValue.message}</p>
            )}
          </div>

          <div>
            <label>Valid From</label>
            <Input type="date" {...register("validFrom")} />
          </div>

          <div>
            <label>Valid Till</label>
            <Input type="date" {...register("validTill")} />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="isActive">Active</label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
