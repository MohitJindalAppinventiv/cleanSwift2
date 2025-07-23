
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AppBanner } from "../../types/banner";
import { useBannerManager } from "./BannerManager";

export const useBannerCreateManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { banners, setBanners } = useBannerManager();

  const handleCreateBanner = (bannerData: Omit<AppBanner, "id" | "createdAt">) => {
    // In a real app, this would make an API call
    const newBanner: AppBanner = {
      id: (banners.length + 1).toString(),
      createdAt: new Date(),
      ...bannerData,
    };
    
    setBanners([...banners, newBanner]);
    
    toast({
      title: "Banner created",
      description: "The banner has been created successfully.",
    });
    
    navigate("/config/app-banner");
  };

  return {
    handleCreateBanner,
  };
};
