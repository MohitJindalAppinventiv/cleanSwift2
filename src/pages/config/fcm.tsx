
import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FCMConfigManager } from "./components/fcm/FCMConfigManager";

const FCMConfigPage: React.FC = () => {
  return (
    <DashboardLayout>
      <FCMConfigManager />
    </DashboardLayout>
  );
};

export default FCMConfigPage;
