
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CreateOrderManager } from "@/components/orders/CreateOrderManager";

export default function CreateOrderPage() {
  return (
    <DashboardLayout>
      <CreateOrderManager />
    </DashboardLayout>
  );
}
