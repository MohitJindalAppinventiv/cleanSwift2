
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppBanner } from "../../types/banner";
import { FileImage, Upload } from "lucide-react";

// Form schema validation
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(50, { message: "Title must be less than 50 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(200, { message: "Description must be less than 200 characters" }),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface BannerFormProps {
  onSave: (banner: Omit<AppBanner, "id" | "createdAt">) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<FormValues>;
}

export function BannerForm({ onSave, isSubmitting = false, defaultValues }: BannerFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>(defaultValues?.imageUrl || "");
  const [isDragOver, setIsDragOver] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      imageUrl: defaultValues?.imageUrl || "",
      isActive: defaultValues?.isActive === undefined ? true : defaultValues.isActive,
    },
  });

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    form.setValue("imageUrl", url);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      // Since we're using local FileReader for preview, we'll set a placeholder URL
      // In a real app, this would be the URL after uploading to a server
      form.setValue("imageUrl", "https://example.com/placeholder-image-url");
      toast({
        title: "Image selected",
        description: "Your image has been selected for preview. Save to upload.",
      });
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
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = (values: FormValues) => {
    onSave({
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      isActive: values.isActive,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter banner title" {...field} />
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
                      placeholder="Enter banner description" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Make this banner visible in the app
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <div className="text-sm font-medium">Image Preview</div>
            <div 
              className={`aspect-[16/9] overflow-hidden rounded-md border ${isDragOver ? 'border-primary border-2' : 'border-dashed border-gray-300'} bg-gray-50 flex flex-col items-center justify-center cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Banner preview"
                  className="h-full w-full object-cover"
                  onError={() => {
                    setImagePreview("");
                    toast({
                      title: "Error loading image",
                      description: "Please check the URL and try again",
                      variant: "destructive",
                    });
                  }}
                />
              ) : (
                <div className="text-center p-6 flex flex-col items-center gap-2">
                  <div className="bg-gray-100 rounded-full p-3">
                    <FileImage className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Upload an image or enter a URL</p>
                  <p className="text-xs text-gray-500">Drag and drop or click to browse</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
            {imagePreview && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setImagePreview("");
                  form.setValue("imageUrl", "");
                }}
              >
                Remove Image
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/config/app-banner")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Banner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
