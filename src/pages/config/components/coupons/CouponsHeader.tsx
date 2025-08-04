
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
 
export function CouponsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
        <p className="text-muted-foreground">
          Manage discount coupons for your customers
        </p>
      </div>
      <Button asChild>
        <Link to="/config/coupons/create">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Coupon
        </Link>
      </Button>
    </div>
  );
}
