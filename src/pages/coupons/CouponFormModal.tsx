// // import React from "react";
// // import {
// //   Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
// // } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { axiosInstance } from "@/api/axios/axiosInstance";
// // import API from "@/api/endpoints/endpoint";
// // import { toast } from "sonner";
// // import { format } from "date-fns";

// // const couponSchema = z.object({
// //   couponName: z.string().min(2),
// //   couponCode: z.string().min(2),
// //   maxDiscount: z.string(),
// //   minValue: z.coerce.number().positive(),
// //   validFrom: z.string(),
// //   validTill: z.string(),
// // });

// // type CouponFormValues = z.infer<typeof couponSchema>;

// // interface Props {
// //   coupon: {
// //     id: string;
// //     couponName: string;
// //     couponCode: string;
// //     maxDiscount: string;
// //     minValue: number;
// //     validFrom: { _seconds: number };
// //     validTill: { _seconds: number };
// //   };
// //   onClose: () => void;
// //   onUpdateSuccess: () => void;
// // }

// // export function CouponFormModal({ coupon, onClose, onUpdateSuccess }: Props) {
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //   } = useForm<CouponFormValues>({
// //     resolver: zodResolver(couponSchema),
// //     defaultValues: {
// //       couponName: coupon.couponName,
// //       couponCode: coupon.couponCode,
// //       maxDiscount: coupon.maxDiscount,
// //       minValue: coupon.minValue,
// //       validFrom: format(new Date(coupon.validFrom._seconds * 1000), "yyyy-MM-dd"),
// //       validTill: format(new Date(coupon.validTill._seconds * 1000), "yyyy-MM-dd"),
// //     },
// //   });

// //   const onSubmit = async (data: CouponFormValues) => {
// //     try {
// //       await axiosInstance.put(API.UPDATE_COUPON(coupon.id), data);
// //       toast.success("Coupon updated successfully");
// //       onUpdateSuccess();
// //       onClose();
// //     } catch (error) {
// //       toast.error("Failed to update coupon");
// //     }
// //   };

// //   return (
// //     <Dialog open onOpenChange={onClose}>
// //       <DialogContent className="max-w-md">
// //         <DialogHeader>
// //           <DialogTitle>Edit Coupon</DialogTitle>
// //           <DialogDescription>Update your coupon details below.</DialogDescription>
// //         </DialogHeader>

// //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// //           <div>
// //             <label>Coupon Name</label>
// //             <Input {...register("couponName")} />
// //             {errors.couponName && (
// //               <p className="text-red-500 text-sm">{errors.couponName.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Coupon Code</label>
// //             <Input {...register("couponCode")} />
// //             {errors.couponCode && (
// //               <p className="text-red-500 text-sm">{errors.couponCode.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Max Discount</label>
// //             <Input {...register("maxDiscount")} />
// //             {errors.maxDiscount && (
// //               <p className="text-red-500 text-sm">{errors.maxDiscount.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Minimum Order Value</label>
// //             <Input type="number" {...register("minValue")} />
// //             {errors.minValue && (
// //               <p className="text-red-500 text-sm">{errors.minValue.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Valid From</label>
// //             <Input type="date" {...register("validFrom")} />
// //           </div>

// //           <div>
// //             <label>Valid Till</label>
// //             <Input type="date" {...register("validTill")} />
// //           </div>

// //           <div className="flex justify-end gap-2 pt-4">
// //             <Button variant="outline" type="button" onClick={onClose}>
// //               Cancel
// //             </Button>
// //             <Button type="submit">Update</Button>
// //           </div>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// // import React from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// // } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { axiosInstance } from "@/api/axios/axiosInstance";
// // import API from "@/api/endpoints/endpoint";
// // import { toast } from "sonner";
// // import { format } from "date-fns";

// // const couponSchema = z.object({
// //   couponName: z.string().min(2),
// //   couponCode: z.string().min(2),
// //   maxDiscount: z.string(),
// //   minValue: z.coerce.number().positive(),
// //   maxUsage: z.coerce.number().min(1),
// //   validFrom: z.string(),
// //   validTill: z.string(),
// // });

