import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import API from "@/api/endpoints/endpoint";
import { axiosInstance } from "@/api/axios/axiosInstance";

export const useCreateServiceManager = () => {
  const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [service, setService] = useState({
    name: "",
    description: "",
    pricingmodel: "",
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

  const handleStatusChange = (value: string) => {
    setService(prev => ({ ...prev, status: value as "active" | "inactive" }));
  };

  const handlePricingModelChange = (value: string) => {
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
    setFileInputKey(Date.now()); // Reset file input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     setIsLoading(true); // Set loading to true when submission starts
    try {
      // Create payload with only the required fields
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
 if(service.status && service.status !== "active"){
     await axiosInstance.patch(
        `${API.TOGGLE_SERVICE_STATUS()}?serviceId=${res.data.id}`
      );
  }
      toast.success("Service created successfully");
      navigate("/config/services");
    } catch (error) {
      console.error("Error creating service:", error.response.data.message);
      toast.error(error.response.data.message);
    }finally {
      setIsLoading(false); // Reset loading state whether success or error
    }
  };

  const handleCancel = () => {
    navigate("/config/services");
  };

  return {
    service,
    selectedVariants,
    fileInputKey,
    isLoading, // Expose loading state
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