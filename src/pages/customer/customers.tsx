// // // import { useEffect, useState } from "react";
// // // import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// // // import { Input } from "@/components/ui/input";
// // // import { Search } from "lucide-react";
// // // import { CustomersTable } from "@/pages/customer/CustomersTable";
// // // import { CustomersHeader } from "@/pages/customer/CustomersHeader";
// // // import { getAllUsers } from "@/api/customers/index";
// // // import { Customer } from "@/components/customers/types";
// // // import { Button } from "@/components/ui/button";
// // // import { CustomersTableSkeleton } from "@/pages/customer/CustomerTableSkeleton";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";

// // // const CustomersPage = () => {
// // //   const [searchQuery, setSearchQuery] = useState("");
// // //   const [customers, setCustomers] = useState<Customer[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [page, setPage] = useState(1);
// // //   const [limit, setLimit] = useState(10); // Added limit state
// // //   const [totalPages, setTotalPages] = useState(1);
// // //   const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

// // //   const fetchUsers = async (
// // //     pageNum: number = page,
// // //     limitNum: number = limit
// // //   ) => {
// // //     try {
// // //       setLoading(true);
// // //       const data = await getAllUsers({
// // //         search: searchQuery,
// // //         page: pageNum,
// // //         limit: limitNum,
// // //         status,
// // //       });
// // //       console.log("data in customers", data);
// // //       setCustomers(data.profiles);
// // //       setPage(data.pagination.currentPage);
// // //       setTotalPages(data.pagination.totalPages);
// // //       console.log(totalPages);
// // //     } catch (err) {
// // //       console.error("Failed to fetch users", err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchUsers();
// // //   }, [searchQuery, status]); // Removed page and limit from dependencies

// // //   useEffect(() => {
// // //     window.scrollTo({ top: 0, behavior: "smooth" });
// // //   }, [page]);

// // //   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     setSearchQuery(e.target.value);
// // //     setPage(1); // Reset to page 1 on new search
// // //   };

// // //   return (
// // //     <DashboardLayout>
// // //       <div className="space-y-6">
// // //         <CustomersHeader />

// // //         {/* Search + Status Filter + Rows per page */}
// // //         <div className="flex flex-col gap-2">
// // //           <div className="flex items-center justify-between gap-4">
// // //             {/* Left side: Search + Status dropdown */}
// // //             <div className="flex items-center gap-4">
// // //               {/* Search */}
// // //               <div className="relative">
// // //                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// // //                 <Input
// // //                   type="search"
// // //                   placeholder="Search customers..."
// // //                   className="pl-8 w-[300px]"
// // //                   value={searchQuery}
// // //                   onChange={handleSearchChange}
// // //                 />
// // //               </div>

// // //               {/* Status dropdown (All / Active / Inactive) */}
// // //               <div className="flex gap-2 items-center">
// // //                 <span className="text-sm text-gray-700">Status:</span>
// // //                 <Select
// // //                   value={status}
// // //                   onValueChange={(newStatus) => {
// // //                     setStatus(newStatus as "all" | "active" | "inactive");
// // //                     setPage(1);
// // //                   }}
// // //                 >
// // //                   <SelectTrigger className="w-[150px]">
// // //                     <SelectValue placeholder="Filter Status" />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="all">All</SelectItem>
// // //                     <SelectItem value="active">Active</SelectItem>
// // //                     <SelectItem value="inactive">Inactive</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>
// // //             </div>

// // //             {/* Right side: Rows per page */}
// // //             <div className="flex items-center gap-2">
// // //               <span className="text-sm text-gray-700">Rows per page:</span>
// // //               <Select
// // //                 value={limit.toString()}
// // //                 onValueChange={(newLimit) => {
// // //                   const limitValue = parseInt(newLimit, 10);
// // //                   setLimit(limitValue);
// // //                   setPage(1);
// // //                   fetchUsers(1, limitValue);
// // //                 }}
// // //               >
// // //                 <SelectTrigger className="w-20">
// // //                   <SelectValue placeholder={limit} />
// // //                 </SelectTrigger>
// // //                 <SelectContent>
// // //                   <SelectItem value="10">10</SelectItem>
// // //                   <SelectItem value="15">15</SelectItem>
// // //                   <SelectItem value="20">20</SelectItem>
// // //                   <SelectItem value="25">25</SelectItem>
// // //                   <SelectItem value="50">50</SelectItem>
// // //                 </SelectContent>
// // //               </Select>
// // //             </div>
// // //           </div>

