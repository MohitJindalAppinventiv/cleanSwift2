
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Service, mockServices } from "../types";

export const useServiceData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting file input

  useEffect(() => {
    // In a real application, this would be an API call
    const foundService = mockServices.find(service => service.id === id);
    
    if (foundService) {
      setService(foundService);
      setSelectedVariants(foundService.variants || []);
    } else {
      toast.error("Service not found");
      navigate("/config/services");
    }
    
    setIsLoading(false);
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!service) return;
    const { name, value } = e.target;
    setService(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleStatusChange = (value: string) => {
    if (!service) return;
    setService(prev => prev ? { ...prev, status: value as "active" | "inactive" } : null);
  };

  const handleVariantToggle = (variant: string) => {
    if (selectedVariants.includes(variant)) {
      setSelectedVariants(selectedVariants.filter(v => v !== variant));
    } else {
      setSelectedVariants([...selectedVariants, variant]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!service || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setService(prev => prev ? { 
        ...prev, 
        thumbnail: reader.result as string 
      } : null);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;
    
    // Update the service with the selected variants
    const updatedService = {
      ...service,
      variants: selectedVariants
    };
    
    // In a real app, this would send data to an API
    console.log("Saving service:", updatedService);
    toast.success("Service updated successfully");
    navigate("/config/services");
  };

  const handleCancel = () => {
    navigate("/config/services");
  };

  return {
    service,
    isLoading,
    selectedVariants,
    fileInputKey,
    handleInputChange,
    handleStatusChange,
    handleVariantToggle,
    handleFileChange,
    handleSubmit,
    handleCancel,
    setFileInputKey
  };
};
