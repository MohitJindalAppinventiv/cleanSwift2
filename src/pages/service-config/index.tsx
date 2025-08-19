import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useServiceManager } from "./components/ServiceManager";
import ServiceHeader from "./components/ServiceHeader";
import SearchableServicesCard from "./components/SearchableServicesCard";
import { Alert } from "@/components/ui/alert";

const ServiceListingPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredServices,
    isLoading,
    error,
    fetchServices,
  } = useServiceManager();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Show error alert at top */}
        {error && (
          <Alert variant="destructive" className="mx-auto max-w-4xl mb-4">
            {error} - Showing demo data instead
          </Alert>
        )}
        {/* Render fixed UI immediately */}
        <ServiceHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
         <p className="text-muted-foreground">
          Welcome to the Service Page, where you can create and manage services.
        </p>
        <SearchableServicesCard
          fetchServices={fetchServices}
          filteredServices={filteredServices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading} // Pass isLoading to SearchableServicesCard
        />
      </div>
    </DashboardLayout>
  );
};

export default ServiceListingPage;