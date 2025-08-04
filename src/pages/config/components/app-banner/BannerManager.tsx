import { useState, useEffect } from "react";
import { AppBanner } from "../../types/banner";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface ApiBanner {
  bannerId: string;
  title: string;
  description: string;
  imageUrl: string;
  enable?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export const useBannerManager = () => {
  const [banners, setBanners] = useState<AppBanner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBanners = async () => {
    try {

       
      const response = await fetch(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllAppBanner"
      );

      if (!response.ok) throw new Error("Failed to fetch banners");

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch banners");
      }

      const transformedBanners = result.data
        .map((banner: ApiBanner) => ({
          id: banner.bannerId,
          title: banner.title,
          description: banner.description,
          imageUrl: banner.imageUrl,
          isActive: banner.enable ?? banner.isActive ?? false,
          createdAt: new Date(
            banner.createdAt._seconds * 1000 +
              banner.createdAt._nanoseconds / 1000000
          ),
          isDeleted: banner.isDeleted,
        }))
        .filter((banner: AppBanner) => !banner.isDeleted);

      setBanners(transformedBanners);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load banners",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDeleteBanner = async (id: string) => {
    try {


      
      const response = await axios.delete(
        `https://us-central1-laundry-app-dee6a.cloudfunctions.net/deleteAppBanner/${id}`,
        {
          params: {
            bannerId: id,
          },
        }
      );
      if (response.data.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        toast({
          title: "Banner deleted",
          description:
            response.data.message || "The banner has been deleted.",
        });
      } else {
        throw new Error(response.data.message || "Failed to delete banner");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await axios.patch(
        `https://us-central1-laundry-app-dee6a.cloudfunctions.net/changeStatusAppBanner`,
        null,
        { params: { bannerId: id } }
      );

      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === id
            ? { ...banner, isActive: !banner.isActive }
            : banner
        )
      );

      toast({
        title: "Success",
        description: "Banner status updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    banners,
    setBanners,
    searchQuery,
    setSearchQuery,
    filteredBanners,
    handleDeleteBanner,
    handleToggleStatus,
    isLoading,
  };
};
