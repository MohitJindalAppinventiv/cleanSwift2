import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Search, Plus } from "lucide-react";
import { fetchOrders } from "@/store/slices/orderSlice";
import { CalendarDateRangePicker } from "@/components/date-range-picker";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, pagination, isLoading, error } = useAppSelector(
    (state) => state.orders
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setCurrentPage(1);
  //     dispatch(
  //       fetchOrders({
  //         page: 1,
  //         limit: pageSize,
  //         status: statusFilter === "all" ? statusFilter : undefined,
  //         search: searchQuery.trim() !== "" ? searchQuery : undefined,
  //       })
  //     );
  //   }, 300);
  //   return () => clearTimeout(timeoutId);
  // }, [searchQuery, statusFilter, dispatch, pageSize]);

  // // Effect for pagination changes
  // useEffect(() => {
  //   dispatch(
  //     fetchOrders({
  //       page: currentPage,
  //       limit: pageSize,
  //       status: statusFilter !== "all" ? statusFilter : undefined,
  //       search: searchQuery.trim() !== "" ? searchQuery : undefined,
  //     })
  //   );
  // }, [currentPage, dispatch, pageSize, statusFilter, searchQuery]);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     dispatch(
  //       fetchOrders({
  //         page: currentPage,
  //         limit: pageSize,
  //         status: statusFilter !== "all" ? statusFilter : undefined,
  //         search: searchQuery.trim() !== "" ? searchQuery : undefined,
  //       })
  //     );
  //   }, 300);

  //   return () => clearTimeout(timeoutId);
  // }, [searchQuery, statusFilter, currentPage, dispatch, pageSize]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchOrders({
          page: currentPage,
          limit: pageSize,
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: searchQuery.trim() !== "" ? searchQuery : undefined,
          startDate: dateRange.startDate
            ? dateRange.startDate.toISOString().split("T")[0] // format: 2025-01-01
            : undefined,
          endDate: dateRange.endDate
            ? dateRange.endDate.toISOString().split("T")[0]
            : undefined,
        })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, currentPage, dispatch, pageSize, dateRange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleServiceFilterChange = (value: string) => {
    setServiceFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            {/* <Button
              onClick={() =>
                dispatch(
                  fetchOrders({
                    page: currentPage,
                    limit: pageSize,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    search: searchQuery.trim() !== "" ? searchQuery : undefined,
                  })
                )
              }
            >
              Try Again
            </Button> */}
            <Button
              onClick={() =>
                dispatch(
                  fetchOrders({
                    page: currentPage,
                    limit: pageSize,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    search: searchQuery.trim() !== "" ? searchQuery : undefined,
                    startDate: dateRange.startDate
                      ? dateRange.startDate.toISOString().split("T")[0]
                      : undefined,
                    endDate: dateRange.endDate
                      ? dateRange.endDate.toISOString().split("T")[0]
                      : undefined,
                  })
                )
              }
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            <p className="text-muted-foreground">
              View and manage all customer orders
            </p>
          </div>
          {/* <Button asChild>
            <Link to="/order/create">
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Link>
          </Button> */}

          <CalendarDateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        <div className="grid gap-4 md:flex md:items-center md:justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or order ID..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New Order</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pickup">Out for Pickup</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={serviceFilter}
              onValueChange={handleServiceFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="wash_fold">Wash & Fold</SelectItem>
                <SelectItem value="dry_clean">Dry Clean</SelectItem>
                <SelectItem value="express">Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
