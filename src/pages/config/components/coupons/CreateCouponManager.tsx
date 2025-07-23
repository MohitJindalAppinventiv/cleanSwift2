
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CouponForm } from "./CouponForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function CreateCouponManager() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/config/coupons")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coupons
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create New Coupon</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CouponForm />
        </CardContent>
      </Card>
    </div>
  );
}
