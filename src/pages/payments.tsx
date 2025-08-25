import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "@/components/ui/sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  
  Search,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/api/axios/axiosInstance";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const statusMap: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const methodMap: Record<string, string> = {
  cod: "Cash on Delivery",
  online: "Online",
};

const PaymentsPage = () => {
  const location = useLocation();

  // Initialize state with values from location.state if available
  const defaultPagination = {
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  const defaultFilters = {
    paymentMethod: [],
    paymentStatus: [],
  };

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(
    location.state?.from === "payments" && location.state?.pagination
      ? location.state.pagination
      : defaultPagination
  );
  const [searchTerm, setSearchTerm] = useState(
    location.state?.from === "payments" && location.state?.searchTerm
      ? location.state.searchTerm
      : ""
  );
  const [sortBy, setSortBy] = useState<"amount" | "date" | "">(
    location.state?.from === "payments" && location.state?.sortBy
      ? location.state.sortBy
      : ""
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    location.state?.from === "payments" && location.state?.sortOrder
      ? location.state.sortOrder
      : "asc"
  );
  const [filters, setFilters] = useState<{
    paymentMethod: string[];
    paymentStatus: string[];
  }>(
    location.state?.from === "payments" && location.state?.filters
      ? location.state.filters
      : defaultFilters
  );

  // Debug log for location.state
  useEffect(() => {
    if (location.state?.from === "payments") {
      console.log("Restoring state from location.state:", location.state);
    }
  }, [location.state]);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Helper function to get sort icons
  const getSortIcon = (field: "amount" | "date") => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  // Memoized stats to avoid recalculation on every render
  const paymentStats = useMemo(() => {
    const totalRevenue = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    const completedPayments = payments.filter(
      (p) => p.paymentStatus === "paid"
    ).length;
    const pendingPayments = payments.filter(
      (p) => p.paymentStatus !== "paid"
    ).length;
    const uniquePaymentMethods = new Set(payments.map((p) => p.paymentMethod))
      .size;

    return {
      totalRevenue,
      completedPayments,
      pendingPayments,
      uniquePaymentMethods,
    };
  }, [payments]);

  // Apply client-side filtering and sorting
  const processedPayments = useMemo(() => {
    let data = [...payments];

    // Filtering
    if (filters.paymentMethod.length > 0) {
      data = data.filter((p) =>
        filters.paymentMethod.includes(p.paymentMethod)
      );
    }

    if (filters.paymentStatus.length > 0) {
      data = data.filter((p) =>
        filters.paymentStatus.includes(p.paymentStatus)
      );
    }

    // Sorting
    if (sortBy === "amount") {
      data.sort((a, b) =>
        sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      );
    } else if (sortBy === "date") {
      data.sort((a, b) => {
        const dateA = new Date(a.dateOfPayment).getTime();
        const dateB = new Date(b.dateOfPayment).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return data;
  }, [payments, sortBy, sortOrder, filters]);

  // Optimized fetch function with useCallback
  const fetchPayments = useCallback(
    async (
      page = pagination.currentPage,
      limit = pagination.itemsPerPage,
      search = debouncedSearchTerm
    ) => {
      try {
        if (search !== debouncedSearchTerm) {
          setSearchLoading(true);
        }

        const response = await axiosInstance.get("/getAllPayments", {
          params: {
            page,
            limit,
            search: search.trim(),
          },
        });

        setPayments(response.data.data.payments || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.data.data.pagination?.currentPage || 1,
          itemsPerPage: response.data.data.pagination?.itemsPerPage || limit,
          totalItems: response.data.data.pagination?.totalItems || 0,
          totalPages: response.data.data.pagination?.totalPages || 1,
          hasNextPage: response.data.data.pagination?.hasNextPage || false,
          hasPreviousPage: response.data.data.pagination?.hasPreviousPage || false,
        }));
        setError(null);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payments. Please try again later.");
        setPayments([]);
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    },
    [debouncedSearchTerm]
  );

  // Handle refresh
  const handleRefresh = async () => {
    try {
      console.log("Starting refresh...");
      setRefreshing(true);
      setSearchTerm("");
      setFilters(defaultFilters);
      setSortBy("");
      setSortOrder("asc");
      setPagination(defaultPagination);
      await fetchPayments(1, defaultPagination.itemsPerPage, "");
      console.log("Refresh successful, triggering success toast");
      toast("Payment data refreshed successfully", {
        duration: 4000,
        style: { background: "#ffffffff", color: "#000000ff" },
      });
    } catch (err) {
      console.error("Failed to refresh payment data:", err);
      toast("Failed to refresh payment data", {
        duration: 4000,
        style: { background: "#EF4444", color: "#FFFFFF" },
      });
    } finally {
      setRefreshing(false);
      console.log("Refresh completed");
    }
  };

  // Effect for initial load and search term changes
  useEffect(() => {
    fetchPayments(pagination.currentPage, pagination.itemsPerPage, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchPayments, pagination.currentPage, pagination.itemsPerPage]);

  // Effect for pagination changes
  useEffect(() => {
    if (!loading && !searchLoading) {
      fetchPayments(
        pagination.currentPage,
        pagination.itemsPerPage,
        debouncedSearchTerm
      );
    }
  }, [pagination.currentPage, pagination.itemsPerPage, fetchPayments, loading, searchLoading, debouncedSearchTerm]);

  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    const newItemsPerPage = parseInt(value, 10);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      itemsPerPage: newItemsPerPage,
    }));
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Generate page numbers for pagination based on server-side data
  const getPageNumbers = useMemo(() => {
    const pages = [];
    const totalPages = pagination.totalPages || 1;
    const currentPage = Math.min(pagination.currentPage, totalPages);

    // Always show first page
    if (totalPages > 0) pages.push(1);

    // Calculate range around current page
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    // Add ellipsis if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) pages.push(totalPages);

    return { pages, totalPages, currentPage };
  }, [pagination.totalPages, pagination.currentPage]);

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  }, []);

  const handleFilterChange = useCallback(
    (key: "paymentMethod" | "paymentStatus", value: string) => {
      setFilters((prev) => {
        const values = prev[key];
        return {
          ...prev,
          [key]: values.includes(value)
            ? values.filter((v) => v !== value)
            : [...values, value],
        };
      });
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    },
    []
  );

  const clearFilter = useCallback(
    (key: "paymentMethod" | "paymentStatus", value?: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value ? prev[key].filter((v) => v !== value) : [],
      }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      paymentMethod: [],
      paymentStatus: [],
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  if (loading && payments.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
            <p className="text-muted-foreground">
              Track and manage payment transactions
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[150px]" />
                  <Skeleton className="h-3 w-[100px] mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-[300px]" />
                  <Skeleton className="h-10 w-[120px]" />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[...Array(7)].map((_, i) => (
                        <TableHead key={i}>
                          <Skeleton className="h-4 w-full" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {[...Array(7)].map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
            <p className="text-muted-foreground">
              Track and manage payment transactions
            </p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    fetchPayments();
                  }}
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">
            Track and manage payment transactions
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              A list of recent payment transactions (
              {processedPayments.length} of {pagination.totalItems} results)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search, Refresh, and Items Per Page Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by order ID or customer name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 h-10 border-input bg-background hover:border-ring transition-colors"
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw
                    className={`h-5 w-5 text-gray-600 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md border">
                <span className="text-sm font-medium whitespace-nowrap text-muted-foreground">
                  Show:
                </span>
                <Select
                  value={pagination.itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[70px] h-8 border-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(filters.paymentMethod.length > 0 ||
              filters.paymentStatus.length > 0) && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Active Filters
                  </span>
                  <div className="flex items-center gap-2 ml-4">
                    {filters.paymentMethod.map((method) => (
                      <span
                        key={method}
                        className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        Method: {methodMap[method] || method}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => clearFilter("paymentMethod", method)}
                        />
                      </span>
                    ))}
                    {filters.paymentStatus.map((status) => (
                      <span
                        key={status}
                        className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        Status: {statusMap[status] || status}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => clearFilter("paymentStatus", status)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Table */}
            <div className="rounded-lg border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b bg-muted/50">
                    <TableHead className="font-semibold text-foreground">
                      Payment ID
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Order ID
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Customer
                    </TableHead>
                    <TableHead
                      onClick={() => {
                        setSortBy("amount");
                        setSortOrder((prev) =>
                          prev === "asc" ? "desc" : "asc"
                        );
                      }}
                      className="text-right font-semibold text-foreground cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-end items-center gap-2">
                        Amount
                        {getSortIcon("amount")}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-800">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-auto p-0 font-semibold hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2 ${
                              filters.paymentMethod.length > 0
                                ? "text-[#9B87F5]"
                                : "text-gray-800"
                            }`}
                          >
                            Payment Method
                            <Filter
                              className={`h-3 w-3 ${
                                filters.paymentMethod.length > 0
                                  ? "text-[#9B87F5]"
                                  : "text-gray-500"
                              }`}
                            />
                            {filters.paymentMethod.length > 0 && (
                              <span className="bg-[#9B87F5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {filters.paymentMethod.length}
                              </span>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuLabel>
                            Filter by Payment Method
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {[
                            { value: "cod", label: "Cash on Delivery" },
                            { value: "online", label: "Online" },
                          ].map((method) => (
                            <DropdownMenuItem
                              key={method.value}
                              onClick={() =>
                                handleFilterChange(
                                  "paymentMethod",
                                  method.value
                                )
                              }
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={filters.paymentMethod.includes(
                                    method.value
                                  )}
                                  onChange={() => {}}
                                  className="rounded border-gray-300"
                                />
                                <span>{method.label}</span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-800">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-auto p-0 font-semibold hover:bg-transparent hover:text-[#9B87F5] flex items-center gap-2 ${
                              filters.paymentStatus.length > 0
                                ? "text-[#9B87F5]"
                                : "text-gray-800"
                            }`}
                          >
                            Status
                            <Filter
                              className={`h-3 w-3 ${
                                filters.paymentStatus.length > 0
                                  ? "text-[#9B87F5]"
                                  : "text-gray-500"
                              }`}
                            />
                            {filters.paymentStatus.length > 0 && (
                              <span className="bg-[#9B87F5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {filters.paymentStatus.length}
                              </span>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuLabel>
                            Filter by Payment Status
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {[
                            { value: "pending", label: "Pending" },
                            { value: "paid", label: "Paid" },
                            { value: "cancelled", label: "Cancelled" },
                            { value: "refunded", label: "Refunded" },
                          ].map((status) => (
                            <DropdownMenuItem
                              key={status.value}
                              onClick={() =>
                                handleFilterChange(
                                  "paymentStatus",
                                  status.value
                                )
                              }
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={filters.paymentStatus.includes(
                                    status.value
                                  )}
                                  onChange={() => {}}
                                  className="rounded border-gray-300"
                                />
                                <span>{status.label}</span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead
                      onClick={() => {
                        setSortBy("date");
                        setSortOrder((prev) =>
                          prev === "asc" ? "desc" : "asc"
                        );
                      }}
                      className="font-semibold text-foreground cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {getSortIcon("date")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedPayments.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={7} className="text-center py-12">
                        {searchTerm ||
                        filters.paymentMethod.length > 0 ||
                        filters.paymentStatus.length > 0 ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                              <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">
                                No payments found
                              </p>
                              <p className="text-muted-foreground text-sm">
                                No results match your current filters or search.
                                Try adjusting your criteria.
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {searchTerm && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSearchTerm("")}
                                  className="mt-2"
                                >
                                  Clear search
                                </Button>
                              )}
                              {(filters.paymentMethod.length > 0 ||
                                filters.paymentStatus.length > 0) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={clearAllFilters}
                                  className="mt-2"
                                >
                                  Clear filters
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                            </div>
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">
                                No payments found
                              </p>
                              <p className="text-muted-foreground text-sm">
                                There are no payment transactions to display.
                              </p>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedPayments.map((payment) => (
                      <TableRow
                        key={payment.paymentId || payment.orderId}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium font-mono text-sm">
                          {payment.paymentId || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            to={`/order-details/${payment.id}`}
                            className="hover:text-blue-800 transition-colors"
                            state={{
                              from: "payments",
                              pagination,
                              searchTerm,
                              sortBy,
                              sortOrder,
                              filters,
                            }}
                            aria-label={`View details for order ${payment.orderId || "N/A"}`}
                          >
                            {payment.orderId || "N/A"}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`../customer-details/${payment.userId}`}
                              className="hover:text-blue-800 transition-colors"
                              state={{
                                from: "payments",
                                pagination,
                                searchTerm,
                                sortBy,
                                sortOrder,
                                filters,
                              }}
                              aria-label={`View details for customer ${payment.customerName || "Unknown"}`}
                            >
                              <span>{payment.customerName || "Unknown"}</span>
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          Rs.{(payment.amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            
                            <span className="capitalize text-sm">
                              {methodMap[payment.paymentMethod] ||
                                payment.paymentMethod ||
                                "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`font-medium ${
                              payment.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                : payment.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                                : payment.paymentStatus === "cancelled"
                                ? "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
                                : payment.paymentStatus === "refunded"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-1 ${
                                payment.paymentStatus === "paid"
                                  ? "bg-green-600 dark:bg-green-400"
                                  : payment.paymentStatus === "pending"
                                  ? "bg-yellow-600 dark:bg-yellow-400"
                                  : payment.paymentStatus === "cancelled"
                                  ? "bg-orange-600 dark:bg-orange-400"
                                  : payment.paymentStatus === "refunded"
                                  ? "bg-purple-600 dark:bg-purple-400"
                                  : "bg-gray-600 dark:bg-gray-400"
                              }`}
                            />
                            {statusMap[payment.paymentStatus] || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.dateOfPayment
                            ? formatDate(payment.dateOfPayment)
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Enhanced Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Showing{" "}
                  {Math.min(
                    (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
                    pagination.totalItems
                  )}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )}{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {pagination.totalItems}
                  </span>{" "}
                  results
                  {processedPayments.length < pagination.totalItems && (
                    <span>
                      {" "}
                      (filtered to {processedPayments.length} results)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(Math.max(1, pagination.currentPage - 1))
                    }
                    disabled={!pagination.hasPreviousPage}
                    className="h-8 px-3"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 mx-1">
                    {getPageNumbers.pages.map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 py-1 text-muted-foreground"
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={
                            getPageNumbers.currentPage === page
                              ? "default"
                              : "ghost"
                          }
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`h-8 w-8 p-0 ${
                            getPageNumbers.currentPage === page
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "hover:bg-muted"
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(
                        Math.min(
                          pagination.totalPages,
                          pagination.currentPage + 1
                        )
                      )
                    }
                    disabled={!pagination.hasNextPage}
                    className="h-8 px-3"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;