



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
import { axiosInstance } from "@/api/axios/axiosInstance";

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
      const res = await axiosInstance.get(
        "/getAllServices"
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

      await axiosInstance.post(
        "/createService",
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Add New Laundry Service
        </h1>

        <Card className="mb-10 shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-center">
              Service Information
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Fill out the details and add a service
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Wash & Fold" {...field} />
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
                        <Input placeholder="Service description..." {...field} />
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
                            <SelectValue placeholder="Choose pricing model" />
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
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
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

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    {form.formState.isSubmitting ? "Adding..." : "Add Service"}
                  </Button>
                  <Button
                    type="button"
                    disabled={services.length === 0}
                    onClick={() => navigate("/")}
                    variant="secondary"
                    className="w-full"
                  >
                    Complete and Go to Home
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>

          <CardFooter>
            <p className="text-xs text-gray-500 mx-auto">
              * JPEG, PNG, WEBP files only. Max size 5MB.
            </p>
          </CardFooter>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Available Services
          </h2>

          {loadingServices ? (
            <p className="text-sm text-gray-500 text-center">Loading...</p>
          ) : services.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No services found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service, idx) => (
                <Card key={idx} className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Pricing:</span>{" "}
                      {service.pricingModel}
                    </p>
                    <img
                      src={service.imageBase64}
                      alt={service.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
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
