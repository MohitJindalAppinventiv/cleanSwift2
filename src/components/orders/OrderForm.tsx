
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Order, ServiceType, OrderStatus } from "../dashboard/orders/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  customer: z.string().min(1, "Customer name is required"),
  service: z.enum(["wash_fold", "dry_clean", "express"], {
    required_error: "Service type is required",
  }),
  status: z.enum(["new", "processing", "pickup", "delivered", "completed"], {
    required_error: "Status is required",
  }),
  orderDate: z.date({
    required_error: "Order date is required",
  }),
  address: z.string().min(1, "Address is required"),
  total: z.string().min(1, "Total amount is required").refine(
    (value) => !isNaN(Number(value)) && Number(value) > 0, 
    "Total amount must be a positive number"
  ),
  items: z.string().min(1, "Order items are required"),
});

// Only include the fields that we actually collect in the form
type OrderFormData = {
  customer: string;
  service: ServiceType;
  status: OrderStatus;
  address: string;
  total: number;
  items: string;
};

type FormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<FormValues>;
}

export const OrderForm = ({ 
  onSubmit, 
  isSubmitting,
  defaultValues = {
    customer: "",
    service: "wash_fold" as ServiceType,
    status: "new" as OrderStatus,
    address: "",
    total: "",
    items: "",
    orderDate: new Date(),
  }
}: OrderFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    // Extract orderDate from values, but ensure all required fields are explicitly passed
    const { orderDate, ...restValues } = values;
    
    // Create an explicit object with required fields to satisfy TypeScript
    const formData: OrderFormData = {
      customer: restValues.customer,
      service: restValues.service,
      status: restValues.status,
      address: restValues.address,
      total: parseFloat(restValues.total),
      items: restValues.items
    };
    
    // Submit the data with all required fields
    onSubmit(formData);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="wash_fold">Wash & Fold</SelectItem>
                        <SelectItem value="dry_clean">Dry Clean</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New Order</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="pickup">Out for Pickup</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Order Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter amount" 
                        {...field} 
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter delivery address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Items</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter order items" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
