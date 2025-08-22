import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";
import axios from 'axios';
import { axiosInstance } from '@/api/axios/axiosInstance';

// Define the shape of the data
interface RevenueData {
  name: string;
  revenue: number;
}

// Define the shape of the API response
interface ApiResponse {
  data: RevenueData[];
}

// Mock data to simulate API response
// const mockData: RevenueData[] = [
//   { name: 'Jan', revenue: 3200 },
//   { name: 'Feb', revenue: 4100 },
//   { name: 'Mar', revenue: 3800 },
//   { name: 'Apr', revenue: 4700 },
//   { name: 'May', revenue: 5200 },
//   { name: 'Jun', revenue: 5100 },
//   { name: 'Jul', revenue: 6200 },
//   { name: 'Aug', revenue: 5900 },
//   { name: 'Sep', revenue: 6500 },
//   { name: 'Oct', revenue: 7200 },
//   { name: 'Nov', revenue: 6800 },
//   { name: 'Dec', revenue: 7500 },
// ];

// // Mock API function to simulate fetching data
// const mockApiCall = (): Promise<ApiResponse> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ data: mockData });
//     }, 1000); // Simulate network delay
//   });
// };

export function RevenueChart() {
  const isMobile = useIsMobile();
  const [chartHeight, setChartHeight] = useState<number>(350);
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setChartHeight(isMobile ? 250 : 350);
  }, [isMobile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace mockApiCall with actual axios.get when using real API
        const response = await axiosInstance.get('/getMonthlyRevenueTrend');
        // console.log(response);
        // For real API, use: const response = await axios.get<ApiResponse>('https://api.example.com/revenue-data');
        setData(response.data.data.revenueChart);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch revenue data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[250px]">
            <div className="animate-pulse">
              {/* Skeleton for chart area */}
              <div className="h-[200px] bg-gray-200 rounded-md mb-2"></div>
              {/* Skeleton for X-axis */}
              <div className="flex justify-between">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="w-8 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              {/* Skeleton for Y-axis */}
              <div className="absolute left-0 top-0 h-[200px] w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[250px]">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} />
            <YAxis
              stroke="#888"
              fontSize={12}
              tickFormatter={(value: number) => `Rs.${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`Rs.${value}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#9b87f5"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}