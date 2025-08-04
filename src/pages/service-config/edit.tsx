
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useServiceData } from "./components/ServiceDataManager";
import ServiceForm from "./components/ServiceForm";

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
    handleCancel
  } = useServiceData();

  if (isLoad) {
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
          fileInputKey={fileInputKey}
          handlePricingModelChange={handlePricingModelChange}
          handleInputChange={handleInputChange}
          handleStatusChange={handleStatusChange}
          isLoading={isLoading}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServiceEditPage;
