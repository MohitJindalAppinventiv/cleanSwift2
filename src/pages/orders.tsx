// // import { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import { useAppDispatch, useAppSelector } from "@/hooks/redux";
// // import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// // import { OrdersTable } from "@/components/dashboard/OrdersTable";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Input } from "@/components/ui/input";
// // import { Search, Plus } from "lucide-react";
// // import { fetchOrders } from "@/store/slices/orderSlice";
// // import { CalendarDateRangePicker } from "@/components/date-range-picker";

// // const OrdersPage = () => {
// //   const dispatch = useAppDispatch();
// //   const { orders, pagination, isLoading, error } = useAppSelector(
// //     (state) => state.orders
// //   );

// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [serviceFilter, setServiceFilter] = useState("all");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [pageSize] = useState(10);

// //   const [dateRange, setDateRange] = useState<{
// //     startDate?: Date;
// //     endDate?: Date;
// //   }>({});

// //   useEffect(() => {
// //     const timeoutId = setTimeout(() => {
// //       dispatch(
// //         fetchOrders({
// //           page: currentPage,
// //           limit: pageSize,
// //           status: statusFilter !== "all" ? statusFilter : undefined,
// //           search: searchQuery.trim() !== "" ? searchQuery : undefined,
// //           startDate: dateRange.startDate
// //             ? dateRange.startDate.toISOString().split("T")[0] // format: 2025-01-01
// //             : undefined,
// //           endDate: dateRange.endDate
// //             ? dateRange.endDate.toISOString().split("T")[0]
// //             : undefined,
// //         })
// //       );
// //     }, 300);

// //     return () => clearTimeout(timeoutId);
// //   }, [searchQuery, statusFilter, currentPage, dispatch, pageSize, dateRange]);

// //   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setSearchQuery(e.target.value);
// //   };

// //   const handleStatusFilterChange = (value: string) => {
// //     setStatusFilter(value);
// //     setCurrentPage(1); // Reset to first page when filter changes
// //   };

// //   const handleServiceFilterChange = (value: string) => {
// //     setServiceFilter(value);
// //     setCurrentPage(1); // Reset to first page when filter changes
// //   };

// //   const handlePageChange = (page: number) => {
// //     setCurrentPage(page);
// //   };

// //   if (error) {
// //     return (
// //       <DashboardLayout>
// //         <div className="flex items-center justify-center min-h-[400px]">
// //           <div className="text-center">
// //             <p className="text-red-500 mb-4">{error}</p>
// //             <Button
// //               onClick={() =>
// //                 dispatch(
// //                   fetchOrders({
// //                     page: currentPage,
// //                     limit: pageSize,
// //                     status: statusFilter !== "all" ? statusFilter : undefined,
// //                     search: searchQuery.trim() !== "" ? searchQuery : undefined,
// //                     startDate: dateRange.startDate
// //                       ? dateRange.startDate.toISOString().split("T")[0]
// //                       : undefined,
// //                     endDate: dateRange.endDate
// //                       ? dateRange.endDate.toISOString().split("T")[0]
// //                       : undefined,
// //                   })
// //                 )
// //               }
// //             >
// //               Try Again
// //             </Button>
// //           </div>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   return (
// //     <DashboardLayout>
// //       <div className="space-y-6">
// //         <div className="flex justify-between items-center">
// //           <div>
// //             <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
// //             <p className="text-muted-foreground">
// //               View and manage all customer orders
// //             </p>
// //           </div>
// //           <CalendarDateRangePicker value={dateRange} onChange={setDateRange} />
// //         </div>

