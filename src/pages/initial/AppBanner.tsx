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
// import { axiosInstance } from "@/api/axios/axiosInstance";

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
//   bannerId: string;
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
//       const res = await axiosInstance.get(
//         "/getAllAppBanner"
//       );
//       setBanners(res.data.data || []);
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

//       const response = await axiosInstance.post(
//         "/createAppBanner",
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

//     } catch (err) {
//             const error = err as { response?: { data?: { message?: string } } };

//       toast("Submission Failed", {
//         description: error?.response?.data?.message || "Something went wrong",
//       });
//     }
//   };
//   const handleNavigate=()=>{
//       if (profileComplete.configurations.area.isConfigured && profileComplete.configurations.service.isConfigured) {
//         navigate("/");
//       } else if (profileComplete.configurations.area.isConfigured) {
//         navigate("/Serv");
//       } else {
//         navigate("/area-config");
//       }
//   }

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
//                 <Button
//                   onClick={handleNavigate}
//                   disabled={banners.length === 0}
//                   className="w-full px-6 py-2 text-white bg-green-600 hover:bg-green-700"
//                 >
//                   Complete
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
//               <Card key={banner.bannerId}>
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
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { useAppDispatch } from "@/store/hooks";
import { updateConfigStatus } from "@/store/slices/profileStatus";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const dispatch=useAppDispatch();

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
      const res = await axiosInstance.get("/getAllAppBanner");
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

      await axiosInstance.post("/createAppBanner", payload, {
        headers: { "Content-Type": "application/json" },
      });
      
      
      toast("✅ Submission Successful", {
        description: "Your banner was added successfully!",
      });
      
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchBanners();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast("❌ Submission Failed", {
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };
  
  const handleNavigate = () => {
    dispatch(updateConfigStatus({ key: "banner", value: true }));
    if (
      profileComplete.configurations.area.isConfigured &&
      profileComplete.configurations.service.isConfigured
    ) {
      navigate("/");
    } else if (profileComplete.configurations.area.isConfigured) {
      navigate("/Serv");
    } else {
      navigate("/area-config");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 space-y-10">
      {/* Banner Form */}
      <div className="flex justify-center">
        <Card className="w-full max-w-lg shadow-lg rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Submit Banner</CardTitle>
            <CardDescription>
              Provide details and upload an image for the banner
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title"
                          {...field}
                          disabled={form.formState.isSubmitting}
                          className="rounded-xl"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter description"
                          {...field}
                          disabled={form.formState.isSubmitting}
                          className="rounded-xl"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Image</FormLabel>
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
                          className="rounded-xl"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          disabled={form.formState.isSubmitting}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file); // store file in RHF
                            }
                          }}
                          ref={fileInputRef}
                          className="rounded-xl"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-xl shadow-md"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Submitting..."
                    : "Submit Banner"}
                </Button>

                <Button
                  type="button"
                  onClick={handleNavigate}
                  disabled={banners.length === 0}
                  className="w-full rounded-xl shadow-md bg-green-600 hover:bg-green-700"
                >
                  Complete
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Supported: JPEG, PNG, WEBP (Max 5MB)
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Banner List */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          All Banners
        </h2>
        {banners.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            No banners available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <Card
                key={banner.bannerId}
                className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 rounded-2xl"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    {banner.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {banner.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