// // type CouponFormValues = z.infer<typeof couponSchema>;

// // interface Props {
// //   coupon: {
// //     id: string;
// //     couponName: string;
// //     couponCode: string;
// //     maxDiscount: number;
// //     minValue: number;
// //     maxUsage: number;
// //     validFrom: { _seconds: number };
// //     validTill: { _seconds: number };
// //   };
// //   onClose: () => void;
// //   onUpdateSuccess: () => void;
// // }

// // export function CouponFormModal({ coupon, onClose, onUpdateSuccess }: Props) {
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //   } = useForm<CouponFormValues>({
// //     resolver: zodResolver(couponSchema),
// //     defaultValues: {
// //       couponName: coupon.couponName,
// //       couponCode: coupon.couponCode,
// //       maxDiscount: coupon.maxDiscount,
// //       minValue: coupon.minValue,
// //       maxUsage: coupon.maxUsage,
// //       validFrom: format(new Date(coupon.validFrom._seconds * 1000), "yyyy-MM-dd"),
// //       validTill: format(new Date(coupon.validTill._seconds * 1000), "yyyy-MM-dd"),
// //     },
// //   });

// //   const onSubmit = async (data: CouponFormValues) => {
// //     try {
// //       await axiosInstance.put(API.UPDATE_COUPON(), data,{
// //         params:{
// //             id:coupon.id
// //         }
// //       });
// //       toast.success("Coupon updated successfully");
// //       onUpdateSuccess();
// //       onClose();
// //     } catch (error) {
// //       toast.error("Failed to update coupon");
// //     }
// //   };

// //   return (
// //     <Dialog open onOpenChange={onClose}>
// //       <DialogContent className="max-w-md">
// //         <DialogHeader>
// //           <DialogTitle>Edit Coupon</DialogTitle>
// //           <DialogDescription>Update your coupon details below.</DialogDescription>
// //         </DialogHeader>

// //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// //           <div>
// //             <label>Coupon Name</label>
// //             <Input {...register("couponName")} />
// //             {errors.couponName && (
// //               <p className="text-red-500 text-sm">{errors.couponName.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Coupon Code</label>
// //             <Input {...register("couponCode")} />
// //             {errors.couponCode && (
// //               <p className="text-red-500 text-sm">{errors.couponCode.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Max Discount</label>
// //             <Input {...register("maxDiscount")} />
// //             {errors.maxDiscount && (
// //               <p className="text-red-500 text-sm">{errors.maxDiscount.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Minimum Order Value</label>
// //             <Input type="number" {...register("minValue")} />
// //             {errors.minValue && (
// //               <p className="text-red-500 text-sm">{errors.minValue.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Max Usage</label>
// //             <Input type="number" {...register("maxUsage")} />
// //             {errors.maxUsage && (
// //               <p className="text-red-500 text-sm">{errors.maxUsage.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Valid From</label>
// //             <Input type="date" {...register("validFrom")} />
// //           </div>

// //           <div>
// //             <label>Valid Till</label>
// //             <Input type="date" {...register("validTill")} />
// //           </div>

// //           <div className="flex justify-end gap-2 pt-4">
// //             <Button variant="outline" type="button" onClick={onClose}>
// //               Cancel
// //             </Button>
// //             <Button type="submit">Update</Button>
// //           </div>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// // import React from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// // } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { axiosInstance } from "@/api/axios/axiosInstance";
// // import API from "@/api/endpoints/endpoint";
// // import { toast } from "sonner";
// // import { format } from "date-fns";

// // const couponSchema = z.object({
// //   couponName: z.string().min(2),
// //   couponCode: z.string().min(2),
// //   maxDiscount: z.coerce.number().positive(),
// //   minValue: z.coerce.number().positive(),
// //   validFrom: z.string(),
// //   validTill: z.string(),
// // //   maxUsage: z.coerce.number().positive(),
// // });

