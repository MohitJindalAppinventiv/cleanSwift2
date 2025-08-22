
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CustomerForm } from "./CustomerForm";
import { Customer } from "./types";

export const CreateCustomerManager = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCustomer = async (data: Omit<Customer, "id" | "orders" | "spent" | "lastOrder">) => {
    setIsSubmitting(true);
    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real application, you would make an API call here to create the customer
      // console.log("Creating customer:", data);
      
      toast({
        title: "Success",
        description: "Customer created successfully",
        variant: "default",
      });

      navigate("/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Customer</h2>
        <p className="text-muted-foreground">
          Create a new customer in your database
        </p>
      </div>

      <CustomerForm 
        onSubmit={handleCreateCustomer} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};
