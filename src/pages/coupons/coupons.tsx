import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CouponsConfigManager } from "./CouponsConfigManager";

export default function CouponsConfigPage() {
  return (
    <DashboardLayout>
      <CouponsConfigManager />
    </DashboardLayout>
  );
}
