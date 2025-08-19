
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface ServiceFormProps {
  service: any;
  fileInputKey: number;
  handlePricingModelChange: (value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
  isLoading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveThumbnail: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  isLoading,
  service,
  fileInputKey,
  handleInputChange,
  handleStatusChange,
  handlePricingModelChange,
  handleFileChange,
  handleRemoveThumbnail,
  handleSubmit,
  handleCancel
}) => {
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={service.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
           {/* Pricing Model */}
          <div className="space-y-2">
            <Label htmlFor="pricingModel">Pricing Model</Label>
            <Select 
              onValueChange={handlePricingModelChange}
              value={service.pricingmodel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_kg">Per Kg</SelectItem>
                <SelectItem value="per_item">Per Item</SelectItem>
              </SelectContent>
            </Select>
          </div>

        
        {/* Thumbnail (File upload) */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail (File upload)</Label>
            <div className="flex flex-col gap-2">
              <Input 
                key={fileInputKey}
                id="thumbnail" 
                name="thumbnail" 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
              />
              {service.thumbnail && (
                <div className="mt-2">
                  <Label>Current Thumbnail</Label>
                  <div className="relative border rounded p-2 w-fit mt-1">
                    <img
                      src={service.thumbnail}
                      alt={service.name}
                      className="w-32 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      aria-label="Remove thumbnail"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Service Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={service.description} 
              onChange={handleInputChange} 
              required 
              rows={4}
            />
          </div>

          {/* Additional Service */}
          {/* <div className="space-y-2">
            <Label htmlFor="additionalService">Additional Service</Label>
            <Input 
              id="additionalService" 
              name="additionalService" 
              value={service.additionalService || ''} 
              onChange={handleInputChange} 
            />
          </div> */}

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              onValueChange={handleStatusChange} 
              defaultValue={service.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
           <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ServiceForm;
