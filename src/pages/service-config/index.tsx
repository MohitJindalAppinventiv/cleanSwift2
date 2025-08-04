import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useServiceManager } from "./components/ServiceManager";
import ServiceHeader from "./components/ServiceHeader";
import SearchableServicesCard from "./components/SearchableServicesCard";
import { LoadingSpinner } from "@/components/ui/loadingspinner"; // Assuming you have a spinner component
import { Alert } from "@/components/ui/alert"; // Assuming you have an alert component

const ServiceListingPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredServices,
    isLoading,
    error,
    fetchServices
  } = useServiceManager();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner className="w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
       <DashboardLayout>
      {/* Show error alert at top (but don't return early) */}
      {error && (
        <Alert variant="destructive" className="mx-auto max-w-4xl mb-4">
          {error} - Showing demo data instead
        </Alert>
      )}
      
      <div className="space-y-4">
        <ServiceHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <SearchableServicesCard
         fetchServices={fetchServices}
          filteredServices={filteredServices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </DashboardLayout>
    );
  }

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
          fetchServices = {fetchServices}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServiceListingPage;