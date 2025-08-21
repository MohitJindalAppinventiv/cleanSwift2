import { axiosInstance } from "@/api/axios/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ import Skeleton

// Base purplish shades for fallback
const BASE_COLORS = [
  "#9b87f5", // lavender
  "#7E69AB", // deep purple
  "#D6BCFA", // light lavender
  "#6C5CE7", // indigo purple
  "#A78BFA", // medium violet
  "#C4B5FD", // soft lilac
  "#8B5CF6", // vibrant purple
  "#5B21B6", // dark purple
  "#B794F4", // pastel violet
  "#E9D5FF", // very light lavender
];

interface DistributionData {
  name: string;
  value: number;
  percentage: number;
}

// interface ApiResponse {
//   success: boolean;
//   data: {
//     orderDistribution: DistributionData[];
//     revenueDistribution: DistributionData[];
//     revenueChart: any[];
//     lastUpdated: string;
//   };
// }

// Generate purplish shades only using HSL
const generatePurplishColors = (count: number): string[] => {
  const colors: string[] = [];
  const baseHue = 270; // fixed hue for purple
  const saturation = 65; // consistent saturation
  const lightnessStart = 40; // darker shade
  const lightnessEnd = 75; // lighter shade

  for (let i = 0; i < count; i++) {
    const lightness =
      lightnessStart +
      ((lightnessEnd - lightnessStart) * i) / Math.max(1, count - 1);
    colors.push(`hsl(${baseHue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

export function ServicePerformance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataType, setDataType] = useState<"orders" | "revenue">("orders");
  const [distributionData, setDistributionData] = useState<DistributionData[]>(
    []
  );
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    fetchDistributionData();
  }, []);

  // Update colors when distribution data changes
  useEffect(() => {
    if (distributionData.length > 0) {
      const generatedColors = generatePurplishColors(distributionData.length);
      setColors(generatedColors);
    }
  }, [distributionData]);

  const fetchDistributionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/getDashboardDistribution");

      if (response.data.success) {
        setDistributionData(response.data.data.orderDistribution);
      } else {
        setError("Failed to fetch distribution data");
      }
    } catch (err) {
      setError("Error fetching distribution data");
      console.error("Error fetching distribution data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (distributionData.length > 0) {
      fetchDataByType();
    }
  }, [dataType]);

  // const fetchDataByType = async () => {
  //   try {
  //     const response = await axiosInstance.get("/getDashboardDistribution");

  //     if (response.data.success) {
  //       if (dataType === "orders") {
  //         setDistributionData(response.data.data.orderDistribution);
  //       } else {
  //         setDistributionData(response.data.data.revenueDistribution);
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error updating distribution data:", err);
  //   }
  // };

  const fetchDataByType = async () => {
  try {
    setLoading(true); // ✅ show skeleton when dropdown changes
    const response = await axiosInstance.get("/getDashboardDistribution");
    if (response.data.success) {
      if (dataType === "orders") {
        setDistributionData(response.data.data.orderDistribution);
      } else {
        setDistributionData(response.data.data.revenueDistribution);
      }
    }
  } catch (err) {
    console.error("Error updating distribution data:", err);
  } finally {
    setLoading(false); // ✅ hide skeleton after data is loaded
  }
};

  const formatTooltipValue = (value: number) => {
    if (dataType === "revenue") {
      return `₹${value.toLocaleString()}`;
    }
    return `${value}`;
  };

  const formatLabel = (entry: DistributionData) => {
    if (dataType === "revenue") {
      return `${entry.name}: ₹${entry.value.toLocaleString()} (${
        entry.percentage
      }%)`;
    }
    return `${entry.name}: ${entry.value} (${entry.percentage}%)`;
  };

  // ✅ Skeleton loading state
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-6 w-40" /> {/* title skeleton */}
          <Skeleton className="h-9 w-[180px]" />{" "}
          {/* select dropdown skeleton */}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Skeleton className="rounded-full h-48 w-48" />{" "}
            {/* circular chart skeleton */}
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchDistributionData}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (distributionData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          {dataType === "orders"
            ? "Orders Distribution"
            : "Revenue Distribution"}
        </CardTitle>
        <Select
          value={dataType}
          onValueChange={(value: "orders" | "revenue") => setDataType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orders">Order Wise</SelectItem>
            <SelectItem value="revenue">Revenue Wise</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percentage }: DistributionData) =>
                `${name}: ${percentage}%`
              }
            >
              {distributionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}-${entry.name}`}
                  fill={
                    colors[index] || BASE_COLORS[index % BASE_COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                formatTooltipValue(value),
                name,
              ]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value, entry, index) => {
                const dataEntry = distributionData[index];
                return formatLabel(dataEntry);
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
