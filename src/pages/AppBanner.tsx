// import React, { useRef } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { toast } from "@/components/ui/sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
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
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "@/hooks/redux";
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

// const formSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
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

// // Utility function to convert File to base64
// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       const result = reader.result as string;
//       // Remove the data URL prefix if needed (just the base64 part)
//       const base64String = result
//       resolve(base64String);
//     };
//     reader.onerror = (error) => reject(error);
//   });
// };

// export default function SubmitDetailsPage() {
//   const profileComplete=useAppSelector((state)=>state.profileStatus.data);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       image: undefined,
//     },
//   });

//   const onSubmit = async (data: FormValues) => {
//     try {
//       // Convert image to base64
//       const base64Image = await fileToBase64(data.image);

//       // Prepare the request payload
//       const payload = {
//         title: data.title,
//         description: data.description,
//         fileBase64Image: base64Image,
//       };

//       // Make API request
//       const response = await axios.post(
//         "https://us-central1-laundry-app-dee6a.cloudfunctions.net/createAppBanner",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Show success message
//       toast("Submission Successful", {
//         description: "Your details have been submitted successfully!",
//       });

//       // Reset form
//       form.reset();
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }

//       if(profileComplete.configurations.area.isConfigured && profileComplete.configurations.service.isConfigured){
//         navigate("/");
//       }
//       else if(profileComplete.configurations.area.isConfigured){
//         navigate("/Serv")
//       }
//       else{
//         navigate("/area-config");
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
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Title</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter title"
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



// import React, { useEffect, useRef, useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { toast } from "@/components/ui/sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
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
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "@/hooks/redux";

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// const formSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
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

// type Banner = {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
// };

// // Utility to convert File to base64
// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });
// };

// export default function SubmitDetailsPage() {
//   const profileComplete = useAppSelector((state) => state.profileStatus.data);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();
//   const [banners, setBanners] = useState<Banner[]>([]);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       image: undefined,
//     },
//   });

//   const fetchBanners = async () => {
//     try {
//       const res = await axios.get(
//         "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAppBanners"
//       );
//       setBanners(res.data.banners || []);
//     } catch (error) {
//       console.error("Failed to fetch banners", error);
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const onSubmit = async (data: FormValues) => {
//     try {
//       const base64Image = await fileToBase64(data.image);

//       const payload = {
//         title: data.title,
//         description: data.description,
//         fileBase64Image: base64Image,
//       };

//       const response = await axios.post(
//         "https://us-central1-laundry-app-dee6a.cloudfunctions.net/createAppBanner",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast("Submission Successful", {
//         description: "Your banner was added successfully!",
//       });

//       form.reset();
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }

//       // Add the new banner to the list
//       fetchBanners();

//       if (profileComplete.configurations.area.isConfigured && profileComplete.configurations.service.isConfigured) {
//         navigate("/");
//       } else if (profileComplete.configurations.area.isConfigured) {
//         navigate("/Serv");
//       } else {
//         navigate("/area-config");
//       }
//     } catch (error: any) {
//       toast("Submission Failed", {
//         description: error?.response?.data?.message || "Something went wrong",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4 space-y-10">
//       <div className="flex justify-center">
//         <Card className="w-full max-w-md">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">
//               Submit Banner
//             </CardTitle>
//             <CardDescription className="text-center">
//               Provide details and upload an image for the banner
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="title"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Title</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter title"
//                           {...field}
//                           disabled={form.formState.isSubmitting}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter description"
//                           {...field}
//                           disabled={form.formState.isSubmitting}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="image"
//                   render={({ field: { onChange, value, ...rest } }) => (
//                     <FormItem>
//                       <FormLabel>Image</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept={ACCEPTED_IMAGE_TYPES.join(",")}
//                           disabled={form.formState.isSubmitting}
//                           {...rest}
//                           onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             onChange(file);
//                           }}
//                           ref={fileInputRef}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={form.formState.isSubmitting}
//                 >
//                   {form.formState.isSubmitting ? "Submitting..." : "Submit Banner"}
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//           <CardFooter className="flex justify-center">
//             <p className="text-sm text-muted-foreground">
//               Supported: JPEG, PNG, WEBP (Max 5MB)
//             </p>
//           </CardFooter>
//         </Card>
//       </div>

//       <div className="max-w-5xl mx-auto">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">All Banners</h2>
//         {banners.length === 0 ? (
//           <p className="text-gray-500">No banners available</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {banners.map((banner) => (
//               <Card key={banner.id}>
//                 <img
//                   src={banner.imageUrl}
//                   alt={banner.title}
//                   className="w-full h-40 object-cover rounded-t-md"
//                 />
//                 <CardContent>
//                   <h3 className="font-bold text-lg">{banner.title}</h3>
//                   <p className="text-sm text-gray-600">{banner.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
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

type Banner = {
  bannerId: string;
  title: string;
  description: string;
  imageUrl: string;
};

// Utility to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function SubmitDetailsPage() {
  const profileComplete = useAppSelector((state) => state.profileStatus.data);
  console.log("Profile complete",profileComplete)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllAppBanner"
      );
    //   console.log(res);
      setBanners(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      const base64Image = await fileToBase64(data.image);

      const payload = {
        title: data.title,
        description: data.description,
        fileBase64Image: base64Image,
      };

      const response = await axios.post(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/createAppBanner",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast("Submission Successful", {
        description: "Your banner was added successfully!",
      });

      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Add the new banner to the list
      fetchBanners();

      if (profileComplete.configurations.area.isConfigured && profileComplete.configurations.service.isConfigured) {
        navigate("/");
      } else if (profileComplete.configurations.area.isConfigured) {
        navigate("/Serv");
      } else {
        navigate("/area-config");
      }
    } catch (error: any) {
      toast("Submission Failed", {
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 space-y-10">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Submit Banner
            </CardTitle>
            <CardDescription className="text-center">
              Provide details and upload an image for the banner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title"
                          {...field}
                          disabled={form.formState.isSubmitting}
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
                        <Input
                          placeholder="Enter description"
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Banner"}
                </Button>
                        <Button
          onClick={() => navigate("/")}
          disabled={banners.length === 0}
          className=" w-full px-6 py-2 text-white bg-green-600 hover:bg-green-700"
        >
          Complete
        </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Supported: JPEG, PNG, WEBP (Max 5MB)
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* <h2 className="text-xl font-semibold mb-4 text-gray-700">All Banners</h2>
        {banners.length === 0 ? (
          <p className="text-gray-500">No banners available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <Card key={banner.bannerId}>
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-40 object-cover rounded-t-md"
                />
                <CardContent>
                  <h3 className="font-bold text-lg">{banner.title}</h3>
                  <p className="text-sm text-gray-600">{banner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )} */}
              <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">All Banners</h2>
        {banners.length === 0 ? (
          <p className="text-gray-500">No banners available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <Card key={banner.bannerId}>
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-40 object-cover rounded-t-md"
                />
                <CardContent>
                  <h3 className="font-bold text-lg">{banner.title}</h3>
                  <p className="text-sm text-gray-600">{banner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}