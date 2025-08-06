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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "./types";

const baseCategorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const categorySchemaWithService = baseCategorySchema.extend({
  serviceId: z.string().min(1, { message: "Please select a service." }),
});

const categorySchemaWithoutService = baseCategorySchema.extend({
  serviceId: z.string().optional(),
});

interface CategoryFormProps {
  onSubmit: (data: { name: string; serviceId?: string; isActive?: boolean }) => void;
  onCancel: () => void;
  initialData?: Partial<{ name: string; serviceId?: string; isActive?: boolean }>;
  services?: Service[];
}

export function CategoryForm({ onSubmit, onCancel, initialData, services }: CategoryFormProps) {
  const categorySchema = services && services.length > 0 ? categorySchemaWithService : categorySchemaWithoutService;

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: "",
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      serviceId: initialData?.serviceId || (services && services.length > 0 ? services[0].id : ""),
    },
  });

  const handleSubmit = (data: z.infer<typeof categorySchema>) => {
    onSubmit({
      name: data.name,
      serviceId: data.serviceId,
      isActive: data.isActive
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed to users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {services && services.length > 0 && (
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
                  Select the service associated with this category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Set whether this category should be active or inactive.
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
          <Button type="submit">Save Category</Button>
        </div>
      </form>
    </Form>
  );
}