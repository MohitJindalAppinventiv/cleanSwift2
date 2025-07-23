
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useBannerManager } from "./components/app-banner/BannerManager";
import { BannerTable } from "./components/app-banner/BannerTable";
import { BannerHeader } from "./components/app-banner/BannerHeader";
import { AppBanner } from "./types/banner";

export default function AppBannerPage() {
  const { 
    filteredBanners, 
    searchQuery, 
    setSearchQuery, 
    handleDeleteBanner 
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
        <BannerTable 
          banners={filteredBanners} 
          onEdit={handleEditBanner} 
          onDelete={handleDeleteBanner} 
        />
      </div>
    </DashboardLayout>
  );
}
