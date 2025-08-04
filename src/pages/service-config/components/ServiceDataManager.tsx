//edit
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Service } from "../types";
import axios from "axios";

export const useServiceData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoad, setIsLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoad(true);
        // First fetch all services
        const response = await axios.get(
          "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllServices"
        );
        if (response.data.success) {
          // Find the specific service from the array
          const foundService = response.data.data.find((s: any) => s.id === id);
          
          if (foundService) {
            setService({
              id: foundService.id,
              name: foundService.name,
              description: foundService.description,
              pricingmodel: foundService.pricingModel,
              status: foundService.isActive ? "active" : "inactive",
              imageBase64: foundService.imageUrl, // Using imageUrl as imageBase64
              thumbnail: foundService.imageUrl
            });
          } else {
            toast.error("Service not found");
            navigate("/config/services");
          }
        } else {
          throw new Error(response.data.message || "Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service data");
        navigate("/config/services");
      } finally {
        setIsLoad(false);
      }
    };

    fetchService();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!service) return;
    const { name, value } = e.target;
    setService(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleStatusChange = async (value: string) => {
    if (!service) return;
    setService(prev => prev ? { ...prev, status: value as "active" | "inactive" } : null);
    await axios.patch(
        `https://us-central1-laundry-app-dee6a.cloudfunctions.net/changeStatusOfService?serviceId=${id}`
      );
  };

  const handlePricingModelChange = (value: string) => {
    if (!service) return;
    setService(prev => prev ? { ...prev, pricingmodel: value } : null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      console.log(base64String);
      setService(prev => prev ? { 
        ...prev, 
        imageBase64: base64String,
        thumbnail: base64String
      } : null);
    };
    
    reader.readAsDataURL(file);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;

    try {
      setIsLoading(true);
      
      // const payload = {
      //   name: service.name,
      //   description: service.description,
      //   pricingModel: service.pricingmodel,
      //   imageBase64: service.imageBase64
      // };
       const payload = {
        name: service.name,
        description: service.description,
        pricingModel: service.pricingmodel,
        // Only send imageBase64 if it's a new image (starts with data:)
        // Otherwise, the backend should use the existing imageUrl
        imageBase64: service.imageBase64?.startsWith('data:') 
          ? service.imageBase64 
          : undefined
      };


      await axios.put(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/updateService",
        payload,
        {
          params: { serviceId: id },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Service updated successfully");
      navigate("/config/services");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/config/services");
  };

  return {
    service,
    isLoad,
    isLoading,
    fileInputKey,
    handleInputChange,
    handleStatusChange,
    handlePricingModelChange,
    handleFileChange,
    handleSubmit,
    handleCancel,
    setFileInputKey
  };
};