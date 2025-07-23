
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { OrderForm } from "./OrderForm";
import { Order, ServiceType, OrderStatus } from "../dashboard/orders/types";
import { format } from "date-fns";

// Define the form data type that matches what OrderForm collects
type OrderFormData = {
  customer: string;
  service: ServiceType;
  status: OrderStatus;
  address: string;
  total: number;
  items: string;
};

export const CreateOrderManager = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrder = async (formData: OrderFormData) => {
    setIsSubmitting(true);
    try {
      // Get the current date for the order creation time
      const orderDate = new Date();
      const date = format(orderDate, "yyyy-MM-dd");
      const time = format(orderDate, "HH:mm:ss");
      
      // Generate a mock order object with all required fields
      const order = {
        ...formData,
        id: `ORD-${Math.floor(Math.random() * 1000)}`,
        date,
        time,
        pickupDate: date, // Using same date as placeholder
        pickupTime: time, // Using same time as placeholder
        deliveryDate: format(new Date(orderDate.getTime() + 86400000), "yyyy-MM-dd"), // Next day delivery
        deliveryTime: time,
        discount: 0,
        deliveryCharge: 3.50,
        totalQuantity: 1, // Default quantity
        paymentStatus: "pending" as const
      };
      
      // In a real application, you would make an API call here to create the order
      console.log("Creating order:", order);
      
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Order created successfully",
        variant: "default",
      });

      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Order</h2>
        <p className="text-muted-foreground">
          Create a new order for a customer
        </p>
      </div>

      <OrderForm 
        onSubmit={handleCreateOrder} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};