// // type CouponFormValues = z.infer<typeof couponSchema>;

// // interface Props {
// //   coupon: {
// //     id: string;
// //     couponName: string;
// //     couponCode: string;
// //     maxDiscount: number;
// //     minValue: number;
// //     validFrom: { _seconds: number };
// //     validTill: { _seconds: number };
// //     maxUsage: number;
// //   };
// //   onClose: () => void;
// //   onUpdateSuccess: () => void;
// // }

// // export function CouponFormModal({ coupon, onClose, onUpdateSuccess }: Props) {
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //   } = useForm<CouponFormValues>({
// //     resolver: zodResolver(couponSchema),
// //     defaultValues: {
// //       couponName: coupon.couponName,
// //       couponCode: coupon.couponCode,
// //       maxDiscount: coupon.maxDiscount,
// //       minValue: coupon.minValue,
// //       validFrom: format(new Date(coupon.validFrom._seconds * 1000), "yyyy-MM-dd"),
// //       validTill: format(new Date(coupon.validTill._seconds * 1000), "yyyy-MM-dd"),
// //     //   maxUsage: coupon.maxUsage,
// //     },
// //   });

// //   const onSubmit = async (data: CouponFormValues) => {
// //     try {
// //       await axiosInstance.put(API.UPDATE_COUPON(), data,{
// //         params:{
// //             couponId:coupon.id
// //         }
// //       });
// //       toast.success("Coupon updated successfully");
// //       onUpdateSuccess();
// //       onClose();
// //     } catch (error) {
// //       toast.error("Failed to update coupon");
// //     }
// //   };

// //   return (
// //     <Dialog open onOpenChange={onClose}>
// //       <DialogContent className="max-w-md">
// //         <DialogHeader>
// //           <DialogTitle>Edit Coupon</DialogTitle>
// //           <DialogDescription>Update your coupon details below.</DialogDescription>
// //         </DialogHeader>

// //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// //           <div>
// //             <label>Coupon Name</label>
// //             <Input {...register("couponName")} />
// //             {errors.couponName && (
// //               <p className="text-red-500 text-sm">{errors.couponName.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Coupon Code</label>
// //             <Input {...register("couponCode")} />
// //             {errors.couponCode && (
// //               <p className="text-red-500 text-sm">{errors.couponCode.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Max Discount</label>
// //             <Input type="number" {...register("maxDiscount")} />
// //             {errors.maxDiscount && (
// //               <p className="text-red-500 text-sm">{errors.maxDiscount.message}</p>
// //             )}
// //           </div>

// //           <div>
// //             <label>Minimum Order Value</label>
// //             <Input type="number" {...register("minValue")} />
// //             {errors.minValue && (
// //               <p className="text-red-500 text-sm">{errors.minValue.message}</p>
// //             )}
// //           </div>

// //           {/* <div>
// //             <label>Max Usage</label>
// //             <Input type="number" {...register("maxUsage")} />
// //             {errors.maxUsage && (
// //               <p className="text-red-500 text-sm">{errors.maxUsage.message}</p>
// //             )}
// //           </div> */}

// //           <div>
// //             <label>Valid From</label>
// //             <Input type="date" {...register("validFrom")} />
// //           </div>

// //           <div>
// //             <label>Valid Till</label>
// //             <Input type="date" {...register("validTill")} />
// //           </div>

// //           <div className="flex justify-end gap-2 pt-4">
// //             <Button variant="outline" type="button" onClick={onClose}>
// //               Cancel
// //             </Button>
// //             <Button type="submit">Update</Button>
// //           </div>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

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
// import { Switch } from "@/components/ui/switch"; // Make sure this exists
// import { Loader2 } from "lucide-react"; // Optional spinner
// import type { Coupon } from "@/store/slices/couponSlice";
// const couponSchema = z.object({
//   couponName: z.string().min(2),
//   couponCode: z.string().min(2),
//   maxDiscount: z.coerce.number().positive(),
//   minValue: z.coerce.number().positive(),
//   discountPercentage: z.coerce.number().min(1).max(100),
//   validFrom: z.string(),
//   validTill: z.string(),
//   isActive: z.boolean(),
// });

