
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BannerForm } from "../components/app-banner/BannerForm";
import { useBannerCreateManager } from "../components/app-banner/BannerCreateManager";

export default function BannerCreatePage() {
  const { handleCreateBanner } = useBannerCreateManager();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Banner</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new promotional banner to display in your app
          </p>
        </div>
        
        <div className="rounded-md border p-6">
          <BannerForm onSave={handleCreateBanner} />
        </div>
      </div>
    </DashboardLayout>
  );
}
