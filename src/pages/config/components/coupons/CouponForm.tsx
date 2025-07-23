
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

const formSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(20, "Code cannot exceed 20 characters"),
  discountPercentage: z.coerce.number().min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  validFrom: z.string().nonempty("Valid from date is required"),
  validUntil: z.string().nonempty("Valid until date is required"),
  minOrderValue: z.coerce.number().min(0, "Minimum order value cannot be negative"),
  maxUsage: z.coerce.number().int().min(1, "Maximum usage must be at least 1"),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function CouponForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discountPercentage: 10,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      minOrderValue: 0,
      maxUsage: 100,
      isActive: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Simulate adding a coupon
    console.log("Form submitted:", data);
    
    // Show success toast
    toast({
      title: "Coupon created successfully",
      description: `Coupon ${data.code} has been created.`,
    });
    
    // Navigate back to coupons list
    navigate("/config/coupons");
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
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Percentage discount to apply
                </FormDescription>
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
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Usage</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Maximum number of times this coupon can be used
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
