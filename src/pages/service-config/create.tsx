
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useCreateServiceManager } from "./components/CreateServiceManager";
import ServiceForm from "./components/ServiceForm";

const ServiceCreatePage: React.FC = () => {
  const {
    service,
    selectedVariants,
    fileInputKey,
    handleInputChange,
    handleStatusChange,
    handleVariantToggle,
    handleFileChange,
    handleSubmit,
    handleCancel
  } = useCreateServiceManager();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add New Service</h1>
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

export default ServiceCreatePage;
