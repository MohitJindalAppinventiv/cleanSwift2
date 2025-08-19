
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ServicePerformance } from "@/components/dashboard/ServicePerformance";
import { RecentCustomers } from "@/components/dashboard/RecentCustomers";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import { fetchOrders } from "@/store/slices/orderSlice";


const Index = () => {
  const dispatch=useAppDispatch();
  const isMobile = useIsMobile();
  const { orders, pagination, isLoading, error } = useAppSelector(
    (state) => state.orders
  );
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

  useEffect(()=>{
    dispatch(fetchOrders({
        page: currentPage,
        limit: pageSize,
      }));
  },[])
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to CleanSwift Admin. View your business metrics and manage operations.
        </p>

        <DashboardOverview />
        
        <DashboardMetrics />

        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
          <RevenueChart />
          <ServicePerformance />
        </div>

        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>
          <div className={`${isMobile ? "" : "lg:col-span-2"}`}>
            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
            <OrdersTable orders={orders} pagination={pagination} isLoading={isLoading} />
          </div>
          <div>
            <RecentCustomers />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
