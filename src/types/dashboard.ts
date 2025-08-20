
// types/dashboard.ts
export interface DistributionItem {
  name: string;
  value: number;
}

export interface DashboardStatsData {
  totalOrders: number;
  totalRevenue: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  orderDistribution: DistributionItem[];
  revenueDistribution: DistributionItem[];
  lastUpdated: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStatsData;
}