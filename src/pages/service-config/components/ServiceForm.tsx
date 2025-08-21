import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import { FileImage, Upload, X } from "lucide-react";
import { Service } from "../types";

// Form schema validation
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  pricingmodel: z.enum(["per_kg", "per_item"], { 
    message: "Pricing model is required" 
  }),
  status: z.enum(["active", "inactive"]),
  imageBase64: z.string().min(1, { message: "Image is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  service: Partial<Service>;
  isLoading?: boolean;
  fileInputKey: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: "active" | "inactive") => void;
  handlePricingModelChange: (value: "per_kg" | "per_item") => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveThumbnail: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  isLoading = false,
  fileInputKey,
  handleInputChange,
  handleStatusChange,
  handlePricingModelChange,
  handleFileChange,
  handleRemoveThumbnail,
  handleSubmit,
  handleCancel,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [initialFormData, setInitialFormData] = React.useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service.name || "",
      description: service.description || "",
      pricingmodel: service.pricingmodel || "per_kg",
      status: service.status || "active",
      imageBase64: service.imageBase64 || "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Set initial form data when component mounts
  React.useEffect(() => {
    if (service && !initialFormData) {
      const initialData = {
        name: service.name || "",
        description: service.description || "",
        pricingmodel: service.pricingmodel || "per_kg",
        status: service.status || "active",
        imageBase64: service.imageBase64 || "",
      };
      setInitialFormData(initialData);
    }
  }, [service, initialFormData]);

  // Check for changes whenever form values change
  React.useEffect(() => {
    if (initialFormData) {
      const currentValues = form.getValues();
      const hasFormChanged = 
        currentValues.name !== initialFormData.name ||
        currentValues.description !== initialFormData.description ||
        currentValues.pricingmodel !== initialFormData.pricingmodel ||
        currentValues.status !== initialFormData.status ||
        currentValues.imageBase64 !== initialFormData.imageBase64;
      
      setHasChanges(hasFormChanged);
    }
  }, [form.watch(), initialFormData]);

  // Update form values when service changes
  React.useEffect(() => {
    if (service) {
      form.reset({
        name: service.name || "",
        description: service.description || "",
        pricingmodel: service.pricingmodel || "per_kg",
        status: service.status || "active",
        imageBase64: service.imageBase64 || "",
      });
    }
  }, [service, form]);

  const handleFileUpload = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type. Please upload a PNG, JPG, or WebP image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      form.setValue("imageBase64", base64Data, { shouldValidate: true });
      handleInputChange({
        target: { name: "imageBase64", value: base64Data },
      } as React.ChangeEvent<HTMLInputElement>);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleFileUpload(file);
      } else {
        console.error("Invalid file type. Please upload an image file");
      }
    }
  };

  const removeImage = () => {
    form.setValue("imageBase64", "", { shouldValidate: true });
    handleRemoveThumbnail();
  };

  const onSubmit = (data: FormValues) => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    
    Object.entries(data).forEach(([key, value]) => {
      handleInputChange({
        target: { name: key, value },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    handleSubmit(syntheticEvent);
  };

  // Check if image field has error
  const imageError = form.formState.errors.imageBase64;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter service name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
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
                      placeholder="Enter service description"
                      className="min-h-[120px]"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricingmodel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <Select
                    onValueChange={(value: "per_kg" | "per_item") => {
                      field.onChange(value);
                      handlePricingModelChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="per_kg">Per KG</SelectItem>
                      <SelectItem value="per_item">Per Item</SelectItem>
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value === "active"
                        ? "Service is active and visible to customers"
                        : "Service is inactive and hidden from customers"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "active"}
                      onCheckedChange={(checked) => {
                        const value = checked ? "active" as const : "inactive" as const;
                        field.onChange(value);
                        handleStatusChange(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Service Image :
              </label>
              <div className="text-sm font-medium mb-2">Image Preview</div>
              
              <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                {form.watch("imageBase64") ? (
                  <>
                    <div className="relative h-full w-full">
                      <img
                        src={form.watch("imageBase64")}
                        alt="Service preview"
                        className="h-full w-full object-cover"
                        onError={() => {
                          removeImage();
                          console.error("Error loading image");
                        }}
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 rounded-full bg-gray-800/50 hover:bg-gray-800/75 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className={`flex h-full flex-col items-center justify-center cursor-pointer ${
                      isDragOver
                        ? "border-primary border-2"
                        : "border-dashed border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <div className="text-center p-6 flex flex-col items-center gap-2">
                      <div className="bg-gray-100 rounded-full p-3">
                        <FileImage className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">
                        Upload a service image
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag and drop or click to browse
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById("image-upload")?.click();
                        }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  key={fileInputKey}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                      handleFileChange(e);
                    }
                  }}
                />
              </div>
              
              {/* Error message with red color */}
              {imageError && (
                <p className="text-sm text-destructive mt-1">
                  {imageError.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading} // Disable during API loading
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid || !hasChanges}
          >
            {isLoading ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;