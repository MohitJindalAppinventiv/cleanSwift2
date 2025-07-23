
import { useState } from "react";
import { Service, mockServices } from "../types";

export const useServiceManager = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter services based on search query
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    services,
    setServices,
    searchQuery,
    setSearchQuery,
    filteredServices
  };
};
