
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { FCMConfig } from "../../types/fcm";
import { FCMConfigForm } from "./FCMConfigForm";

export const FCMConfigManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  // In a real application, you would fetch the existing configuration
  // For now, we'll use a mock default value
  const defaultConfig: FCMConfig = {
    serverKey: "",
    isEnabled: true,
  };

  const handleSaveConfig = async (config: FCMConfig) => {
    setIsLoading(true);
    
    try {
      // In a real application, you would send this data to your backend
      console.log("Saving FCM config:", config);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use toast from sonner correctly - it expects message as first parameter, not an object with title
      toast("Configuration Saved", {
        description: "FCM configuration has been successfully updated.",
      });
      
      // Navigate back or stay on the same page
      // navigate("/config/fcm"); 
    } catch (error) {
      console.error("Failed to save FCM config:", error);
      uiToast({
        variant: "destructive",
        title: "Failed to Save",
        description: "There was an error saving your FCM configuration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">FCM Configuration</h1>
        <p className="text-muted-foreground">
          Configure your Firebase Cloud Messaging settings to enable push notifications.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <FCMConfigForm
          defaultValues={defaultConfig}
          onSave={handleSaveConfig}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
