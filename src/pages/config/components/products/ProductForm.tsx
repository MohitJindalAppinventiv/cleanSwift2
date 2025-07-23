import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0." }),
  discountPrice: z.coerce
    .number()
    .min(0, { message: "Discount price cannot be negative." })
    .optional(),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  serviceId: z.string().min(1, { message: "Please select a service." }),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional(),
}).refine((data) => {
  // If discount price is provided, it should be less than the regular price
  if (data.discountPrice !== undefined && data.price && data.discountPrice >= data.price) {
    return false;
  }
  return true;
}, {
  message: "Discount price must be less than regular price.",
  path: ["discountPrice"], // This tells Zod to show the error on the discountPrice field
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<ProductFormValues>;
  categories: Array<{ id: string; name: string }>;
  services: Array<{ id: string; name: string }>;
}

export function ProductForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  categories,
  services 
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      discountPrice: initialData?.discountPrice || undefined,
      categoryId: initialData?.categoryId || "",
      serviceId: initialData?.serviceId || "",
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed to users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? "" : parseFloat(value));
                  }}
                />
              </FormControl>
              <FormDescription>
                The price of the product in USD.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : parseFloat(value));
                  }}
                />
              </FormControl>
              <FormDescription>
                Optional. The discounted price of the product in USD.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description (optional)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of the product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Service</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the service this product belongs to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the category this product belongs to.
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
                <FormLabel className="text-base">Status</FormLabel>
                <FormDescription>
                  Set whether this product should be active or inactive.
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

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </Form>
  );
}
