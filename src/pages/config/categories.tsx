
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CategoriesConfigManager } from "./components/categories/CategoriesConfigManager";

export default function CategoriesConfigPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <CategoriesConfigManager />
      </div>
    </DashboardLayout>
  );
}
