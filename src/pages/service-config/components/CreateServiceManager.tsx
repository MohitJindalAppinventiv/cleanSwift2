
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Service, availableVariants, mockServices } from "../types";

export const useCreateServiceManager = () => {
  const navigate = useNavigate();
  const [service, setService] = useState<Service>({
    id: `srv-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    name: "",
    description: "",
    status: "active",
    variants: []
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

  const handleVariantToggle = (variant: string) => {
    if (selectedVariants.includes(variant)) {
      setSelectedVariants(selectedVariants.filter(v => v !== variant));
    } else {
      setSelectedVariants([...selectedVariants, variant]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setService(prev => ({ 
        ...prev, 
        thumbnail: reader.result as string 
      }));
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the service with the selected variants
    const newService = {
      ...service,
      variants: selectedVariants
    };
    
    // In a real app, this would send data to an API
    console.log("Saving new service:", newService);
    
    // Add to mock services (in a real app this would be an API call)
    mockServices.unshift(newService);
    
    toast.success("Service created successfully");
    navigate("/config/services");
  };

  const handleCancel = () => {
    navigate("/config/services");
  };

  return {
    service,
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
