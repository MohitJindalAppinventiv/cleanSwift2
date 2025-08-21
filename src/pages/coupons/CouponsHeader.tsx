

// import React from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { PlusCircle, Filter, SortAsc, SortDesc, Search } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Props {
//   filterStatus: "all" | "active" | "inactive";
//   setFilterStatus: (val: "all" | "active" | "inactive") => void;
//   sortKey: "code" | "expiry" | "discount";
//   setSortKey: (val: "code" | "expiry" | "discount") => void;
//   sortOrder: "asc" | "desc";
//   setSortOrder: (val: "asc" | "desc") => void;
//     searchTerm: string;
//   setSearchTerm: (val: string) => void;
// }

// export function CouponsHeader({
//   filterStatus,
//   setFilterStatus,
//   sortKey,
//   setSortKey,
//   sortOrder,
//   setSortOrder,
//   searchTerm,
//   setSearchTerm,
// }: Props) {
//   const getSortIcon = () => {
//     return sortOrder === "asc" ? (
//       <SortAsc className="h-4 w-4" />
//     ) : (
//       <SortDesc className="h-4 w-4" />
//     );
//   };

//   const getStatusBadgeColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "text-green-700 bg-green-50 border-green-200";
//       case "inactive":
//         return "text-red-700 bg-red-50 border-red-200";
//       default:
//         return "text-gray-700 bg-gray-50 border-gray-200";
//     }
//   };

//   return (
//     <div className="bg-white border-b border-border/40 px-6 py-4">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//         {/* Header Section */}
//         <div className="space-y-1">
//           <h1 className="text-2xl font-semibold tracking-tight text-foreground">
//             Coupons
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Manage discount coupons for your customers
//           </p>
//         </div>

//         {/* Controls Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                   {/* Search input */}
//         <div className="relative">
//           <input
//             type="search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search coupons..."
//             className="pl-9 pr-3 py-1.5 rounded-md border border-violet-300 bg-violet-50 text-violet-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition"
//             aria-label="Search coupons"
//           />
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400 pointer-events-none" />
//         </div>
//           {/* Filter Controls */}
//           <div className="flex items-center gap-3">
//             {/* Status Filter */}
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-muted-foreground" />
//               <Select
//                 value={filterStatus}
//                 onValueChange={(value) =>
//                   setFilterStatus(value as "all" | "active" | "inactive")
//                 }
//               >
//                 <SelectTrigger className="w-[140px] h-9">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">
//                     <div className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-gray-400" />
//                       All Coupons
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="active">
//                     <div className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-green-400" />
//                       Active
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="inactive">
//                     <div className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-red-400" />
//                       Inactive
//                     </div>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Sort Controls */}
//             <div className="flex items-center gap-2">
//               <Select
//                 value={sortKey}
//                 onValueChange={(value) =>
//                   setSortKey(value as "code" | "expiry" | "discount")
//                 }
//               >
//                 <SelectTrigger className="w-[150px] h-9">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="code">Coupon Code</SelectItem>
//                   <SelectItem value="expiry">Expiry Date</SelectItem>
//                   <SelectItem value="discount">Discount %</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   setSortOrder(sortOrder === "asc" ? "desc" : "asc")
//                 }
//                 className="h-9 w-9 p-0"
//               >
//                 {getSortIcon()}
//               </Button>
//             </div>
//           </div>

//           {/* Action Button */}
//           <Button asChild className="h-9 bg-primary hover:bg-primary/90">
//             <Link
//               to="/config/coupons/create"
//               className="flex items-center gap-2"
//             >
//               <PlusCircle className="h-4 w-4" />
//               <span className="hidden sm:inline">Add New Coupon</span>
//               <span className="sm:hidden">Add</span>
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Active Filters Display */}
//       {(filterStatus !== "all" ||
//         sortKey !== "code" ||
//         sortOrder !== "asc") && (
//         <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
//           <span className="text-sm text-muted-foreground">Active filters:</span>

//           {filterStatus !== "all" && (
//             <div
//               className={cn(
//                 "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border",
//                 getStatusBadgeColor(filterStatus)
//               )}
//             >
//               <div
//                 className={cn(
//                   "h-2 w-2 rounded-full",
//                   filterStatus === "active" ? "bg-green-400" : "bg-red-400"
//                 )}
//               />
//               {filterStatus === "active" ? "Active" : "Inactive"}
//               <button
//                 onClick={() => setFilterStatus("all")}
//                 className="ml-1 hover:opacity-70"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           {(sortKey !== "code" || sortOrder !== "asc") && (
//             <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
//               {getSortIcon()}
//               {sortKey === "code"
//                 ? "Code"
//                 : sortKey === "expiry"
//                 ? "Expiry"
//                 : "Discount"}
//               <button
//                 onClick={() => {
//                   setSortKey("code");
//                   setSortOrder("asc");
//                 }}
//                 className="ml-1 hover:opacity-70"
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => {
//               setFilterStatus("all");
//               setSortKey("code");
//               setSortOrder("asc");
//             }}
//             className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
//           >
//             Clear all
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }



