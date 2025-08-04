import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useBannerManager } from "./components/app-banner/BannerManager";
import { BannerTable } from "./components/app-banner/BannerTable";
import { BannerHeader } from "./components/app-banner/BannerHeader";
import { AppBanner } from "./types/banner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppBannerPage() {
  const {
    filteredBanners,
    searchQuery,
    setSearchQuery,
    handleDeleteBanner,
    handleToggleStatus,
    isLoading,
  } = useBannerManager();

  const navigate = useNavigate();

  const handleEditBanner = (banner: AppBanner) => {
    navigate(`/config/app-banner/edit/${banner.id}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <BannerHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No banners found</p>
          </div>
        ) : (
          <BannerTable
            banners={filteredBanners}
            onEdit={handleEditBanner}
            onDelete={handleDeleteBanner}
            onToggle={handleToggleStatus}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