// //         <div className="grid gap-4 md:flex md:items-center md:justify-between">
// //           <div className="relative max-w-sm">
// //             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// //             <Input
// //               type="search"
// //               placeholder="Search by name or order ID..."
// //               className="pl-8 w-full md:w-[300px]"
// //               value={searchQuery}
// //               onChange={handleSearch}
// //             />
// //           </div>
// //           <div className="flex flex-wrap items-center gap-2">
// //             <Select
// //               value={statusFilter}
// //               onValueChange={handleStatusFilterChange}
// //             >
// //               <SelectTrigger className="w-[180px]">
// //                 <SelectValue placeholder="Status" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="all">All Statuses</SelectItem>
// //                 <SelectItem value="new">New Order</SelectItem>
// //                 <SelectItem value="processing">Processing</SelectItem>
// //                 <SelectItem value="outForPickup">Out for Pickup</SelectItem>
// //                 <SelectItem value="delivered">Delivered</SelectItem>
// //                 <SelectItem value="completed">Completed</SelectItem>
// //                 <SelectItem value="pending">Pending</SelectItem>
// //                 <SelectItem value="ready">Ready</SelectItem>
// //                 <SelectItem value="outForDelivery">Out For Delivery</SelectItem>
// //                 <SelectItem value="cancelled">Cancelled</SelectItem>
// //               </SelectContent>
// //             </Select>
// //             <Select
// //               value={serviceFilter}
// //               onValueChange={handleServiceFilterChange}
// //             >
// //               <SelectTrigger className="w-[180px]">
// //                 <SelectValue placeholder="Service Type" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="all">All Services</SelectItem>
// //                 <SelectItem value="wash_fold">Wash & Fold</SelectItem>
// //                 <SelectItem value="dry_clean">Dry Clean</SelectItem>
// //                 <SelectItem value="express">Express</SelectItem>
// //               </SelectContent>
// //             </Select>
// //           </div>
// //         </div>

// //         <OrdersTable
// //           orders={orders}
// //           pagination={pagination}
// //           isLoading={isLoading}
// //           onPageChange={handlePageChange}
// //         />
// //       </div>
// //     </DashboardLayout>
// //   );
// // };

// // export default OrdersPage;



// import { useState, useEffect, useCallback, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "@/hooks/redux";
// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { OrdersTable } from "@/components/dashboard/OrdersTable";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Search, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
// import { fetchOrders } from "@/store/slices/orderSlice";
// import { CalendarDateRangePicker } from "@/components/date-range-picker";

// interface DateRange {
//   startDate?: Date;
//   endDate?: Date;
// }

// interface FetchOrdersParams {
//   page: number;
//   limit: number;
//   status?: string;
//   search?: string;
//   startDate?: string;
//   endDate?: string;
// }

// const OrdersPage = () => {
//   const dispatch = useAppDispatch();
//   const { orders = [], pagination, isLoading, error } = useAppSelector(
//     (state) => state.orders
//   );

//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [serviceFilter, setServiceFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dateRange, setDateRange] = useState<DateRange>({});

//   const pageSize = 10; // Removed useState as it's constant

//   // Memoized stats calculation to prevent unnecessary recalculations
//   const stats = useMemo(() => {
//     if (!Array.isArray(orders)) {
//       return {
//         totalOrders: 0,
//         newOrders: 0,
//         processing: 0,
//         completed: 0,
//       };
//     }

//     return {
//       totalOrders: pagination?.total || orders.length,
//       newOrders: orders.filter(order => order?.status === 'new').length,
//       processing: orders.filter(order => order?.status === 'processing').length,
//       completed: orders.filter(order => order?.status === 'completed').length,
//     };
//   }, [orders, pagination?.total]);

//   // Memoized fetch params to prevent unnecessary effect triggers
//   const fetchParams = useMemo((): FetchOrdersParams => {
//     const params: FetchOrdersParams = {
//       page: currentPage,
//       limit: pageSize,
//     };

//     if (statusFilter !== "all") {
//       params.status = statusFilter;
//     }

//     if (searchQuery.trim() !== "") {
//       params.search = searchQuery.trim();
//     }

//     if (dateRange.startDate) {
//       params.startDate = dateRange.startDate.toISOString().split("T")[0];
//     }

//     if (dateRange.endDate) {
//       params.endDate = dateRange.endDate.toISOString().split("T")[0];
//     }

//     return params;
//   }, [currentPage, pageSize, statusFilter, searchQuery, dateRange]);

//   // Debounced fetch function
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       dispatch(fetchOrders(fetchParams));
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [dispatch, fetchParams]);

//   // Memoized event handlers to prevent unnecessary re-renders
//   const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset to first page when searching
//   }, []);

//   const handleStatusFilterChange = useCallback((value: string) => {
//     setStatusFilter(value);
//     setCurrentPage(1);
//   }, []);

