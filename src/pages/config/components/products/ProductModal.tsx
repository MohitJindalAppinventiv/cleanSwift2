import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm, ProductFormValues } from "./ProductForm";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormValues) => void;
  initialData?: Partial<ProductFormValues>;
  title: string;
  isSubmitting: boolean;
}

export function ProductModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  isSubmitting,
}: ProductModalProps) {
  // Provide default values to ensure initialData is a complete ProductFormValues
  const defaultData: ProductFormValues = {
    name: "",
    price: 0,
    ...initialData,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
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