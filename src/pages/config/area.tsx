import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AreaConfigManager } from "../area/AreaConfigManager";

export default function AreaConfigPage() {
  return (
    <DashboardLayout>
      <AreaConfigManager />
    </DashboardLayout>
  );
}
