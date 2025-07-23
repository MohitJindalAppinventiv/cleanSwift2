
import { useState } from "react";
import { AppBanner, mockBanners } from "../../types/banner";
import { useToast } from "@/hooks/use-toast";

export const useBannerManager = () => {
  const [banners, setBanners] = useState<AppBanner[]>(mockBanners);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Filter banners based on search query
  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteBanner = (id: string) => {
    // In a real app, this would make an API call
    setBanners(banners.filter((banner) => banner.id !== id));
    toast({
      title: "Banner deleted",
      description: "The banner has been deleted successfully.",
    });
  };

  return {
    banners,
    setBanners,
    searchQuery,
    setSearchQuery,
    filteredBanners,
    handleDeleteBanner,
  };
};
