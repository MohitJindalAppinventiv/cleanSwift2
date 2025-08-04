// src/pages/config/app-banner/BannerEditPage.tsx
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BannerForm } from "./BannerForm";
import { useBannerEditManager } from "./BannerEditManager";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppBanner } from "../../types/banner";

export default function BannerEditPage() {
  const { banner, isLoading, handleUpdateBanner , isSubmitting } = useBannerEditManager();
  const navigate = useNavigate();

  const handleSave = async (bannerData: Omit<AppBanner, "id" | "createdAt">) => {
    const success = await handleUpdateBanner(bannerData);
    if (success) {
      navigate("/config/app-banner");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" /> 
          </div>
          <div className="rounded-md border p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="aspect-[16/9] w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!banner) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Banner</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Banner not found
            </p>
          </div>
          <Button onClick={() => navigate("/config/app-banner")}>
            Back to Banners
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Banner</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update the promotional banner
          </p>
        </div> 
        
        <div className="rounded-md border p-6">
          <BannerForm 
            onSave={handleSave}
            isSubmitting=  {isSubmitting}
            defaultValues={{
              title: banner.title,
              description: banner.description,
              imageUrl: banner.imageUrl,
              isActive: banner.isActive,
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}