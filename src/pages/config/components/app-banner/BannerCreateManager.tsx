import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AppBanner } from "../../types/banner";
import axios from "axios";
import { useState } from "react";





const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // First validate the file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      reject(new Error('Only PNG and JPG images are supported'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result); // Keep the full data URL
    };
    reader.onerror = (error) => reject(error);
  });
};

export const useBannerCreateManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  

  // const handleCreateBanner = async (bannerData: Omit<AppBanner, "id" | "createdAt">) => {
  //   try {


  //      setIsSubmitting(true); 
  //     // Validate image type before processing
  //     if (bannerData.imageUrl.startsWith('data:image')) {
  //       const mimeType = bannerData.imageUrl.split(';')[0].split(':')[1];
  //       if (!['image/png', 'image/jpeg', 'image/jpg'].includes(mimeType)) {
  //         throw new Error('Only PNG and JPG images are supported');
  //       }
  //     }

  //     let fileBase64Image = bannerData.imageUrl;
      
  //     // If it's a URL (not data URL), fetch and convert
  //     if (bannerData.imageUrl && !bannerData.imageUrl.startsWith('data:image')) {
  //       try {
  //         const response = await fetch(bannerData.imageUrl);
  //         const blob = await response.blob();
          
  //         // Validate the fetched image type
  //         if (!['image/png', 'image/jpeg', 'image/jpg'].includes(blob.type)) {
  //           throw new Error('Only PNG and JPG images are supported');
  //         }
          
  //         fileBase64Image = await fileToBase64(new File([blob], 'banner-image', { type: blob.type }));
  //       } catch (error) {
  //         console.error("Error converting URL to base64:", error);
  //         throw new Error('Failed to process image URL');
  //       }
  //     }

  //     const payload = {
  //       title: bannerData.title,
  //       description: bannerData.description,
  //       fileBase64Image: fileBase64Image, // Send full data URL
  //     };

  //     // Make API request
  //     const response = await axios.post(
  //       "https://us-central1-laundry-app-dee6a.cloudfunctions.net/createAppBanner",
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       toast({
  //         title: "Banner created",
  //         description: "The banner has been created successfully.",
  //       });
  //       navigate("/config/app-banner");
  //     } else {
  //       throw new Error(response.data.message || "Failed to create banner");
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: error instanceof Error ? error.message : "Failed to create banner",
  //       variant: "destructive",
  //     });
  //   }finally {
  //     setIsSubmitting(false); // Reset submitting state when done
  //   }
  // };

const handleCreateBanner = async (bannerData: Omit<AppBanner, "id" | "createdAt">) => {
    try {
      setIsSubmitting(true);
      
      // Validate image type before processing
      if (bannerData.imageUrl.startsWith('data:image')) {
        const mimeType = bannerData.imageUrl.split(';')[0].split(':')[1];
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(mimeType)) {
          throw new Error('Only PNG and JPG images are supported');
        }
      }

      let fileBase64Image = bannerData.imageUrl;
      
      // If it's a URL (not data URL), fetch and convert
      if (bannerData.imageUrl && !bannerData.imageUrl.startsWith('data:image')) {
        try {
          const response = await fetch(bannerData.imageUrl);
          const blob = await response.blob();
          
          if (!['image/png', 'image/jpeg', 'image/jpg'].includes(blob.type)) {
            throw new Error('Only PNG and JPG images are supported');
          }
          
          fileBase64Image = await fileToBase64(new File([blob], 'banner-image', { type: blob.type }));
        } catch (error) {
          console.error("Error converting URL to base64:", error);
          throw new Error('Failed to process image URL');
        }
      }

      const payload = {
        title: bannerData.title,
        description: bannerData.description,
        fileBase64Image: fileBase64Image,
      };

      // Make API request to create banner
      const response = await axios.post(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/createAppBanner",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const bannerId = response.data.bannerId; // Changed from response.data.data.bannerId to response.data.bannerId
        
        // If the banner is created as inactive, we need to toggle its status
        if (bannerData.isActive === false) {
          try {
            await axios.patch(
              "https://us-central1-laundry-app-dee6a.cloudfunctions.net/changeStatusAppBanner",
              null,
              { params: { bannerId } }
            );
          } catch (toggleError) {
            console.error("Failed to update banner status:", toggleError);
            // Don't fail the whole operation if status update fails
            toast({
              title: "Banner created but status update failed",
              description: "The banner was created but we couldn't update its status. You may need to update it manually.",
              variant: "destructive",
            });
          }
        }

        toast({
          title: "Banner created",
          description: "The banner has been created successfully.",
        });
        navigate("/config/app-banner");
      } else {
        throw new Error(response.data.message || "Failed to create banner");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create banner",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };




  
  return {
    handleCreateBanner,
     isSubmitting, // Return the submitting state
  };
};