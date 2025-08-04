// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   GoogleMap,
//   Marker,
//   StandaloneSearchBox,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import API from "@/api/endpoints/endpoint";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "@/hooks/redux";

// interface Area {
//   id: string;
//   locationName: string;
//   address: string;
//   range: number;
//   coordinates: {
//     latitude: number;
//     longitude: number;
//   };
// }

// const containerStyle = {
//   width: "100%",
//   height: "400px",
// };

// const defaultCenter = {
//   lat: 28.6139,
//   lng: 77.209,
// };

// const libraries = ["places"];

// export default function StoreLocationPage() {
//   const profileComplete = useAppSelector(
//     (state) => state.profileStatus
//   );
//   console.log("profileComplete",profileComplete);

//   const [storeName, setStoreName] = useState("");
//   const [serviceRadius, setServiceRadius] = useState("");
//   const [marker, setMarker] = useState(defaultCenter);
//   const [detectedAddress, setDetectedAddress] = useState("");
//   const [locations, setLocations] = useState<Area[]>([]);
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();
//       setMarker({ lat, lng });
//     }
//   }, []);

//   const reverseGeocode = (lat: number, lng: number) => {
//     if (!window.google) return;
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === "OK" && results && results.length > 0) {
//         setDetectedAddress(results[0].formatted_address);
//       } else {
//         setDetectedAddress("Unable to detect address");
//       }
//     });
//   };

// useEffect(() => {
//   if (isLoaded && marker.lat && marker.lng) {
//     reverseGeocode(marker.lat, marker.lng);
//   }
// }, [marker, isLoaded]);

//   const onPlacesChanged = () => {
//     const places = searchBoxRef.current?.getPlaces();
//     if (places && places.length > 0) {
//       const place = places[0];
//       const lat = place.geometry?.location?.lat();
//       const lng = place.geometry?.location?.lng();

//       if (lat && lng) {
//         const newPosition = { lat, lng };
//         setMarker(newPosition);
//         mapRef.current?.panTo(newPosition);
//         setDetectedAddress(place.formatted_address || "");
//       }
//     }
//   };

//   const fetchAreas = async () => {
//     try {
//       const response = await axiosInstance.get(API.GET_AREAS());
//       setLocations(response.data.areas || []);
//     } catch (error) {
//       console.error("Failed to fetch areas", error);
//     }
//   };

//   useEffect(() => {
//     fetchAreas();
//   }, []);

//   const handleAddLocation = async () => {
//     try {
//       await axiosInstance.post(API.ADMIN_CREATE_AREA(), {
//         locationName: storeName,
//         coordinates: {
//           latitude: marker.lat,
//           longitude: marker.lng,
//         },
//         range: Number(serviceRadius),
//         address: detectedAddress,
//       });

//       toast({ title: "Location added to map!" });
//       setStoreName("");
//       setServiceRadius("");
//       await fetchAreas(); // Refresh locations list
//     } catch (error) {
//       console.error("Add Error", error);
//       toast({ variant: "destructive", title: "Failed to add location" });
//     }
//   };

//   const handleSubmit = () => {
//     if (profileComplete.data.isComplete) {
//       navigate("/");
//     } else {
//       navigate("/Serv");
//     }
//   };
//   if (loadError) return <div>Failed to load Google Maps</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-8">
//         {/* Heading */}
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-gray-800">Store Location Management</h1>
//           <p className="text-gray-600">
//             Add your store location on the map and define a service radius to serve customers.
//           </p>
//         </div>

//         {/* Add Store Form */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-700">Add New Store</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="storeName">Store Name</Label>
//               <Input
//                 id="storeName"
//                 value={storeName}
//                 onChange={(e) => setStoreName(e.target.value)}
//                 placeholder="Enter your store name"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="serviceRadius">Serviceable Radius (in KM)</Label>
//               <Input
//                 id="serviceRadius"
//                 type="number"
//                 value={serviceRadius}
//                 onChange={(e) => setServiceRadius(e.target.value)}
//                 placeholder="e.g., 5"
//               />
//             </div>
//           </div>

//           {/* Address Preview */}
//           <div className="space-y-2">
//             <Label>Detected Address</Label>
//             <div className="p-3 border rounded-md bg-gray-100 text-sm text-gray-700">
//               {detectedAddress}
//             </div>
//           </div>

//           {/* Map + Search */}
//           <div className="space-y-2">
//             <Label>Choose Store Location</Label>
//             <div className="relative border border-gray-300 rounded-md overflow-hidden shadow-sm">
//               {isLoaded ? (
//                 <>
//                   <StandaloneSearchBox
//                     onLoad={(ref) => (searchBoxRef.current = ref)}
//                     onPlacesChanged={onPlacesChanged}
//                   >
//                     <input
//                       type="text"
//                       placeholder="Search location..."
//                       style={{
//                         position: "absolute",
//                         top: 10,
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         width: "300px",
//                         padding: "8px 12px",
//                         borderRadius: "4px",
//                         zIndex: 10,
//                         boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//                         border: "1px solid #ccc",
//                         fontSize: "14px",
//                       }}
//                     />
//                   </StandaloneSearchBox>

//                   <GoogleMap
//                     mapContainerStyle={containerStyle}
//                     center={marker}
//                     zoom={14}
//                     onClick={handleMapClick}
//                     onLoad={(map) => (mapRef.current = map)}
//                   >
//                     <Marker position={marker} />
//                   </GoogleMap>
//                 </>
//               ) : (
//                 <div className="flex justify-center items-center h-[400px]">
//                   Loading map...
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-4 pt-2">
//             <Button
//               onClick={handleAddLocation}
//               disabled={!storeName || !serviceRadius}
//             >
//               Add Areas
//             </Button>

//             <Button
//               variant="secondary"
//               onClick={handleSubmit}
//               disabled={locations.length === 0}
//             >
//               Next
//             </Button>
//           </div>
//         </div>

//         {/* Saved Locations */}
//         <div className="pt-4">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Saved Locations</h2>
//           {locations.length === 0 ? (
//             <p className="text-gray-500">No store locations added yet.</p>
//           ) : (
//             <div className="grid gap-4">
//               {locations.map((loc) => (
//                 <div
//                   key={loc.id}
//                   className="border p-4 rounded-md shadow-sm space-y-1 bg-gray-50"
//                 >
//                   <h3 className="font-semibold text-gray-800">{loc.locationName}</h3>
//                   <p className="text-sm text-gray-600">Address: {loc.address}</p>
//                   <p className="text-sm text-gray-600">Radius: {loc.range} km</p>
//                   <p className="text-sm text-gray-600">
//                     Lat: {loc.coordinates.latitude}, Lng: {loc.coordinates.longitude}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
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
//   console.log("Profile complete",profileComplete)
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
//         "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllAppBanner"
//       );
//     //   console.log(res);
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
//                         <Button
//           onClick={() => navigate("/")}
//           disabled={banners.length === 0}
//           className=" w-full px-6 py-2 text-white bg-green-600 hover:bg-green-700"
//         >
//           Complete
//         </Button>
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
//         {/* <h2 className="text-xl font-semibold mb-4 text-gray-700">All Banners</h2>
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
//         )} */}
//               <div className="max-w-5xl mx-auto">
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
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function SubmitDetailsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      pricingModel: "",
      image: undefined,
    },
  });

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const res = await axios.get(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllServices"
      );
      console.log("result ", res);
      setServices(res.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast("Failed to fetch services", {
        description: error.response?.data?.message || "Try again later",
      });
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      const base64Image = await fileToBase64(data.image);
      const payload = {
        name: data.name,
        description: data.description,
        pricingModel: data.pricingModel,
        imageBase64: base64Image,
      };

      await axios.post(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/createService",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast("Service Added", {
        description: "Service has been added successfully!",
      });

      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchServices(); // refetch after adding
    } catch (error) {
      console.error("Submission error:", error);
      toast("Submission Failed", {
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Add Service
            </CardTitle>
            <CardDescription className="text-center">
              Add services one by one, then complete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Service</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter service name" {...field} />
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
                        <Input placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricingModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pricing model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="per_item">Per Item</SelectItem>
                          <SelectItem value="per_kg">Per Kg</SelectItem>
                        </SelectContent>
                      </Select>
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
                <Button type="submit" className="w-full">
                  {form.formState.isSubmitting ? "Adding..." : "Add Service"}
                </Button>
                <Button disabled={!services.length>0}  onClick={() => navigate("/")} className="w-full mb-4">
                  Complete and Go to Home
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Supported formats: JPEG, PNG, WEBP (Max 5MB)
            </p>
          </CardFooter>
        </Card>


        {/* Services List */}
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Available Services</h2>
          {loadingServices ? (
            <p className="text-center text-sm text-gray-500">
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No services found.
            </p>
          ) : (
            services.map((service, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Pricing: {service.pricingModel}</p>
                  <img
                    src={service.imageBase64}
                    alt={service.name}
                    className="mt-2 rounded-md w-full h-40 object-cover"
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