// import React from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { 
//   PlusCircle, 
//   Filter, 
//   SortAsc, 
//   SortDesc, 
//   Search, 
//   Ticket,
//   X 
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Props {
//   filterStatus: "all" | "active" | "inactive";
//   setFilterStatus: (val: "all" | "active" | "inactive") => void;
//   sortKey: "code" | "expiry" | "discount";
//   setSortKey: (val: "code" | "expiry" | "discount") => void;
//   sortOrder: "asc" | "desc";
//   setSortOrder: (val: "asc" | "desc") => void;
//   searchTerm: string;
//   setSearchTerm: (val: string) => void;
// }

// export function CouponsHeader({
//   filterStatus,
//   setFilterStatus,
//   sortKey,
//   setSortKey,
//   sortOrder,
//   setSortOrder,
//   searchTerm,
//   setSearchTerm,
// }: Props) {
//   const getSortIcon = () => {
//     return sortOrder === "asc" ? (
//       <SortAsc className="h-4 w-4" />
//     ) : (
//       <SortDesc className="h-4 w-4" />
//     );
//   };

//   const getStatusBadgeColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "text-green-700 bg-green-50 border-green-200";
//       case "inactive":
//         return "text-red-700 bg-red-50 border-red-200";
//       default:
//         return "text-gray-700 bg-gray-50 border-gray-200";
//     }
//   };

//   const getSortDisplayName = (key: string) => {
//     switch (key) {
//       case "code":
//         return "Code";
//       case "expiry":
//         return "Expiry";
//       case "discount":
//         return "Discount";
//       default:
//         return key;
//     }
//   };

//   const clearAllFilters = () => {
//     setFilterStatus("all");
//     setSortKey("code");
//     setSortOrder("asc");
//     setSearchTerm("");
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//   };

//   const hasActiveFilters = 
//     filterStatus !== "all" || 
//     sortKey !== "code" || 
//     sortOrder !== "asc" || 
//     searchTerm.trim() !== "";

//   return (
//     <div className="bg-white border-b border-border/40 px-6 py-4">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//         {/* Header Section */}
//         <div className="space-y-2">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
//               <Ticket className="h-4 w-4 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">
//               Coupons
//             </h1>
//           </div>
//           <br/>
//           <p className="text-muted-foreground">
//             Manage discount coupons for your customers
//           </p>
//         </div>

//         {/* Controls Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//           {/* Search input */}
//           <div className="relative">
//             <input
//               type="search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search coupons..."
//               className="pl-9 pr-8 py-1.5 w-full sm:w-64 rounded-md border border-violet-300 bg-violet-50 text-violet-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-colors duration-200"
//               aria-label="Search coupons"
//             />
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400 pointer-events-none" />
//             {searchTerm && (
//               <button
//                 onClick={clearSearch}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-violet-200 hover:bg-violet-300 flex items-center justify-center transition-colors duration-200"
//                 aria-label="Clear search"
//               >
//                 <X className="h-3 w-3 text-violet-600" />
//               </button>
//             )}
//           </div>

//           {/* Filter Controls */}
//           <div className="flex items-center gap-3">
//             {/* Status Filter */}
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-muted-foreground" />
//               <Select
//                 value={filterStatus}
//                 onValueChange={(value) =>
//                   setFilterStatus(value as "all" | "active" | "inactive")
//                 }
//               >
//                 <SelectTrigger className="w-[140px] h-9">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">
//                     <div className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-gray-400" />
//                       All Coupons
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="active">
//                     <div className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-green-400" />
//                       Active
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="inactive">
//                     <div className="flex items-center gap-2">
//                       <div className="h-2 w-2 rounded-full bg-red-400" />
//                       Inactive
//                     </div>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Sort Controls */}
//             <div className="flex items-center gap-2">
//               <Select
//                 value={sortKey}
//                 onValueChange={(value) =>
//                   setSortKey(value as "code" | "expiry" | "discount")
//                 }
//               >
//                 <SelectTrigger className="w-[150px] h-9">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="code">Coupon Code</SelectItem>
//                   <SelectItem value="expiry">Expiry Date</SelectItem>
//                   <SelectItem value="discount">Discount %</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   setSortOrder(sortOrder === "asc" ? "desc" : "asc")
//                 }
//                 className="h-9 w-9 p-0"
//                 aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
//               >
//                 {getSortIcon()}
//               </Button>
//             </div>
//           </div>

//           {/* Action Button */}
//           <Button asChild className="h-9 bg-primary hover:bg-primary/90">
//             <Link
//               to="/config/coupons/create"
//               className="flex items-center gap-2"
//             >
//               <PlusCircle className="h-4 w-4" />
//               <span className="hidden sm:inline">Add New Coupon</span>
//               <span className="sm:hidden">Add</span>
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Active Filters Display */}
//       {hasActiveFilters && (
//         <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/40">
//           <span className="text-sm text-muted-foreground">Active filters:</span>

