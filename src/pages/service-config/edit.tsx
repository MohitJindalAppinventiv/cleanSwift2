
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useServiceData } from "./components/ServiceDataManager";
import ServiceForm from "./components/ServiceForm";

const ServiceEditPage: React.FC = () => {
  const {
    service,
    isLoading,
    selectedVariants,
    fileInputKey,
    handleInputChange,
    handleStatusChange,
    handleVariantToggle,
    handleFileChange,
    handleSubmit,
    handleCancel
  } = useServiceData();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
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
          selectedVariants={selectedVariants}
          fileInputKey={fileInputKey}
          handleInputChange={handleInputChange}
          handleStatusChange={handleStatusChange}
          handleVariantToggle={handleVariantToggle}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServiceEditPage;
