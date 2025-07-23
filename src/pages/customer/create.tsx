
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CreateCustomerManager } from "@/components/customers/CreateCustomerManager";

export default function CreateCustomerPage() {
  return (
    <DashboardLayout>
      <CreateCustomerManager />
    </DashboardLayout>
  );
}