// type CouponFormValues = z.infer<typeof couponSchema>;

// interface Props {
//   coupon: Coupon;
//   onClose: () => void;
//   onUpdateSuccess: () => void;
// }

// export function CouponFormModal({ coupon, onClose, onUpdateSuccess }: Props) {
//   const [loading, setLoading] = React.useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<CouponFormValues>({
//     resolver: zodResolver(couponSchema),
//     defaultValues: {
//       couponName: coupon.couponName,
//       couponCode: coupon.couponCode,
//       maxDiscount: coupon.maxDiscount,
//       minValue: coupon.minValue,
//       discountPercentage: coupon.discountPercentage,
//       validFrom: format(
//         new Date(coupon.validFrom._seconds * 1000),
//         "yyyy-MM-dd"
//       ),
//       validTill: format(
//         new Date(coupon.validTill._seconds * 1000),
//         "yyyy-MM-dd"
//       ),
//       isActive: coupon.isActive,
//     },
//   });

//   const isActive = watch("isActive");

//   const onSubmit = async (data: CouponFormValues) => {
//     console.log(data);
//     setLoading(true);

//     try {
//       await axiosInstance.put(API.UPDATE_COUPON(), data, {
//         params: {
//           couponId: coupon.id,
//         },
//       });
//       toast.success("Coupon updated successfully");
//       onUpdateSuccess();
//       onClose();
//     } catch (error) {
//       toast.error("Failed to update coupon");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Edit Coupon</DialogTitle>
//           <DialogDescription>
//             Update your coupon details below.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label>Coupon Name</label>
//             <Input {...register("couponName")} />
//             {errors.couponName && (
//               <p className="text-red-500 text-sm">
//                 {errors.couponName.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label>Coupon Code</label>
//             <Input {...register("couponCode")} />
//             {errors.couponCode && (
//               <p className="text-red-500 text-sm">
//                 {errors.couponCode.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label>Max Discount</label>
//             <Input type="number" {...register("maxDiscount")} />
//             {errors.maxDiscount && (
//               <p className="text-red-500 text-sm">
//                 {errors.maxDiscount.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label>Discount Percentage</label>
//             <Input type="number" {...register("discountPercentage")} />
//             {errors.discountPercentage && (
//               <p className="text-red-500 text-sm">
//                 {errors.discountPercentage.message}
//               </p>
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
//             {errors.validFrom && (
//               <p className="text-red-500 text-sm">{errors.validFrom.message}</p>
//             )}
//           </div>

//           <div>
//             <label>Valid Till</label>
//             <Input type="date" {...register("validTill")} />
//             {errors.validTill && (
//               <p className="text-red-500 text-sm">{errors.validTill.message}</p>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <label htmlFor="isActive">Active</label>
//             <Switch
//               id="isActive"
//               checked={isActive}
//               onCheckedChange={(val) => setValue("isActive", val)}
//             />
//           </div>

//           <div className="flex justify-end gap-2 pt-4">
//             <Button variant="outline" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
//                 </>
//               ) : (
//                 "Update"
//               )}
//             </Button>
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type { Coupon } from "@/store/slices/couponSlice";

