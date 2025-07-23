
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaConfig } from "../../types/area";
import { AreaTable } from "./AreaTable";
import { AreaForm } from "./AreaForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const fetchAreaConfig = async (): Promise<AreaConfig> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        areas: [
          {
            id: "1",
            name: "Downtown",
            city: "New York",
            postalCodes: ["10001", "10002", "10003"],
            isActive: true,
          },
          {
            id: "2",
            name: "Brooklyn Heights",
            city: "New York",
            postalCodes: ["11201", "11202"],
            isActive: true,
          },
          {
            id: "3",
            name: "Queens",
            city: "New York",
            postalCodes: ["11101", "11102"],
            isActive: false,
          },
        ],
        isActive: true,
      });
    }, 500);
  });
};

export function AreaConfigManager() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["areaConfig"],
    queryFn: fetchAreaConfig,
  });

  const handleAddArea = (newArea: Partial<AreaConfig["areas"][0]>) => {
    // In a real-world scenario, we would make an API call to save the new area
    console.log("Adding new area:", newArea);
    toast.success("Area added successfully!");
    setIsDialogOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Area Configuration</CardTitle>
          <CardDescription>Loading area configuration...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Area Configuration</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Area</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Service Area</DialogTitle>
            </DialogHeader>
            <AreaForm 
              onSave={handleAddArea} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
          <CardDescription>
            Configure service areas for your application. You can add, edit, or remove service areas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Areas</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <AreaTable areas={data?.areas || []} filter="all" />
            </TabsContent>
            <TabsContent value="active">
              <AreaTable areas={data?.areas.filter(area => area.isActive) || []} filter="active" />
            </TabsContent>
            <TabsContent value="inactive">
              <AreaTable areas={data?.areas.filter(area => !area.isActive) || []} filter="inactive" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {/* Removed the "Add New Area" and "Save Changes" buttons */}
        </CardFooter>
      </Card>
    </div>
  );
}