// // //           {/* Search helper text */}
// // //           <p className="text-sm text-gray-500 ml-1">
// // //             You can search customers by{" "}
// // //             <span className="font-medium">User ID</span>,{" "}
// // //             <span className="font-medium">Number</span>, or{" "}
// // //             <span className="font-medium">Name</span>.
// // //           </p>
// // //         </div>

// // //         {/* Customers Table */}
// // //         <CustomersTable
// // //           customers={customers}
// // //           totalPages={totalPages}
// // //           page={page}
// // //           setPage={setPage}
// // //           fetchData={fetchUsers}
// // //           limit={limit}
// // //           setLimit={setLimit}
// // //         />
// // //       </div>
// // //     </DashboardLayout>
// // //   );
// // // };

// // // export default CustomersPage;

// // import { useEffect, useState } from "react";
// // import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// // import { Input } from "@/components/ui/input";
// // import { Search, Users } from "lucide-react";
// // import { CustomersTable } from "@/pages/customer/CustomersTable";
// // import { CustomersHeader } from "@/pages/customer/CustomersHeader";
// // import { getAllUsers } from "@/api/customers/index";
// // import { Customer } from "@/components/customers/types";
// // import { Button } from "@/components/ui/button";
// // import { CustomersTableSkeleton } from "@/pages/customer/CustomerTableSkeleton";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Card, CardContent } from "@/components/ui/card";

// // const CustomersPage = () => {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [customers, setCustomers] = useState<Customer[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [page, setPage] = useState(1);
// //   const [limit, setLimit] = useState(10);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

// //   const fetchUsers = async (
// //     pageNum: number = page,
// //     limitNum: number = limit
// //   ) => {
// //     try {
// //       setLoading(true);
// //       const data = await getAllUsers({
// //         search: searchQuery,
// //         page: pageNum,
// //         limit: limitNum,
// //         status,
// //       });
// //       console.log("data in customers", data);
// //       setCustomers(data.profiles);
// //       setPage(data.pagination.currentPage);
// //       setTotalPages(data.pagination.totalPages);
// //       console.log(totalPages);
// //     } catch (err) {
// //       console.error("Failed to fetch users", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUsers();
// //   }, [searchQuery, status]);

// //   useEffect(() => {
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   }, [page]);

// //   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setSearchQuery(e.target.value);
// //     setPage(1);
// //   };

// //   return (
// //     <DashboardLayout>
// //       <div className="space-y-8 bg-white min-h-screen">
// //         {/* Header */}
// //         <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg border border-gray-200">
// //           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
// //             <div className="flex items-center gap-3">
// //               <div className="p-2 bg-blue-100 rounded-lg">
// //                 <Users className="h-6 w-6 text-blue-600" />
// //               </div>
// //               <div>
// //                 <h1 className="text-4xl font-bold tracking-tight text-gray-900">
// //                   Customers Management
// //                 </h1>
// //                 <p className="text-gray-600 text-lg mt-1">
// //                   View and manage all customer accounts
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Filters */}
// //         <Card className="border-gray-200 shadow-sm bg-white">
// //           <CardContent className="p-6">
// //             <div className="space-y-4">
// //               {/* Search and Filters Row */}
// //               <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
// //                 {/* Left Side: Search + Status Filter */}
// //                 <div className="flex flex-col lg:flex-row gap-4 lg:items-center flex-1">
// //                   <div className="flex-1 max-w-md relative">
// //                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                     <Input
// //                       type="search"
// //                       placeholder="Search by customer name, user ID, or phone..."
// //                       className="pl-10 h-11 border-gray-300 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
// //                       value={searchQuery}
// //                       onChange={handleSearchChange}
// //                     />
// //                   </div>

