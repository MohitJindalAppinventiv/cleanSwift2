import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Service, CategoryFormValues } from "./types";

const baseCategorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  serviceId: z.string().optional(), // ADDED: serviceId to base schema
});

const categorySchemaWithService = baseCategorySchema.extend({
  serviceId: z.string().min(1, { message: "Please select a service." }),
});

const categorySchemaWithoutService = baseCategorySchema.extend({
  serviceId: z.string().optional(),
});

interface CategoryFormProps {
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CategoryFormValues>;
  services?: Service[];
  isSubmitting?: boolean;
}

export function CategoryForm({ onSubmit, onCancel, initialData, services, isSubmitting = false }: CategoryFormProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [initialFormData, setInitialFormData] = useState<z.infer<typeof baseCategorySchema> | null>(null);

  const categorySchema = services && services.length > 0 ? categorySchemaWithService : categorySchemaWithoutService;

  const form = useForm<z.infer<typeof categorySchema>>({
  resolver: zodResolver(categorySchema),
  mode: "onChange",   // ✅ so isValid updates live
  defaultValues: {
    name: initialData?.name || "",
    description: "",
    serviceId: initialData?.serviceId || (services && services.length > 0 ? services[0].id : ""),
  },
});


  // Set initial form data when component mounts
  useEffect(() => {
    if (initialData && !initialFormData) {
      const initialFormValues: z.infer<typeof baseCategorySchema> = {
        name: initialData.name || "",
        description: "",
        serviceId: initialData.serviceId || (services && services.length > 0 ? services[0].id : ""),
      };
      setInitialFormData(initialFormValues);
    }
  }, [initialData, initialFormData, services]);

  // Check for changes whenever form values change
 const watchedValues = form.watch();

useEffect(() => {
  if (initialFormData) {
    const hasFormChanged =
      watchedValues.name !== initialFormData.name ||
      watchedValues.serviceId !== initialFormData.serviceId;

    setHasChanges(hasFormChanged);
  } else {
    // When adding new category (no initialData)
    setHasChanges(!!watchedValues.name || !!watchedValues.serviceId);
  }
}, [watchedValues, initialFormData]);


  const handleSubmit = async (data: z.infer<typeof categorySchema>) => {
    await onSubmit({
      name: data.name,
      serviceId: data.serviceId,
    });
  };

  const isSaveDisabled = isSubmitting || !form.formState.isValid || !hasChanges;

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

        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaveDisabled}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Category"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}