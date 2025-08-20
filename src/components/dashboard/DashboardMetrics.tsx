
// import { Package, Users, CreditCard, TrendingUp } from "lucide-react";
// import { StatCard } from "./StatCard";
// import { useIsMobile } from "@/hooks/use-mobile";

// export function DashboardMetrics() {
//   const isMobile = useIsMobile();

//   return (
//     <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"}`}>
//       <StatCard
//         title="Total Orders"
//         value="2,856"
//         icon={<Package size={16} />}
//         description="Total orders processed"
//         trend={{ value: 12, isPositive: true }}
//       />
//       <StatCard
//         title="Active Customers"
//         value="1,452"
//         icon={<Users size={16} />}
//         description="Customers with orders"
//         trend={{ value: 8, isPositive: true }}
//       />
//       <StatCard
//         title="Revenue"
//         value="$34,782"
//         icon={<CreditCard size={16} />}
//         description="This month's revenue"
//         trend={{ value: 5, isPositive: true }}
//       />
//       <StatCard
//         title="Avg. Order Value"
//         value="$32.65"
//         icon={<TrendingUp size={16} />}
//         description="Per customer order"
//         trend={{ value: 2, isPositive: false }}
//       />
//     </div>
//   );
// }



import { Package, Users, CreditCard, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import axios from 'axios';
import { axiosInstance } from "@/api/axios/axiosInstance";

// Create axios instance with base configuration
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  averageOrderValue: number;
  lastUpdated: string;
}

interface ApiResponse {
  success: boolean;
  data: DashboardStats;
}

export function DashboardMetrics() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get('/getDashboardStats');
        
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          throw new Error('Failed to fetch dashboard statistics');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message || 'Network error occurred');
        } else {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading) {
    return (
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"}`}>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">Error loading dashboard metrics</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  // Handle case where admin is new and has no data
  if (!stats || (stats.totalOrders === 0 && stats.totalRevenue === 0)) {
    return (
      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"}`}>
        <StatCard
          title="Total Orders"
          value="0"
          icon={<Package size={16} />}
          description="No orders yet"
        />
        <StatCard
          title="Active Customers"
          value="0"
          icon={<Users size={16} />}
          description="No customers yet"
        />
        <StatCard
          title="Revenue"
          value="₹0"
          icon={<CreditCard size={16} />}
          description="No revenue yet"
        />
        <StatCard
          title="Avg. Order Value"
          value="₹0"
          icon={<TrendingUp size={16} />}
          description="No orders to calculate"
        />
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"}`}>
      <StatCard
        title="Total Orders"
        value={formatNumber(stats.totalOrders)}
        icon={<Package size={16} />}
        description="Total orders processed"
      />
      <StatCard
        title="Active Customers"
        value={formatNumber(stats.activeCustomers)}
        icon={<Users size={16} />}
        description="Customers with orders"
      />
      <StatCard
        title="Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={<CreditCard size={16} />}
        description="Total revenue"
      />
      <StatCard
        title="Avg. Order Value"
        value={formatCurrency(stats.averageOrderValue)}
        icon={<TrendingUp size={16} />}
        description="Per customer order"
      />
    </div>
  );
}