// //                   <div className="flex items-center gap-2">
// //                     <span className="text-sm text-gray-600 whitespace-nowrap">
// //                       Status:
// //                     </span>
// //                     <Select
// //                       value={status}
// //                       onValueChange={(newStatus) => {
// //                         setStatus(newStatus as "all" | "active" | "inactive");
// //                         setPage(1);
// //                       }}
// //                     >
// //                       <SelectTrigger className="w-[150px] h-11 bg-white border-gray-300 text-gray-900">
// //                         <SelectValue placeholder="Filter Status" />
// //                       </SelectTrigger>
// //                       <SelectContent className="bg-white border-gray-200">
// //                         <SelectItem value="all">All Statuses</SelectItem>
// //                         <SelectItem value="active">Active</SelectItem>
// //                         <SelectItem value="inactive">Inactive</SelectItem>
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                 </div>

// //                 {/* Right Side: Page Size Selector */}
// //                 <div className="flex items-center gap-2">
// //                   <span className="text-sm text-gray-600 whitespace-nowrap">
// //                     Show:
// //                   </span>
// //                   <Select
// //                     value={limit.toString()}
// //                     onValueChange={(newLimit) => {
// //                       const limitValue = parseInt(newLimit, 10);
// //                       setLimit(limitValue);
// //                       setPage(1);
// //                       fetchUsers(1, limitValue);
// //                     }}
// //                   >
// //                     <SelectTrigger className="w-[80px] h-11 bg-white border-gray-300 text-gray-900">
// //                       <SelectValue placeholder={limit.toString()} />
// //                     </SelectTrigger>
// //                     <SelectContent className="bg-white border-gray-200">
// //                       <SelectItem value="10">10</SelectItem>
// //                       <SelectItem value="15">15</SelectItem>
// //                       <SelectItem value="20">20</SelectItem>
// //                       <SelectItem value="25">25</SelectItem>
// //                       <SelectItem value="50">50</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //               </div>

// //               {/* Search helper text */}
// //               <p className="text-sm text-gray-500">
// //                 You can search customers by{" "}
// //                 <span className="font-medium">User ID</span>,{" "}
// //                 <span className="font-medium">Number</span>, or{" "}
// //                 <span className="font-medium">Name</span>.
// //               </p>
// //             </div>
// //           </CardContent>
// //         </div>

// //         {/* Customers Table */}
// //         <CustomersTable
// //           customers={customers}
// //           totalPages={totalPages}
// //           page={page}
// //           setPage={setPage}
// //           fetchData={fetchUsers}
// //           limit={limit}
// //           setLimit={setLimit}
// //         />
// //       </div>
// //     </DashboardLayout>
// //   )
// // };

// // export default CustomersPage;

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
//     const [debouncedSearch, setDebouncedSearch] = useState(""); // ✅ for debounce

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

//   // useEffect(() => {
//   //   fetchUsers();
//   // }, [searchQuery, status]);

//     useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//       setPage(1);
//     }, 500); // 500ms delay

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchQuery]);

//   // ✅ Fetch when debouncedSearch or status changes
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
//                         <SelectItem value="all">All Statuses</SelectItem>
//                         <SelectItem value="active">Active</SelectItem>
//                         <SelectItem value="inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Right Side: Page Size Selector */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600 whitespace-nowrap">
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
//                     <SelectTrigger className="w-[80px] h-11 bg-white border-gray-300 text-gray-900">
//                       <SelectValue placeholder={limit.toString()} />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white border-gray-200">
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
//       </div> {/* ✅ properly closes the wrapper div */}
//     </DashboardLayout>
//   );
// };

// export default CustomersPage;

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
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

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const fetchUsers = async (
    pageNum: number = page,
    limitNum: number = limit
  ) => {
    try {
      setLoading(true);
      const data = await getAllUsers({
        search: debouncedSearch,
        page: pageNum,
        limit: limitNum,
        status,
      });
      setCustomers(data.profiles);
      setPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
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
    fetchUsers();
  }, [debouncedSearch, status]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
                    <Select
                      value={status}
                      onValueChange={(newStatus) => {
                        setStatus(newStatus as "all" | "active" | "inactive");
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[150px] h-11 bg-white border-gray-300 text-gray-900">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Side: Page Size Selector */}
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
        {loading ? (
          <CustomersTableSkeleton />
        ) : (
          <CustomersTable
            customers={customers}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            fetchData={fetchUsers}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
