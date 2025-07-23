
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Service, availableVariants } from "../types";

interface ServiceFormProps {
  service: Service;
  selectedVariants: string[];
  fileInputKey: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
  handleVariantToggle: (variant: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  selectedVariants,
  fileInputKey,
  handleInputChange,
  handleStatusChange,
  handleVariantToggle,
  handleFileChange,
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
          
          {/* Selected Variants (multiselect) */}
          <div className="space-y-2">
            <Label>Selected Variants</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableVariants.map((variant) => (
                <Button
                  key={variant}
                  type="button"
                  variant={selectedVariants.includes(variant) ? "default" : "outline"}
                  className={`justify-start ${selectedVariants.includes(variant) ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => handleVariantToggle(variant)}
                >
                  {selectedVariants.includes(variant) ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <div className="w-4 h-4 mr-2" />
                  )}
                  {variant}
                </Button>
              ))}
            </div>
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
                  <div className="border rounded p-2 w-fit mt-1">
                    <img
                      src={service.thumbnail}
                      alt={service.name}
                      className="w-32 h-24 object-cover rounded"
                    />
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
          <div className="space-y-2">
            <Label htmlFor="additionalService">Additional Service</Label>
            <Input 
              id="additionalService" 
              name="additionalService" 
              value={service.additionalService || ''} 
              onChange={handleInputChange} 
            />
          </div>

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
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ServiceForm;
