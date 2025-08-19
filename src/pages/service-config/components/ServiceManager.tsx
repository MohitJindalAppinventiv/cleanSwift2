// useServiceManager.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Service, mockServices } from "../types";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint";

export const useServiceManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(
        `${API.GET_ALL_SERVICES()}`
      );
      
      if (response.data.success) {
        const transformedServices = response.data.data.map((apiService: any) => ({
          id: apiService.id,
          name: apiService.name,
          thumbnail: apiService.imageUrl,
          description: apiService.description,
          pricingmodel: apiService.pricingModel,
          status: apiService.isActive ? "active" : "inactive",
          variants: apiService.variants || [],
          additionalService: apiService.additionalService || ""
        }));
        
        setServices(transformedServices);
      } else {
        throw new Error(response.data.message || "Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setServices(mockServices);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatic fetch on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    services,
    setServices,
    searchQuery,
    setSearchQuery,
    filteredServices,
    isLoading,
    error,
    fetchServices // Expose the fetch function
  };
};