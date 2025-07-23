
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CouponsConfigManager } from "./components/coupons/CouponsConfigManager";

export default function CouponsConfigPage() {
  return (
    <DashboardLayout>
      <CouponsConfigManager />
    </DashboardLayout>
  );
}
