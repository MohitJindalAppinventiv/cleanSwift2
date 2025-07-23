
import { Package, Users, CreditCard, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardMetrics() {
  const isMobile = useIsMobile();

  return (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"}`}>
      <StatCard
        title="Total Orders"
        value="2,856"
        icon={<Package size={16} />}
        description="Total orders processed"
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Active Customers"
        value="1,452"
        icon={<Users size={16} />}
        description="Customers with orders"
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="Revenue"
        value="$34,782"
        icon={<CreditCard size={16} />}
        description="This month's revenue"
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title="Avg. Order Value"
        value="$32.65"
        icon={<TrendingUp size={16} />}
        description="Per customer order"
        trend={{ value: 2, isPositive: false }}
      />
    </div>
  );
}
