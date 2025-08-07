import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm, ProductFormValues } from "./ProductForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Service {
  id: string;
  name: string;
  pricingModel: "per_kg" | "per_item";
}

interface Category {
  categoryId: string;
  categoryName: string;
  serviceName: string;
}

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormValues) => void;
  initialData?: Partial<ProductFormValues>;
  title: string;
  isSubmitting: boolean;
  services?: Service[];
  categories?: Category[];
  selectedService?: string;
  setSelectedService?: (value: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (value: string) => void;
  showServiceCategorySelect?: boolean;
}

export function ProductModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  isSubmitting,
  services = [],
  categories = [],
  selectedService = "",
  setSelectedService = () => {},
  selectedCategory = "",
  setSelectedCategory = () => {},
  showServiceCategorySelect = false,
}: ProductModalProps) {
  const defaultData: ProductFormValues = {
    name: "",
    price: 0,
    ...initialData,
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);
  const isPerItem = selectedServiceData?.pricingModel === "per_item";
  const filteredCategories = categories.filter(
    (cat) => cat.serviceName === selectedServiceData?.name
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {showServiceCategorySelect && (
          <div className="space-y-4 mb-4">
            <div>
              <label className="text-sm font-medium">Select Service</label>
              <Select
                value={selectedService}
                onValueChange={(value) => {
                  setSelectedService(value);
                  setSelectedCategory(""); // Reset category when service changes
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.pricingModel})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isPerItem && (
              <div>
                <label className="text-sm font-medium">Select Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={!selectedService || !filteredCategories.length}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!filteredCategories.length && selectedService && (
                  <p className="text-xs text-red-500">
                    No categories available for this service
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <ProductForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          initialData={defaultData}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
