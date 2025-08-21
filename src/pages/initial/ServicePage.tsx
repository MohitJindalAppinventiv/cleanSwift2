// import React, { useRef } from "react";
// import { toast } from "@/components/ui/sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import axios from "axios";
// import { axiosInstance } from "@/api/axios/axiosInstance";

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

// const formSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   pricingModel: z.string().min(1, "Pricing model is required"),
//   image: z
//     .any()
//     .refine((file) => file instanceof File, "Please upload an image")
//     .refine((file) => file?.size <= MAX_FILE_SIZE, "Max image size is 5MB")
//     .refine(
//       (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
//       "Only .jpg, .jpeg, .png and .webp formats are supported"
//     ),
// });

// type FormValues = z.infer<typeof formSchema>;

// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       const result = reader.result as string;
//       resolve(result);
//     };
//     reader.onerror = (error) => reject(error);
//   });
// };

// export default function SubmitDetailsPage() {

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       pricingModel: "",
//       image: undefined,
//     },
//   });

//   const onSubmit = async (data: FormValues) => {
//     try {
//       const base64Image = await fileToBase64(data.image);

//       const payload = {
//         name: data.name,
//         description: data.description,
//         pricingModel: data.pricingModel,
//         imageBase64: base64Image
//       };

//       await axiosInstance.post(
//         "/createService",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast("Submission Successful", {
//         description: "Your details have been submitted successfully!",
//       });

//       form.reset();
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast("Submission Failed", {
//         description: error.response?.data?.message || "Something went wrong",
//       });
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">
//             Submit Details
//           </CardTitle>
//           <CardDescription className="text-center">
//             Please provide your details and upload an image
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name of Service</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter name of Service"
//                         {...field}
//                         disabled={form.formState.isSubmitting}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter description"
//                         {...field}
//                         disabled={form.formState.isSubmitting}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="pricingModel"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Pricing Model</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger disabled={form.formState.isSubmitting}>
//                           <SelectValue placeholder="Select pricing model" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="per_item">Per Item</SelectItem>
//                         <SelectItem value="per_kg">Per Kg</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="image"
//                 render={({ field: { onChange, value, ...rest } }) => (
//                   <FormItem>
//                     <FormLabel>Image</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="file"
//                         accept={ACCEPTED_IMAGE_TYPES.join(",")}
//                         disabled={form.formState.isSubmitting}
//                         {...rest}
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           onChange(file);
//                         }}
//                         ref={fileInputRef}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={form.formState.isSubmitting}
//               >
//                 {form.formState.isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
//                     Submitting...
//                   </span>
//                 ) : (
//                   "Submit Details"
//                 )}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter className="flex justify-center">
//           <p className="text-sm text-muted-foreground">
//             Supported formats: JPEG, PNG, WEBP (Max 5MB)
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }


import React, { useRef } from "react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { axiosInstance } from "@/api/axios/axiosInstance";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricingModel: z.string().min(1, "Pricing model is required"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Please upload an image")
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max image size is 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

type FormValues = z.infer<typeof formSchema>;

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function SubmitDetailsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      pricingModel: "",
      image: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const base64Image = await fileToBase64(data.image);
      const payload = { ...data, imageBase64: base64Image };

      await axiosInstance.post("/createService", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast("✅ Submission Successful", {
        description: "Your details have been submitted successfully!",
      });

      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      console.error("Submission error:", error);
      toast("❌ Submission Failed", {
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <Card className="w-full max-w-lg shadow-xl rounded-2xl border border-gray-200">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Submit Details
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Fill out the form below and upload an image
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Service Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the service name"
                        className="rounded-xl"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a short description"
                        className="rounded-xl"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pricing Model */}
              <FormField
                control={form.control}
                name="pricingModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Pricing Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl" disabled={form.formState.isSubmitting}>
                          <SelectValue placeholder="Select pricing model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl shadow-md">
                        <SelectItem value="per_item">Per Item</SelectItem>
                        <SelectItem value="per_kg">Per Kg</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        className="cursor-pointer rounded-xl file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/90"
                        disabled={form.formState.isSubmitting}
                        {...rest}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                        }}
                        ref={fileInputRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Submitting...
                  </span>
                ) : (
                  "Submit Details"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Supported formats: <span className="ml-1 font-medium">JPEG, PNG, WEBP (Max 5MB)</span>
        </CardFooter>
      </Card>
    </div>
  );
}
