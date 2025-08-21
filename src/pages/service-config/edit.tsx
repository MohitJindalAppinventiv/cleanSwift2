import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useServiceData } from "./components/ServiceDataManager";
import ServiceForm from "./components/ServiceForm";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceEditPage: React.FC = () => {
  const {
    service,
    isLoad,
    isLoading,
    fileInputKey,
    handleInputChange,
    handleStatusChange,
    handleFileChange,
    handlePricingModelChange,
    handleSubmit,
    handleCancel,
    handleRemoveThumbnail,
  } = useServiceData();

  if (isLoad) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" /> {/* Title skeleton */}
          </div>
          
          {/* Form skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left column skeleton */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Label skeleton */}
                <Skeleton className="h-10 w-full" /> {/* Input skeleton */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Label skeleton */}
                <Skeleton className="h-32 w-full" /> {/* Textarea skeleton */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Label skeleton */}
                <Skeleton className="h-10 w-full" /> {/* Select skeleton */}
              </div>
              <Skeleton className="h-20 w-full" /> {/* Switch skeleton */}
            </div>
            
            {/* Right column skeleton */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Label skeleton */}
                <Skeleton className="h-4 w-32" /> {/* Sub-label skeleton */}
                <Skeleton className="h-48 w-full" /> {/* Image upload skeleton */}
              </div>
            </div>
          </div>
          
          {/* Button area skeleton */}
          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-24" /> {/* Cancel button skeleton */}
            <Skeleton className="h-10 w-32" /> {/* Save button skeleton */}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!service) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p>Service not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Service</h1>
        </div>

        <ServiceForm
          service={service}
          isLoading={isLoading}
          fileInputKey={fileInputKey}
          handleInputChange={handleInputChange}
          handleStatusChange={handleStatusChange}
          handlePricingModelChange={handlePricingModelChange}
          handleFileChange={handleFileChange}
          handleRemoveThumbnail={handleRemoveThumbnail}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServiceEditPage;