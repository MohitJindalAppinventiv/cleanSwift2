
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

// Sample data for the chart
const data = [
  { name: 'Jan', revenue: 3200 },
  { name: 'Feb', revenue: 4100 },
  { name: 'Mar', revenue: 3800 },
  { name: 'Apr', revenue: 4700 },
  { name: 'May', revenue: 5200 },
  { name: 'Jun', revenue: 5100 },
  { name: 'Jul', revenue: 6200 },
  { name: 'Aug', revenue: 5900 },
  { name: 'Sep', revenue: 6500 },
  { name: 'Oct', revenue: 7200 },
  { name: 'Nov', revenue: 6800 },
  { name: 'Dec', revenue: 7500 },
];

export function RevenueChart() {
  const isMobile = useIsMobile();
  const [chartHeight, setChartHeight] = useState(350);

  useEffect(() => {
    setChartHeight(isMobile ? 250 : 350);
  }, [isMobile]);

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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value}`, 'Revenue']}
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
