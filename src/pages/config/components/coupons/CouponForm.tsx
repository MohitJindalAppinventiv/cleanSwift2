import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint"; // Adjust this path as needed
import { Loader2 } from "lucide-react";
import { set } from "date-fns";

// const formSchema = z.object({
//   code: z.string().min(3).max(20),
//   couponName: z.string().min(3).max(50),
//   maxDiscount: z.coerce.number().min(1),
//   validFrom: z.string().nonempty(),
//   validUntil: z.string().nonempty(),
//   minOrderValue: z.coerce.number().min(100),
//   isActive: z.boolean().default(true),
//   discountPercentage: z.coerce.number().min(1).max(100),
//   // maxUsage: z.coerce.number().min(1, "Must allow at least 1 use"), // ✅ New field
// });

// const formSchema = z
//   .object({
//     code: z
//       .string()
//       .min(3)
//       .max(20)
//       .regex(/^[A-Z0-9]+$/, "Coupon code must contain only uppercase letters and numbers"),
//     couponName: z.string().min(3).max(50),
//     maxDiscount: z.coerce
//       .number()
//       .min(1, "Maximum discount must be at least 1"),
//     minOrderValue: z.coerce
//       .number()
//       .min(100, "Minimum order value must be at least 100"),
//     validFrom: z.string().nonempty(),
//     validUntil: z.string().nonempty(),
//     isActive: z.boolean().default(true),
//     discountPercentage: z.coerce.number().min(1).max(100),
//   })
//   .refine((data) => data.maxDiscount <= data.minOrderValue, {
//     message: "Maximum discount cannot be greater than minimum order value",
//     path: ["maxDiscount"], // This will attach the error to maxDiscount field
//   });


// type FormValues = z.infer<typeof formSchema>;

// export function CouponForm() {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       code: "",
//       couponName: "",
//       maxDiscount: 100,
//       validFrom: new Date().toISOString().split("T")[0],
//       validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3))
//         .toISOString()
//         .split("T")[0],
//       minOrderValue: 0,
//       isActive: true,
//       discountPercentage: 10,
//     },
//   });

//     const onSubmit = async (data: FormValues) => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.post(API.CREATE_COUPON(), {
//         couponCode: data.code,
//         couponName: data.couponName,
//         maxDiscount: data.maxDiscount,
//         minValue: data.minOrderValue,
//         validFrom: data.validFrom,
//         validTill: data.validUntil,
//         isActive: data.isActive,
//         discountPercentage: data.discountPercentage,
//       });

//       toast({
//         title: "Coupon created successfully",
//         description: `Coupon ${data.code} has been created.`,
//       });

//       navigate("/config/coupons");
//     } catch (error) {
//       console.error(error);
//       toast({
//         title: "Error",
//         description: "Failed to create coupon.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormField
//             control={form.control}
//             name="code"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Coupon Code</FormLabel>
//                 <FormControl>
//                   <Input placeholder="SUMMER20" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Enter a unique code for this coupon
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="couponName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Coupon Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Summer Sale 20% Off" {...field} />
//                 </FormControl>
//                 <FormDescription>Internal name for the coupon</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="maxDiscount"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Maximum Discount</FormLabel>
//                 <FormControl>
//                   <Input type="number" {...field} />
//                 </FormControl>
//                 <FormDescription>Maximum Discount to apply</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="validFrom"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Valid From</FormLabel>
//                 <FormControl>
//                   <Input type="date" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="validUntil"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Valid Until</FormLabel>
//                 <FormControl>
//                   <Input type="date" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="minOrderValue"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Minimum Order Value</FormLabel>
//                 <FormControl>
//                   <Input type="number" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Minimum order value required to use this coupon
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="isActive"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <FormLabel className="text-base">Active Status</FormLabel>
//                   <FormDescription>
//                     Enable or disable this coupon
//                   </FormDescription>
//                 </div>
//                 <FormControl>
//                   <Switch
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="discountPercentage"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Discount Percentage</FormLabel>
//                 <FormControl>
//                   <Input type="number" {...field} />
//                 </FormControl>
//                 <FormDescription>Discount Percentage</FormDescription>
//                 <FormControl />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex justify-end gap-4">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => navigate("/config/coupons")}
//             disabled={loading} // ✅ disable cancel while loading
//           >
//             Cancel
//           </Button>
//           <Button type="submit" disabled={loading}>
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               "Save Coupon"
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }


const formSchema = z
  .object({
    code: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[A-Z0-9]+$/, "Coupon code must contain only uppercase letters and numbers"),
    couponName: z.string().min(3).max(50),
    maxDiscount: z.coerce
      .number()
      .min(1, "Maximum discount must be at least 1"),
    minOrderValue: z.coerce
      .number()
      .min(100, "Minimum order value must be at least 100"),
    validUntil: z.string().nonempty(),
    isActive: z.boolean().default(true),
    discountPercentage: z.coerce.number().min(1).max(100),
  })
  .refine((data) => data.maxDiscount <= data.minOrderValue, {
    message: "Maximum discount cannot be greater than minimum order value",
    path: ["maxDiscount"],
  });

type FormValues = z.infer<typeof formSchema>;

export function CouponForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      couponName: "",
      maxDiscount: 100,
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3))
        .toISOString()
        .split("T")[0],
      minOrderValue: 0,
      isActive: true,
      discountPercentage: 10,
    },
  });

  const { setFocus } = form;


  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(API.CREATE_COUPON(), {
        couponCode: data.code,
        couponName: data.couponName,
        maxDiscount: data.maxDiscount,
        minValue: data.minOrderValue,
        validTill: data.validUntil,
        isActive: data.isActive,
        discountPercentage: data.discountPercentage,
      });

      toast({
        title: "Coupon created successfully",
        description: `Coupon ${data.code} has been created.`,
      });

      navigate("/config/coupons");
    } catch (error) {
      console.error(error);
      if(error.response.data.message==="Coupon with this code already exists"){
          setFocus("code")
      }
      else if(error.response.data.message==="Coupon with this name already exists"){
        setFocus("couponName");
      }
      toast({
        title: "Error",
        description: `${error.response.data.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coupon Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input placeholder="SUMMER20" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a unique code for this coupon
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coupon Name */}
          <FormField
            control={form.control}
            name="couponName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Name</FormLabel>
                <FormControl>
                  <Input placeholder="Summer Sale 20% Off" {...field} />
                </FormControl>
                <FormDescription>Internal name for the coupon</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Max Discount */}
          <FormField
            control={form.control}
            name="maxDiscount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Discount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Maximum Discount to apply</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valid Until */}
          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Until</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Min Order Value */}
          <FormField
            control={form.control}
            name="minOrderValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Order Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Minimum order value required to use this coupon
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Enable or disable this coupon
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Discount Percentage */}
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Discount Percentage</FormDescription>
                <FormControl />
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/config/coupons")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Coupon"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