//   const handleServiceFilterChange = useCallback((value: string) => {
//     setServiceFilter(value);
//     setCurrentPage(1);
//   }, []);

//   const handlePageChange = useCallback((page: number) => {
//     setCurrentPage(page);
//   }, []);

//   const handleDateRangeChange = useCallback((newDateRange: DateRange) => {
//     setDateRange(newDateRange);
//     setCurrentPage(1); // Reset to first page when date range changes
//   }, []);

//   // Memoized retry function
//   const handleRetry = useCallback(() => {
//     dispatch(fetchOrders(fetchParams));
//   }, [dispatch, fetchParams]);

//   // Memoized filter badges
//   const filterBadges = useMemo(() => (
//     <div className="flex items-center gap-2">
//       <span className="text-sm font-medium text-gray-600">Active Filters:</span>
//       <Badge variant="outline" className="text-xs bg-white border-gray-300 text-gray-700">
//         {statusFilter === 'all' ? 'All Statuses' : statusFilter}
//       </Badge>
//       <Badge variant="outline" className="text-xs bg-white border-gray-300 text-gray-700">
//         {serviceFilter === 'all' ? 'All Services' : serviceFilter}
//       </Badge>
//     </div>
//   ), [statusFilter, serviceFilter]);

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <p className="text-red-600 mb-4 text-lg">{error}</p>
//             <Button
//               onClick={handleRetry}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Try Again
//             </Button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-8 bg-white min-h-screen">
//         {/* Enhanced Header Section */}
//         <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg border border-gray-200">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="space-y-2">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Package className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h1 className="text-4xl font-bold tracking-tight text-gray-900">
//                     Orders Management
//                   </h1>
//                   <p className="text-gray-600 text-lg mt-1">
//                     Monitor and manage all customer orders in real-time
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Calendar Date Picker moved to top right */}
//             <div className="flex justify-end">
//               <CalendarDateRangePicker 
//                 value={dateRange} 
//                 onChange={handleDateRangeChange} 
//               />
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
//             <Card className="bg-white border-gray-200 shadow-sm">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-50 rounded-md">
//                     <Package className="h-4 w-4 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white border-gray-200 shadow-sm">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-orange-50 rounded-md">
//                     <TrendingUp className="h-4 w-4 text-orange-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">New Orders</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.newOrders}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white border-gray-200 shadow-sm">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-yellow-50 rounded-md">
//                     <Clock className="h-4 w-4 text-yellow-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Processing</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white border-gray-200 shadow-sm">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-green-50 rounded-md">
//                     <CheckCircle className="h-4 w-4 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Completed</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Enhanced Filters Section */}
//         <Card className="border-gray-200 shadow-sm bg-white">
//           <CardContent className="p-6">
//             <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
//               <div className="flex-1 max-w-md">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     type="search"
//                     placeholder="Search by customer name, order ID, or phone..."
//                     className="pl-10 h-11 border-gray-300 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder:text-gray-500"
//                     value={searchQuery}
//                     onChange={handleSearch}
//                   />
//                 </div>
//               </div>
              
//               <div className="flex flex-wrap items-center gap-3">
//                 {(statusFilter !== 'all' || serviceFilter !== 'all') && filterBadges}
                
//                 <Select
//                   value={statusFilter}
//                   onValueChange={handleStatusFilterChange}
//                 >
//                   <SelectTrigger className="w-[180px] h-11 bg-white border-gray-300 text-gray-900">
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border-gray-200">
//                     <SelectItem value="all">All Statuses</SelectItem>
//                     <SelectItem value="new">New Order</SelectItem>
//                     <SelectItem value="processing">Processing</SelectItem>
//                     <SelectItem value="outForPickup">Out for Pickup</SelectItem>
//                     <SelectItem value="delivered">Delivered</SelectItem>
//                     <SelectItem value="completed">Completed</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="ready">Ready</SelectItem>
//                     <SelectItem value="outForDelivery">Out For Delivery</SelectItem>
//                     <SelectItem value="cancelled">Cancelled</SelectItem>
//                   </SelectContent>
//                 </Select>
                
