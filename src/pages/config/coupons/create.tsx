
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CreateCouponManager } from "../components/coupons/CreateCouponManager";

export default function CreateCouponPage() {
  return (
    <DashboardLayout>
      <CreateCouponManager />
    </DashboardLayout>
  );
}
