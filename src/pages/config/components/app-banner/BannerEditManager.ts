// src/components/app-banner/BannerEditManager.ts
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast"; // Changed import
import axios from "axios";
import { useEffect, useState } from "react";
import { AppBanner } from "../../types/banner";

interface ApiBanner {
  bannerId: string;
  title: string;
  description: string;
  imageUrl: string;
  enable?: boolean;
  isActive?: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export const useBannerEditManager = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<AppBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://us-central1-laundry-app-dee6a.cloudfunctions.net/getAllAppBanner"
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch banners");
        }

        const foundBanner = response.data.data.find(
          (b: ApiBanner) => b.bannerId === id
        );

        if (!foundBanner) {
          toast({
            title: "Error",
            description: "Banner not found",
            variant: "destructive",
          });
          navigate("/config/app-banner");
          return;
        }

        const transformedBanner: AppBanner = {
          id: foundBanner.bannerId,
          title: foundBanner.title,
          description: foundBanner.description,
          imageUrl: foundBanner.imageUrl,
          isActive: foundBanner.enable ?? foundBanner.isActive ?? false,
          createdAt: new Date(
            foundBanner.createdAt._seconds * 1000 +
              foundBanner.createdAt._nanoseconds / 1000000
          ),
        };

        setBanner(transformedBanner);
      } catch (error) {
        console.error("Error fetching banner:", error);
        toast({
          title: "Error",
          description: "Failed to load banner data",
          variant: "destructive",
        });
        navigate("/config/app-banner");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, [id, navigate]);

//  const handleUpdateBanner = async (bannerData: Omit<AppBanner, "id" | "createdAt">) => {
//   try {
//     if (!id) throw new Error("Missing banner ID");
//     setIsSubmitting(true);
    
//     const payload : any = {
//       title: bannerData.title,
//       description: bannerData.description,
//     };
//       if (bannerData.imageUrl.startsWith('data:image')) {
//       payload.fileBase64Image = bannerData.imageUrl;
//     } 
//      else {
//        payload.fileBase64Image =  bannerData.imageUrl;
//      }

//     const response = await axios.put(
//       "https://us-central1-laundry-app-dee6a.cloudfunctions.net/updateAppBanner",
//       payload,
//       {
//         params: { bannerId: id },
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.data.success) {
//       toast({
//         title: "Success",
//         description: "Banner updated successfully",
//       });
//       navigate("/config/app-banner");
//       return true;
//     } else {
//       throw new Error(response.data.message || "Failed to update banner");
//     }
//   } catch (error) {
//     console.error("Error updating banner:", error);
//     toast({
//       title: "Error",
//       description: error instanceof Error ? error.message : "Failed to update banner",
//       variant: "destructive",
//     });
//     return false;
//   } finally {
//     setIsSubmitting(false);
//   }
// };
const handleUpdateBanner = async (bannerData: Omit<AppBanner, "id" | "createdAt">) => {
  try {
    if (!id) throw new Error("Missing banner ID");
    setIsSubmitting(true);
    
    const payload: any = {
      title: bannerData.title,
      description: bannerData.description,
    };

    // Only process image if it's different from original
    if (bannerData.imageUrl !== banner?.imageUrl) {
      // If it's already a base64 data URL (from file upload)
      if (bannerData.imageUrl.startsWith('data:image')) {
        payload.fileBase64Image = bannerData.imageUrl;
      }
      // If it's a regular URL (pasted link)
      else {
        // Convert URL to base64 data URL
        const response = await fetch(bannerData.imageUrl);
        const blob = await response.blob();
        const base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => resolve(reader.result as string);
        });
        payload.fileBase64Image = base64Image; // This will include data:image/png;base64 prefix
      }
    }

    const response = await axios.put(
      "https://us-central1-laundry-app-dee6a.cloudfunctions.net/updateAppBanner",
      payload,
      {
        params: { bannerId: id },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      toast({ title: "Success", description: "Banner updated successfully" });
      navigate("/config/app-banner");
      return true;
    } else {
      throw new Error(response.data.message || "Failed to update banner");
    }
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update banner",
      variant: "destructive",
    });
    return false;
  } finally {
    setIsSubmitting(false);
  }
};

  return {
    banner,
    isLoading,
    isSubmitting,
    handleUpdateBanner,
  };
};