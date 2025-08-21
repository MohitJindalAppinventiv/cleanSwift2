import { useState, useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import { fetchOrders } from "@/store/slices/orderSlice";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { format } from "date-fns";

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

interface FetchOrdersParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  includeAnalytics?: boolean;
}

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const {
    orders = [],
    pagination,
    analytics,
    isLoading,
    error,
  } = useAppSelector((state) => state.orders);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [pageSize, setPageSize] = useState<number>(10);

  // Use analytics from API if available, otherwise fallback to client-side calculation
  const stats = useMemo(() => {
    if (analytics) {
      // Use server-side analytics data
      return {
        totalOrders: analytics.totalOrders || 0,
        processing: analytics.totalProcessingOrder || 0,
        delivered: analytics.totalDeliveredOrder || 0,
        cancelled: analytics.totalCancelledOrder || 0,
        totalUsers: analytics.totalUsers || 0,
      };
    }

    // Fallback to client-side calculation if analytics not available
    if (!Array.isArray(orders)) {
      return {
        totalOrders: 0,
        processing: 0,
        delivered: 0,
        cancelled: 0,
        totalUsers: 0,
      };
    }

    return {
      totalOrders: pagination?.total || orders.length,
      processing: orders.filter((order) => order?.status === "processing")
        .length,
      delivered: orders.filter((order) => order?.status === "delivered").length,
      cancelled: orders.filter((order) => order?.status === "cancelled").length,
      totalUsers: 0, // Not available from client-side calculation
    };
  }, [orders, pagination?.total, analytics]);

  // Memoized fetch params
  const fetchParams = useMemo((): FetchOrdersParams => {
    const params: FetchOrdersParams = {
      page: currentPage,
      limit: pageSize,
      includeAnalytics: true, // Always include analytics
    };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }
    if (paymentMethodFilter !== "all") {
      params.paymentMethod = paymentMethodFilter;
    }
    if (searchQuery.trim() !== "") {
      params.search = searchQuery.trim();
    }
    if (dateRange.startDate) {
      params.startDate = format(dateRange.startDate, "yyyy-MM-dd");
    }
    if (dateRange.endDate) {
      params.endDate = format(dateRange.endDate, "yyyy-MM-dd");
    }

    return params;
  }, [
    currentPage,
    pageSize,
    statusFilter,
    paymentMethodFilter,
    searchQuery,
    dateRange,
  ]);

  // Fetch orders with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchOrders(fetchParams));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, fetchParams]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePaymentMethodFilterChange = useCallback((value: string) => {
    setPaymentMethodFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleDateRangeChange = useCallback((newDateRange: DateRange) => {
    setDateRange(newDateRange);
    setCurrentPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    dispatch(fetchOrders(fetchParams));
  }, [dispatch, fetchParams]);

  const filterBadges = useMemo(
    () => (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-600">
          Active Filters:
        </span>
        {statusFilter !== "all" && (
          <Badge
            variant="outline"
            className="text-xs bg-white border-gray-300 text-gray-700"
          >
            Status: {statusFilter}
          </Badge>
        )}
        {paymentMethodFilter !== "all" && (
          <Badge
            variant="outline"
            className="text-xs bg-white border-gray-300 text-gray-700"
          >
            Payment: {paymentMethodFilter}
          </Badge>
        )}
        {dateRange.startDate && (
          <Badge
            variant="outline"
            className="text-xs bg-white border-gray-300 text-gray-700"
          >
            From: {format(dateRange.startDate, "MMM dd, yyyy")}
          </Badge>
        )}
        {dateRange.endDate && (
          <Badge
            variant="outline"
            className="text-xs bg-white border-gray-300 text-gray-700"
          >
            To: {format(dateRange.endDate, "MMM dd, yyyy")}
          </Badge>
        )}
      </div>
    ),
    [statusFilter, paymentMethodFilter, dateRange]
  );

  const hasActiveFilters =
    statusFilter !== "all" ||
    paymentMethodFilter !== "all" ||
    dateRange.startDate ||
    dateRange.endDate;

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4 text-lg">{error}</p>
            <Button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  Orders Management
                </h1>
                <p className="text-gray-600 text-lg mt-1">
                  Monitor and manage all customer orders in real-time
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <CalendarDateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            {/* Total Orders */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Processing */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-md">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Processing
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.processing.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delivered */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.delivered.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cancelled */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-md">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.cancelled.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Total Users - New analytics from API */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-md">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        {/* Filters */}
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search and Filters Row */}
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                {/* Left Side: Search + Status Filter */}
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center flex-1">
                  <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search by customer name, order ID, or phone..."
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>

                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                  >
                    <SelectTrigger className="w-[180px] h-11 bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="outForPickup">
                        Out for Pickup
                      </SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="outForDelivery">
                        Out For Delivery
                      </SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Right Side: Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Show:
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) =>
                      handlePageSizeChange(Number(value))
                    }
                  >
                    <SelectTrigger className="w-[80px] h-11 bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
