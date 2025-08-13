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
import { FileImage, Upload, X } from "lucide-react";

// Form schema validation
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(50),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(200),
  imageUrl: z.string().min(1, { message: "Image is required" }),
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
  const [isFileUpload, setIsFileUpload] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      imageUrl: defaultValues?.imageUrl || "",
      isActive: defaultValues?.isActive ?? true,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    form.setValue("imageUrl", url, { shouldValidate: true }); // Trigger validation
    setIsFileUpload(false);
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG or JPG image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      setImagePreview(base64Data);
      form.setValue("imageUrl", base64Data, { shouldValidate: true }); // Trigger validation
      setIsFileUpload(true);
      toast({
        title: "Image selected",
        description: "Your image has been prepared for upload",
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

  const removeImage = () => {
    setImagePreview("");
    form.setValue("imageUrl", "", { shouldValidate: true }); // Trigger validation
    setIsFileUpload(false);
  };

  const onSubmit = (values: FormValues) => {
    try {
      const bannerData = {
        title: values.title,
        description: values.description,
        imageUrl: isFileUpload ? values.imageUrl : values.imageUrl,
        isActive: values.isActive,
      };
      onSave(bannerData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save banner",
        variant: "destructive",
      });
    }
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
                  <FormLabel>Image {isFileUpload ? "File" : "URL"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isFileUpload ? "Image file selected" : "https://example.com/image.jpg"}
                      {...field}
                      onChange={(e) => !isFileUpload && handleImageUrlChange(e.target.value)}
                      disabled={isFileUpload}
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
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border bg-gray-50">
              {imagePreview ? (
                <>
                  <div className="relative h-full w-full">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="h-full w-full object-cover"
                      onError={() => {
                        removeImage();
                        toast({
                          title: "Error loading image",
                          description: "Please check the image and try again",
                          variant: "destructive",
                        });
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
                    isDragOver ? 'border-primary border-2' : 'border-dashed border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <div className="text-center p-6 flex flex-col items-center gap-2">
                    <div className="bg-gray-100 rounded-full p-3">
                      <FileImage className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">Upload an image or enter a URL</p>
                    <p className="text-xs text-gray-500">Drag and drop or click to browse</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('image-upload')?.click();
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
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>

            {imagePreview && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                >
                  Remove Image
                </Button>
              </div>
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
          <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
            {isSubmitting ? "Saving..." : "Save Banner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}