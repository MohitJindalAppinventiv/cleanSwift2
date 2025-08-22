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
    // <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg border border-gray-200 shadow-sm">
    //   {/* Header Section */}
    //   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
    //     <div className="flex items-center gap-3">
    //       <div className="p-2 bg-purple-100 rounded-lg">
    //         <Ticket className="h-6 w-6 text-purple-600" />
    //       </div>
    //       <div>
    //         <h1 className="text-4xl font-bold tracking-tight text-gray-900">
    //           Coupons Management
    //         </h1>
    //         <p className="text-gray-600 text-lg mt-1">
    //           Manage discount coupons for your customers
    //         </p>
    //       </div>
    //     </div>

    //     {/* Action Button */}
    //     <Button
    //       asChild
    //       className="h-11 bg-purple-600 hover:bg-purple-700 text-white"
    //     >
    //       <Link to="/config/coupons/create" className="flex items-center gap-2">
    //         <PlusCircle className="h-4 w-4" />
    //         <span className="hidden sm:inline">Add New Coupon</span>
    //         <span className="sm:hidden">Add</span>
    //       </Link>
    //     </Button>
    //   </div>

    //   {/* Filters Section in separate bordered box */}
    //   <div className="mt-8 border border-gray-200 rounded-lg bg-white p-4">
    //     <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
    //       <Filter className="h-4 w-4 text-gray-600" /> Filters
    //     </h2>

    //     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    //       {/* Search input */}
    //       <div className="relative max-w-md w-full">
    //         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    //         <input
    //           type="search"
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //           placeholder="Search coupons..."
    //           className="pl-10 pr-8 h-11 w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    //           aria-label="Search coupons"
    //         />
    //         {searchTerm && (
    //           <button
    //             onClick={clearSearch}
    //             className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
    //             aria-label="Clear search"
    //           >
    //             <X className="h-3 w-3 text-gray-700" />
    //           </button>
    //         )}
    //       </div>

    //       {/* Filters & Sorting */}
    //       <div className="flex flex-wrap items-center gap-3">
    //         {/* Status Filter */}
    //         <Select
    //           value={filterStatus}
    //           onValueChange={(value) =>
    //             setFilterStatus(value as "all" | "active" | "inactive")
    //           }
    //         >
    //           <SelectTrigger className="w-[160px] h-11 bg-white border-gray-300 text-gray-900">
    //             <SelectValue placeholder="Filter by status" />
    //           </SelectTrigger>
    //           <SelectContent className="bg-white border-gray-200">
    //             <SelectItem value="all">All Coupons</SelectItem>
    //             <SelectItem value="active">Active</SelectItem>
    //             <SelectItem value="inactive">Inactive</SelectItem>
    //           </SelectContent>
    //         </Select>

    //         {/* Sort Controls */}
    //         <div className="flex items-center gap-2">
    //           <Select
    //             value={sortKey}
    //             onValueChange={(value) =>
    //               setSortKey(value as "code" | "expiry" | "discount")
    //             }
    //           >
    //             <SelectTrigger className="w-[150px] h-11 bg-white border-gray-300 text-gray-900">
    //               <SelectValue placeholder="Sort by" />
    //             </SelectTrigger>
    //             <SelectContent className="bg-white border-gray-200">
    //               <SelectItem value="code">Coupon Code</SelectItem>
    //               <SelectItem value="expiry">Expiry Date</SelectItem>
    //               <SelectItem value="discount">Discount %</SelectItem>
    //             </SelectContent>
    //           </Select>

    //           <Button
    //             variant="outline"
    //             size="sm"
    //             onClick={() =>
    //               setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    //             }
    //             className="h-11 w-11 flex items-center justify-center"
    //           >
    //             {getSortIcon()}
    //           </Button>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Active Filters */}
    //     {hasActiveFilters && (
    //       <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-gray-200">
    //         <span className="text-sm font-medium text-gray-600">
    //           Active filters:
    //         </span>

    //         {searchTerm.trim() !== "" && (
    //           <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
    //             <Search className="h-3 w-3" />"{searchTerm}"
    //             <button
    //               onClick={clearSearch}
    //               className="ml-1 hover:opacity-70"
    //               aria-label="Clear search filter"
    //             >
    //               <X className="h-3 w-3" />
    //             </button>
    //           </div>
    //         )}

    //         {filterStatus !== "all" && (
    //           <div
    //             className={cn(
    //               "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border",
    //               getStatusBadgeColor(filterStatus)
    //             )}
    //           >
    //             {filterStatus === "active" ? "Active" : "Inactive"}
    //             <button
    //               onClick={() => setFilterStatus("all")}
    //               className="ml-1 hover:opacity-70"
    //               aria-label="Clear status filter"
    //             >
    //               <X className="h-3 w-3" />
    //             </button>
    //           </div>
    //         )}

    //         {(sortKey !== "code" || sortOrder !== "asc") && (
    //           <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
    //             {getSortIcon()}
    //             {getSortDisplayName(sortKey)}
    //             <button
    //               onClick={() => {
    //                 setSortKey("code");
    //                 setSortOrder("asc");
    //               }}
    //               className="ml-1 hover:opacity-70"
    //               aria-label="Clear sort filter"
    //             >
    //               <X className="h-3 w-3" />
    //             </button>
    //           </div>
    //         )}

    //         <Button
    //           variant="ghost"
    //           size="sm"
    //           onClick={clearAllFilters}
    //           className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
    //         >
    //           Clear all
    //         </Button>
    //       </div>
    //     )}
    //   </div>
    // </div>


    <div className="bg-gray-50 -mx-6 px-6 py-8 rounded-lg shadow-sm">
  {/* Header Section with bottom border */}
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-gray-200 pb-6">
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

    {/* Action Button */}
    <Button
      asChild
      className="h-11 bg-purple-600 hover:bg-purple-700 text-white shadow-md"
    >
      <Link to="/config/coupons/create" className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Add New Coupon</span>
        <span className="sm:hidden">Add</span>
      </Link>
    </Button>
  </div>

  {/* Filters Section in bordered card */}
  <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm p-5">
    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <Filter className="h-4 w-4 text-gray-600" /> Filters
    </h2>

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Search input */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search coupons..."
          className="pl-10 pr-8 h-11 w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            <X className="h-3 w-3 text-gray-700" />
          </button>
        )}
      </div>

      {/* Status & Sort Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filterStatus}
          onValueChange={(value) =>
            setFilterStatus(value as "all" | "active" | "inactive")
          }
        >
          <SelectTrigger className="w-[160px] h-11 bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-md">
            <SelectItem value="all">All Coupons</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

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
            <SelectContent className="bg-white border-gray-200 shadow-md">
              <SelectItem value="code">Coupon Code</SelectItem>
              <SelectItem value="expiry">Expiry Date</SelectItem>
              <SelectItem value="discount">Discount %</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="h-11 w-11 flex items-center justify-center border-gray-300"
          >
            {getSortIcon()}
          </Button>
        </div>
      </div>
    </div>

    {/* Active Filters */}
         {/* Active Filters */}
         {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              Active filters:
            </span>

            {searchTerm.trim() !== "" && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                <Search className="h-3 w-3" />"{searchTerm}"
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
    </div>

  );
}
