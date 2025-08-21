import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API from "@/api/endpoints/endpoint";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { Service } from "../types";

export const useCreateServiceManager = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [service, setService] = useState<Omit<Service, 'id' | 'variants' | 'additionalService'>>({
    name: "",
    description: "",
    pricingmodel: "per_kg",
    status: "active",
    imageBase64: "",
    thumbnail: ""
  });

  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setService(prev => ({ ...prev, status: value }));
  };

  const handlePricingModelChange = (value: "per_kg" | "per_item") => {
    setService(prev => ({ ...prev, pricingmodel: value }));
  };

  const handleVariantToggle = (variant: string) => {
    setSelectedVariants(prev => 
      prev.includes(variant) 
        ? prev.filter(v => v !== variant) 
        : [...prev, variant]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setService(prev => ({ 
        ...prev, 
        imageBase64: base64String,
        thumbnail: base64String
      }));
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setService(prev => ({
      ...prev,
      imageBase64: "",
      thumbnail: ""
    }));
    setFileInputKey(Date.now());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        name: service.name,
        description: service.description,
        pricingModel: service.pricingmodel,
        imageBase64: service.imageBase64
      };

      const res = await axiosInstance.post(
        `${API.CREATE_SERVICE()}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (service.status && service.status !== "active") {
        await axiosInstance.patch(
          `${API.TOGGLE_SERVICE_STATUS()}?serviceId=${res.data.id}`
        );
      }
      
      toast.success("Service created successfully");
      navigate("/config/services");
    } catch (error: any) {
      console.error("Error creating service:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to create service");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/config/services");
  };

  return {
    service,
    selectedVariants,
    fileInputKey,
    isLoading,
    handleInputChange,
    handleStatusChange,
    handleVariantToggle,
    handleFileChange,
    handleRemoveThumbnail,
    handlePricingModelChange,
    handleSubmit,
    handleCancel,
    setFileInputKey
  };
};