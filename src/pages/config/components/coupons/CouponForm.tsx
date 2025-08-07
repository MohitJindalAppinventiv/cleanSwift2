
import React from "react";
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

const formSchema = z.object({
  code: z.string().min(3).max(20),
  couponName: z.string().min(3).max(50),
  maxDiscount: z.coerce.number().min(1),
  validFrom: z.string().nonempty(),
  validUntil: z.string().nonempty(),
  minOrderValue: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
  discountPercentage: z.coerce.number().min(1).max(100),
  // maxUsage: z.coerce.number().min(1, "Must allow at least 1 use"), // ✅ New field
});

type FormValues = z.infer<typeof formSchema>;

export function CouponForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      couponName: "",
      maxDiscount: 100,
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3))
        .toISOString()
        .split("T")[0],
      minOrderValue: 0,
      isActive: true,
      discountPercentage: 10,
      // maxUsage: 1, // ✅ New field
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await axiosInstance.post(API.CREATE_COUPON(), {
        couponCode: data.code,
        couponName: data.couponName,
        maxDiscount: data.maxDiscount,
        minValue: data.minOrderValue,
        validFrom: data.validFrom,
        validTill: data.validUntil,
        isActive: data.isActive,
        discountPercentage:data.discountPercentage
        // maxUsage: data.maxUsage, // ✅ Added here
      });
      console.log("response in create coupon",res);

      toast({
        title: "Coupon created successfully",
        description: `Coupon ${data.code} has been created.`,
      });

      navigate("/config/coupons");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create coupon.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Discount Percentage
                </FormDescription>
                <FormControl />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/config/coupons")}
          >
            Cancel
          </Button>
          <Button type="submit">Save Coupon</Button>
        </div>
      </form>
    </Form>
  );
}
