
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProductsConfigManager } from "./components/products/ProductsConfigManager";

export default function ProductsConfigPage() {
  return (
    <DashboardLayout>
      <ProductsConfigManager />
    </DashboardLayout>
  );
}