//                 {/* <Select
//                   value={serviceFilter}
//                   onValueChange={handleServiceFilterChange}
//                 >
//                   <SelectTrigger className="w-[180px] h-11 bg-white border-gray-300 text-gray-900">
//                     <SelectValue placeholder="Service Type" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border-gray-200">
//                     <SelectItem value="all">All Services</SelectItem>
//                     <SelectItem value="wash_fold">Wash & Fold</SelectItem>
//                     <SelectItem value="dry_clean">Dry Clean</SelectItem>
//                     <SelectItem value="express">Express</SelectItem>
//                   </SelectContent>
//                 </Select> */}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <OrdersTable
//           orders={orders}
//           pagination={pagination}
//           isLoading={isLoading}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default OrdersPage;



import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { fetchOrders } from "@/store/slices/orderSlice";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { format } from "date-fns"; // Added import for local date formatting

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
}

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders = [], pagination, isLoading, error } = useAppSelector(
    (state) => state.orders
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({});

  const pageSize = 10; // Removed useState as it's constant

  // Memoized stats calculation to prevent unnecessary recalculations
  const stats = useMemo(() => {
    if (!Array.isArray(orders)) {
      return {
        totalOrders: 0,
        newOrders: 0,
        processing: 0,
        completed: 0,
      };
    }

    return {
      totalOrders: pagination?.total || orders.length,
      newOrders: orders.filter(order => order?.status === 'new').length,
      processing: orders.filter(order => order?.status === 'processing').length,
      completed: orders.filter(order => order?.status === 'completed').length,
    };
  }, [orders, pagination?.total]);

  // Memoized fetch params to prevent unnecessary effect triggers
  const fetchParams = useMemo((): FetchOrdersParams => {
    const params: FetchOrdersParams = {
      page: currentPage,
      limit: pageSize,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (searchQuery.trim() !== "") {
      params.search = searchQuery.trim();
    }

    if (dateRange.startDate) {
      params.startDate = format(dateRange.startDate, "yyyy-MM-dd"); // Use local format to avoid UTC shift
    }

    if (dateRange.endDate) {
      params.endDate = format(dateRange.endDate, "yyyy-MM-dd"); // Use local format to avoid UTC shift
    }

    return params;
  }, [currentPage, pageSize, statusFilter, searchQuery, dateRange]);

  // Debounced fetch function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchOrders(fetchParams));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, fetchParams]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleServiceFilterChange = useCallback((value: string) => {
    setServiceFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDateRangeChange = useCallback((newDateRange: DateRange) => {
    setDateRange(newDateRange);
    setCurrentPage(1); // Reset to first page when date range changes
  }, []);

  // Memoized retry function
  const handleRetry = useCallback(() => {
    dispatch(fetchOrders(fetchParams));
  }, [dispatch, fetchParams]);

  // Memoized filter badges
  const filterBadges = useMemo(() => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Active Filters:</span>
      <Badge variant="outline" className="text-xs bg-white border-gray-300 text-gray-700">
        {statusFilter === 'all' ? 'All Statuses' : statusFilter}
      </Badge>
      <Badge variant="outline" className="text-xs bg-white border-gray-300 text-gray-700">
        {serviceFilter === 'all' ? 'All Services' : serviceFilter}
      </Badge>
    </div>
  ), [statusFilter, serviceFilter]);

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
        {/* Enhanced Header Section */}
        <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
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
            </div>
            
            {/* Calendar Date Picker moved to top right */}
            <div className="flex justify-end">
              <CalendarDateRangePicker 
                value={dateRange} 
                onChange={handleDateRangeChange} 
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-md">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.newOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-md">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processing</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-md">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search by customer name, order ID, or phone..."
                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder:text-gray-500"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {(statusFilter !== 'all' || serviceFilter !== 'all') && filterBadges}
                
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-[180px] h-11 bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New Order</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="outForPickup">Out for Pickup</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="outForDelivery">Out For Delivery</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* <Select
                  value={serviceFilter}
                  onValueChange={handleServiceFilterChange}
                >
                  <SelectTrigger className="w-[180px] h-11 bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="wash_fold">Wash & Fold</SelectItem>
                    <SelectItem value="dry_clean">Dry Clean</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
            </div>
          </CardContent>
        </Card>

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