//           {searchTerm.trim() !== "" && (
//             <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
//               <Search className="h-3 w-3" />
//               "{searchTerm}"
//               <button
//                 onClick={clearSearch}
//                 className="ml-1 hover:opacity-70 transition-opacity"
//                 aria-label="Clear search filter"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           )}

//           {filterStatus !== "all" && (
//             <div
//               className={cn(
//                 "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border",
//                 getStatusBadgeColor(filterStatus)
//               )}
//             >
//               <div
//                 className={cn(
//                   "h-2 w-2 rounded-full",
//                   filterStatus === "active" ? "bg-green-400" : "bg-red-400"
//                 )}
//               />
//               {filterStatus === "active" ? "Active" : "Inactive"}
//               <button
//                 onClick={() => setFilterStatus("all")}
//                 className="ml-1 hover:opacity-70 transition-opacity"
//                 aria-label="Clear status filter"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           )}

//           {(sortKey !== "code" || sortOrder !== "asc") && (
//             <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
//               {getSortIcon()}
//               {getSortDisplayName(sortKey)}
//               <button
//                 onClick={() => {
//                   setSortKey("code");
//                   setSortOrder("asc");
//                 }}
//                 className="ml-1 hover:opacity-70 transition-opacity"
//                 aria-label="Clear sort filter"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           )}

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={clearAllFilters}
//             className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
//           >
//             Clear all
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Filter,
  SortAsc,
  SortDesc,
  Search,
  Ticket,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  filterStatus: "all" | "active" | "inactive";
  setFilterStatus: (val: "all" | "active" | "inactive") => void;
  sortKey: "code" | "expiry" | "discount";
  setSortKey: (val: "code" | "expiry" | "discount") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export function CouponsHeader({
  filterStatus,
  setFilterStatus,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  searchTerm,
  setSearchTerm,
}: Props) {
  const getSortIcon = () => {
    return sortOrder === "asc" ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-700 bg-green-50 border-green-200";
      case "inactive":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getSortDisplayName = (key: string) => {
    switch (key) {
      case "code":
        return "Code";
      case "expiry":
        return "Expiry";
      case "discount":
        return "Discount";
      default:
        return key;
    }
  };

  const clearAllFilters = () => {
    setFilterStatus("all");
    setSortKey("code");
    setSortOrder("asc");
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const hasActiveFilters =
    filterStatus !== "all" ||
    sortKey !== "code" ||
    sortOrder !== "asc" ||
    searchTerm.trim() !== "";

  return (
    <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Ticket className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Coupons Management
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Manage discount coupons for your customers
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search input */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search coupons..."
              className="pl-10 pr-8 h-11 w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              aria-label="Search coupons"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-gray-700" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="w-[160px] h-11 bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">All Coupons</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <Select
                value={sortKey}
                onValueChange={(value) =>
                  setSortKey(value as "code" | "expiry" | "discount")
                }
              >
                <SelectTrigger className="w-[150px] h-11 bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="code">Coupon Code</SelectItem>
                  <SelectItem value="expiry">Expiry Date</SelectItem>
                  <SelectItem value="discount">Discount %</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="h-11 w-11 flex items-center justify-center"
              >
                {getSortIcon()}
              </Button>
            </div>
          </div>

          {/* Action Button */}
          <Button asChild className="h-11 bg-purple-600 hover:bg-purple-700 text-white">
            <Link
              to="/config/coupons/create"
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add New Coupon</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-600">
            Active filters:
          </span>

          {searchTerm.trim() !== "" && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
              <Search className="h-3 w-3" />
              "{searchTerm}"
              <button
                onClick={clearSearch}
                className="ml-1 hover:opacity-70"
                aria-label="Clear search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {filterStatus !== "all" && (
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border",
                getStatusBadgeColor(filterStatus)
              )}
            >
              {filterStatus === "active" ? "Active" : "Inactive"}
              <button
                onClick={() => setFilterStatus("all")}
                className="ml-1 hover:opacity-70"
                aria-label="Clear status filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {(sortKey !== "code" || sortOrder !== "asc") && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
              {getSortIcon()}
              {getSortDisplayName(sortKey)}
              <button
                onClick={() => {
                  setSortKey("code");
                  setSortOrder("asc");
                }}
                className="ml-1 hover:opacity-70"
                aria-label="Clear sort filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
