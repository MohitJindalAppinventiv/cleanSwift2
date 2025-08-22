// import { useEffect, useState } from "react";
// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { Input } from "@/components/ui/input";
// import { Search, Users } from "lucide-react";
// import { CustomersTable } from "@/pages/customer/CustomersTable";
// import { getAllUsers } from "@/api/customers/index";
// import { Customer } from "@/components/customers/types";
// import { CustomersTableSkeleton } from "@/pages/customer/CustomerTableSkeleton";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";

// const CustomersPage = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

//   const fetchUsers = async (
//     pageNum: number = page,
//     limitNum: number = limit
//   ) => {
//     try {
//       setLoading(true);
//       const data = await getAllUsers({
//         search: debouncedSearch,
//         page: pageNum,
//         limit: limitNum,
//         status,
//       });
//       setCustomers(data.profiles);
//       setPage(data.pagination.currentPage);
//       setTotalPages(data.pagination.totalPages);
//     } catch (err) {
//       console.error("Failed to fetch users", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//       setPage(1);
//     }, 500);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchQuery]);

//   useEffect(() => {
//     fetchUsers();
//   }, [debouncedSearch, status]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [page]);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setPage(1);
//   };

//   return (
//     <DashboardLayout>
//       <div className="space-y-8 bg-white min-h-screen">
//         {/* Header */}
//         <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg border border-gray-200">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Users className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold tracking-tight text-gray-900">
//                   Customers Management
//                 </h1>
//                 <p className="text-gray-600 text-lg mt-1">
//                   View and manage all customer accounts
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <Card className="border-gray-200 shadow-sm bg-white">
//           <CardContent className="p-6">
//             <div className="space-y-4">
//               {/* Search and Filters Row */}
//               <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
//                 {/* Left Side: Search + Status Filter */}
//                 <div className="flex flex-col lg:flex-row gap-4 lg:items-center flex-1">
//                   <div className="flex-1 max-w-md relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       type="search"
//                       placeholder="Search by customer name, user ID, or phone..."
//                       className="pl-10 h-11 border-gray-300 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
//                       value={searchQuery}
//                       onChange={handleSearchChange}
//                     />
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-600 whitespace-nowrap">
//                       Status:
//                     </span>
//                     <Select
//                       value={status}
//                       onValueChange={(newStatus) => {
//                         setStatus(newStatus as "all" | "active" | "inactive");
//                         setPage(1);
//                       }}
//                     >
//                       <SelectTrigger className="w-[150px] h-11 bg-white border-gray-300 text-gray-900">
//                         <SelectValue placeholder="Filter Status" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white border-gray-200">
//                         <SelectItem value="all">All Status</SelectItem>
//                         <SelectItem value="active">Active</SelectItem>
//                         <SelectItem value="inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Right Side: Page Size Selector */}
//                 <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md border">
//                   <span className="text-sm font-medium whitespace-nowrap text-muted-foreground">
//                     Show:
//                   </span>
//                   <Select
//                     value={limit.toString()}
//                     onValueChange={(newLimit) => {
//                       const limitValue = parseInt(newLimit, 10);
//                       setLimit(limitValue);
//                       setPage(1);
//                       fetchUsers(1, limitValue);
//                     }}
//                   >
//                     <SelectTrigger className="w-[70px] h-8 bg-transparent border-0">
//                       <SelectValue placeholder={limit.toString()} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="5">5</SelectItem>
//                       <SelectItem value="10">10</SelectItem>
//                       <SelectItem value="15">15</SelectItem>
//                       <SelectItem value="20">20</SelectItem>
//                       <SelectItem value="25">25</SelectItem>
//                       <SelectItem value="50">50</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Search helper text */}
//               <p className="text-sm text-gray-500">
//                 You can search customers by{" "}
//                 <span className="font-medium">User ID</span>,{" "}
//                 <span className="font-medium">Number</span>, or{" "}
//                 <span className="font-medium">Name</span>.
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Customers Table */}
//         {loading ? (
//           <CustomersTableSkeleton />
//         ) : (
//           <CustomersTable
//             customers={customers}
//             totalPages={totalPages}
//             page={page}
//             setPage={setPage}
//             fetchData={fetchUsers}
//             limit={limit}
//             setLimit={setLimit}
//           />
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default CustomersPage;

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, RefreshCw } from "lucide-react";
import { CustomersTable } from "@/pages/customer/CustomersTable";
import { getAllUsers } from "@/api/customers/index";
import { Customer } from "@/components/customers/types";
import { CustomersTableSkeleton } from "@/pages/customer/CustomerTableSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"asc" | "desc" | "">("");
  const [sortField, setSortField] = useState<string>("");

  const fetchUsers = async (
    pageNum: number = page,
    limitNum: number = limit,
    resetPage: boolean = false
  ) => {
    try {
      setLoading(true);
      const currentPage = resetPage ? 1 : pageNum;

      const params: any = {
        search: debouncedSearch,
        page: currentPage,
        limit: limitNum,
        status,
      };

      // Add sorting parameters if sorting is active
      if (sortField && sortBy) {
        params.sortField = sortField;
        params.sortBy = sortBy;
      }

      const data = await getAllUsers(params);
      setCustomers(data.profiles);
      setPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);

      if (resetPage) {
        setPage(1);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchUsers(page, limit);
      toast.success("Data refreshed successfully");
    } catch (err) {
      console.error("Failed to refresh data", err);
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSort = (field: string) => {
    let newSortBy: "asc" | "desc" | "" = "";

    if (sortField === field) {
      // Toggle sort direction for same field
      if (sortBy === "asc") {
        newSortBy = "desc";
      } else if (sortBy === "desc") {
        newSortBy = "";
        setSortField("");
      } else {
        newSortBy = "asc";
      }
    } else {
      // New field, start with ascending
      newSortBy = "asc";
      setSortField(field);
    }

    setSortBy(newSortBy);
    setPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchUsers(1, limit, true);
  }, [debouncedSearch, status, sortBy, sortField]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (newStatus: "all" | "active" | "inactive") => {
    setStatus(newStatus);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatus("all");
    setSortBy("");
    setSortField("");
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  Customers Management
                </h1>
                <p className="text-gray-600 text-lg mt-1">
                  View and manage all customer accounts
                </p>
              </div>
            </div>

            {/* Refresh Button
            <Button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button> */}
          </div>
        </div>

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
                      placeholder="Search by customer name, user ID, or phone..."
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      Status:
                    </span>
                    <Select value={status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-[150px] h-11 bg-white border-gray-300 text-gray-900">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>

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
                </div>

                {/* Right Side: Clear Filters + Page Size Selector */}
                <div className="flex items-center gap-4">
                  {/* Clear Filters Button */}
                  {(searchQuery || status !== "all" || sortBy || sortField) && (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                      Clear Filters
                    </Button>
                  )}

                  {/* Page Size Selector */}
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md border">
                    <span className="text-sm font-medium whitespace-nowrap text-muted-foreground">
                      Show:
                    </span>
                    <Select
                      value={limit.toString()}
                      onValueChange={(newLimit) => {
                        const limitValue = parseInt(newLimit, 10);
                        setLimit(limitValue);
                        setPage(1);
                        fetchUsers(1, limitValue);
                      }}
                    >
                      <SelectTrigger className="w-[70px] h-8 bg-transparent border-0">
                        <SelectValue placeholder={limit.toString()} />
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
              </div>

              {/* Active Filters Display */}
              {sortBy && sortField && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Active sort:</span>
                  <span className="font-medium">
                    {sortField === "readableUserId" ? "User ID" : sortField} (
                    {sortBy === "asc" ? "Ascending" : "Descending"})
                  </span>
                </div>
              )}

              {/* Search helper text */}
              <p className="text-sm text-gray-500">
                You can search customers by{" "}
                <span className="font-medium">User ID</span>,{" "}
                <span className="font-medium">Number</span>, or{" "}
                <span className="font-medium">Name</span>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        {/* {loading ? (
          <CustomersTableSkeleton />
        ) : ( */}
        <CustomersTable
          customers={customers}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          fetchData={fetchUsers}
          limit={limit}
          setLimit={setLimit}
          sortBy={sortBy}
          sortField={sortField}
          onSort={handleSort}
        />
        {/* )} */}
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
