
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useServiceManager } from "./components/ServiceManager";
import ServiceHeader from "./components/ServiceHeader";
import SearchableServicesCard from "./components/SearchableServicesCard";

const ServiceListingPage: React.FC = () => {
  const { searchQuery, setSearchQuery, filteredServices } = useServiceManager();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <ServiceHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <SearchableServicesCard
          filteredServices={filteredServices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServiceListingPage;