const couponSchema = z.object({
  couponName: z
    .string()
    .min(2, "Coupon name must be at least 2 characters")
    .max(50, "Coupon name must be less than 50 characters"),
  couponCode: z
    .string()
    .min(3, "Coupon code must be at least 2 characters")
    .max(20, "Coupon code must be less than 20 characters"),
  maxDiscount: z
    .coerce
    .number({
      required_error: "Max discount is required",
      invalid_type_error: "Max discount must be a valid number",
    })
    .positive("Max discount must be greater than 0")
    .max(10000, "Max discount cannot exceed 10,000"),
  minValue: z
    .coerce
    .number({
      required_error: "Minimum order value is required",
      invalid_type_error: "Minimum order value must be a valid number",
    })
    .positive("Minimum order value must be greater than 0")
    .max(100000, "Minimum order value cannot exceed 100,000"),
  discountPercentage: z
    .coerce
    .number({
      required_error: "Discount percentage is required",
      invalid_type_error: "Discount percentage must be a valid number",
    })
    .min(1, "Discount percentage must be at least 1%")
    .max(100, "Discount percentage cannot exceed 100%"),
  validFrom: z
    .string()
    .min(1, "Valid from date is required"),
  validTill: z
    .string()
    .min(1, "Valid till date is required"),
  isActive: z.boolean(),
}).refine((data) => {
  const fromDate = new Date(data.validFrom);
  const tillDate = new Date(data.validTill);
  return fromDate < tillDate;
}, {
  message: "Valid till date must be after valid from date",
  path: ["validTill"],
}).refine((data) => {
  // Ensure max discount is reasonable compared to discount percentage
  // For example, if discount is 10% and min order is 100, max discount should be at least 10
  const theoreticalMaxDiscount = (data.minValue * data.discountPercentage) / 100;
  return data.maxDiscount >= theoreticalMaxDiscount * 0.1; // Allow some flexibility
}, {
  message: "Max discount seems too low for the given percentage and minimum order value",
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
    trigger,
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      couponName: coupon.couponName,
      couponCode: coupon.couponCode,
      maxDiscount: coupon.maxDiscount,
      minValue: coupon.minValue,
      discountPercentage: coupon.discountPercentage,
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
    console.log("Submitting coupon data:", data);
    setLoading(true);

    try {
      // Validate dates one more time before submission
      const fromDate = new Date(data.validFrom);
      const tillDate = new Date(data.validTill);
      
      if (fromDate >= tillDate) {
        toast.error("Valid till date must be after valid from date");
        setLoading(false);
        return;
      }

      await axiosInstance.put(API.UPDATE_COUPON(), data, {
        params: {
          couponId: coupon.id,
        },
      });
      
      toast.success("Coupon updated successfully");
      onUpdateSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating coupon:", error);
      const errorMessage = error?.response?.data?.message || "Failed to update coupon";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle number input changes and trigger validation
  const handleNumberInputChange = (fieldName: keyof CouponFormValues) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(fieldName, value as any);
      // Trigger validation for this field
      setTimeout(() => trigger(fieldName), 0);
    };
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
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Name</label>
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

          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code</label>
            <Input 
              {...register("couponCode")} 
              placeholder="e.g., SAVE20"
              style={{ textTransform: 'uppercase' }}
            />
            {errors.couponCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.couponCode.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
            <Input 
              type="number" 
              step="0.01"
              min="0"
              {...register("maxDiscount")}
              onChange={handleNumberInputChange("maxDiscount")}
              placeholder="Maximum discount amount"
            />
            {errors.maxDiscount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxDiscount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Discount Percentage (%)</label>
            <Input 
              type="number" 
              step="0.01"
              min="1"
              max="100"
              {...register("discountPercentage")}
              onChange={handleNumberInputChange("discountPercentage")}
              placeholder="1-100"
            />
            {errors.discountPercentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountPercentage.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Minimum Order Value (₹)</label>
            <Input 
              type="number" 
              step="0.01"
              min="0"
              {...register("minValue")}
              onChange={handleNumberInputChange("minValue")}
              placeholder="Minimum order amount"
            />
            {errors.minValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minValue.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valid From</label>
            <Input 
              type="date" 
              {...register("validFrom")}
              min={format(new Date(), "yyyy-MM-dd")}
            />
            {errors.validFrom && (
              <p className="text-red-500 text-sm mt-1">
                {errors.validFrom.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valid Till</label>
            <Input 
              type="date" 
              {...register("validTill")}
              min={watch("validFrom") || format(new Date(), "yyyy-MM-dd")}
            />
            {errors.validTill && (
              <p className="text-red-500 text-sm mt-1">
                {errors.validTill.message}
              </p>
            )}
          </div>

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

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
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