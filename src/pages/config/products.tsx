
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProductsConfigManager } from "./components/products/ProductsConfigManager";
import { useLocation } from "react-router-dom";

export default function ProductsConfigPage() {
  const { state }   = useLocation();
  const idType = state?.idType;
  console.log(idType);

  return (
    <DashboardLayout>
      <ProductsConfigManager />
    </DashboardLayout>
  );
}
