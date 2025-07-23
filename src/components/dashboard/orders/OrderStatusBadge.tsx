
import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "./types";
import { Check, Clock, Package, Truck, UserCheck } from "lucide-react";

export const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  new: {
    label: "New Order",
    color: "bg-blue-500",
    icon: <Package className="h-3 w-3" />,
  },
  processing: {
    label: "Processing",
    color: "bg-yellow-500",
    icon: <Clock className="h-3 w-3" />,
  },
  pickup: {
    label: "Out for Pickup",
    color: "bg-purple-500",
    icon: <UserCheck className="h-3 w-3" />,
  },
  delivered: {
    label: "Delivered",
    color: "bg-indigo-500",
    icon: <Truck className="h-3 w-3" />,
  },
  completed: {
    label: "Completed",
    color: "bg-green-500",
    icon: <Check className="h-3 w-3" />,
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { label, color, icon } = statusConfig[status];
  return (
    <Badge
      className={`${color} text-white flex items-center gap-1`}
      variant="outline"
    >
      {icon}
      {label}
    </Badge>
  );
}
