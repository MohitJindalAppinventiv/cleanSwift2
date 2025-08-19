// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/index";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { AreaTable } from "./AreaTable";
// import Modal from "@/components/modal";
// import StoreLocationPicker from "@/components/StoreLocationPicker";
// import { toast } from "sonner";
// import AreaTableSkeleton from "./AreaTableSkeleton";
// import {
//   getAreas,
//   selectStores,
//   selectIsLoading,
//   selectError,
//   selectIsSuccess,
//   clearStoreStatus,
//   selectTotalPages,
// } from "@/store/slices/locationSlice";

// export interface Area {
//   id: string;
//   locationName: string;
//   address?: string;
//   range: number;
//   isActive: boolean;
// }

// export function AreaConfigManager() {
//   const dispatch = useDispatch<AppDispatch>();
//   const areas = useSelector(selectStores);
//   const isLoading = useSelector(selectIsLoading);
//   const error = useSelector(selectError);
//   const isSuccess = useSelector(selectIsSuccess);
//   const total = useSelector((state: RootState) => state.location.total); // adapt if stored differently
//   console.log("total", total);
//   const totalPages = useSelector(selectTotalPages);
//   console.log("total pages", totalPages);
//   const [activeTab, setActiveTab] = useState<string>("all");
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [editingArea, setEditingArea] = useState<Area | null>(null);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   const limit = 10;

//   // Fetch areas on component mount or page change
//   useEffect(() => {
//     dispatch(getAreas({ page: currentPage, limit }));
//   }, [dispatch, currentPage]);

//   // Handle success
//   useEffect(() => {
//     if (isSuccess) {
//       toast.success("Operation completed successfully!");
//       dispatch(clearStoreStatus());

//       if (isDialogOpen) {
//         setIsDialogOpen(false);
//         setEditingArea(null);
//       }

//       dispatch(getAreas({ page: currentPage, limit }));
//     }
//   }, [isSuccess, dispatch, isDialogOpen, currentPage]);

//   // Handle error
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearStoreStatus());
//     }
//   }, [error, dispatch]);

//   const openEditModal = (area: Area) => {
//     setEditingArea(area);
//     setIsDialogOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsDialogOpen(false);
//     setEditingArea(null);
//   };

//   const filteredAreas = {
//     all: areas,
//     active: areas.filter((a) => a.isActive),
//     inactive: areas.filter((a) => !a.isActive),
//   };

//   return (
//     <div className="space-y-6">
//       <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight">
//           Service Area Configuration
//         </h1>
//         <button
//           onClick={() => setIsDialogOpen(true)}
//           className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg
//                shadow-md hover:bg-purple-700 active:bg-purple-800
//                transition-all duration-200 flex items-center gap-2"
//         >
//           Add New Service Area
//         </button>

//         <Modal isOpen={isDialogOpen} onClose={handleModalClose}>
//           <StoreLocationPicker
//             key={editingArea?.id || "new"}
//             close={handleModalClose}
//             areaToEdit={editingArea}
//           />
//         </Modal>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Service Areas</CardTitle>
//           <CardDescription>
//             Configure service areas for your application.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <>
//               <Tabs value={activeTab} onValueChange={setActiveTab}>
//                 <TabsList>
//                   <TabsTrigger value="all">All Areas</TabsTrigger>
//                   <TabsTrigger value="active">Active</TabsTrigger>
//                   <TabsTrigger value="inactive">Inactive</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="all">
//                   <AreaTableSkeleton />
//                 </TabsContent>
//                 <TabsContent value="active">
//                   <AreaTableSkeleton />
//                 </TabsContent>
//                 <TabsContent value="inactive">
//                   <AreaTableSkeleton />
//                 </TabsContent>
//               </Tabs>
//             </>
//           ) : (
//             <>
//               <Tabs value={activeTab} onValueChange={setActiveTab}>
//                 <TabsList>
//                   <TabsTrigger value="all">
//                     All Areas ({filteredAreas.all.length})
//                   </TabsTrigger>
//                   <TabsTrigger value="active">
//                     Active ({filteredAreas.active.length})
//                   </TabsTrigger>
//                   <TabsTrigger value="inactive">
//                     Inactive ({filteredAreas.inactive.length})
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="all">
//                   <AreaTable
//                     areas={filteredAreas.all}
//                     onEditClick={openEditModal}
//                   />
//                 </TabsContent>
//                 <TabsContent value="active">
//                   <AreaTable
//                     areas={filteredAreas.active}
//                     onEditClick={openEditModal}
//                   />
//                 </TabsContent>
//                 <TabsContent value="inactive">
//                   <AreaTable
//                     areas={filteredAreas.inactive}
//                     onEditClick={openEditModal}
//                   />
//                 </TabsContent>
//               </Tabs>
//               <div className="flex justify-center items-center gap-5 mt-4">
//                 <button
//                   className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium
//                hover:bg-purple-700 transition-colors duration-200
//                disabled:bg-purple-300 disabled:cursor-not-allowed"
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </button>

//                 <span className="text-sm text-gray-700 font-medium">
//                   Page {currentPage} of {totalPages || 1}
//                 </span>

//                 <button
//                   className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium
//                hover:bg-purple-700 transition-colors duration-200
//                disabled:bg-purple-300 disabled:cursor-not-allowed"
//                   onClick={() =>
//                     setCurrentPage((p) =>
//                       Math.min(p + 1, totalPages || currentPage + 1)
//                     )
//                   }
//                   disabled={currentPage === totalPages || totalPages === 0}
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </CardContent>
//         <CardFooter />
//       </Card>
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import { AreaTable } from "./AreaTable";
import Modal from "@/pages/area/modal";
import StoreLocationPicker from "@/pages/area/StoreLocationPicker";
import { toast } from "sonner";
import AreaTableSkeleton from "./AreaTableSkeleton";
import {
  getAreas,
  selectStores,
  selectIsLoading,
  selectError,
  selectIsSuccess,
  clearStoreStatus,
  selectTotalPages,
} from "@/store/slices/locationSlice";
import { useAppSelector } from "@/store/hooks";

export interface Area {
  id: string;
  locationName: string;
  address?: string;
  lat:number;
  lng:number
  range: number;
  isActive: boolean;
}

type SortField = "name" | "range" | "status";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "active" | "inactive";

export function AreaConfigManager() {
  const dispatch = useDispatch<AppDispatch>();
  const areas = useAppSelector(selectStores);
  console.log("areas selected",areas)
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isSuccess = useSelector(selectIsSuccess);
  const total = useSelector((state: RootState) => state.location.total);
  const totalPages = useSelector(selectTotalPages);

  // State management
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Search, Sort, Filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const limit = 10;

  // Fetch areas on component mount or page change
  useEffect(() => {
    dispatch(getAreas({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Operation completed successfully!");
      dispatch(clearStoreStatus());

      if (isDialogOpen) {
        setIsDialogOpen(false);
        setEditingArea(null);
      }

      dispatch(getAreas({ page: currentPage, limit }));
    }
  }, [isSuccess, dispatch, isDialogOpen, currentPage]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearStoreStatus());
    }
  }, [error, dispatch]);

  // Filter, search and sort logic
  const processedAreas = useMemo(() => {
    let filtered = [...areas];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (area) =>
          area.locationName.toLowerCase().includes(searchLower) ||
          (area.address && area.address.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((area) =>
        statusFilter === "active" ? area.isActive : !area.isActive
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.locationName.localeCompare(b.locationName);
          break;
        case "range":
          comparison = a.range - b.range;
          break;
        case "status":
          comparison = a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [areas, searchTerm, statusFilter, sortField, sortOrder]);

  const filteredAreas = {
    all: processedAreas,
    active: processedAreas.filter((a) => a.isActive),
    inactive: processedAreas.filter((a) => !a.isActive),
  };

  const openEditModal = (area: Area) => {
    setEditingArea(area);
    setIsDialogOpen(true);
  };

  const handleModalClose = () => {
    setIsDialogOpen(false);
    setEditingArea(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortField("name");
    setSortOrder("asc");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    searchTerm ||
    sortField !== "name" ||
    sortOrder !== "asc" ||
    statusFilter !== "all";

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Service Areas</h2>
      <div className="flex flex-row justify-between align-center">
        <p className="text-muted-foreground">
          Configure service areas for your application. Total areas: {total}.
        </p>

        <Button
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          Add Service Area
        </Button>
      </div>
      {/* </CardHeader> */}
      <Modal isOpen={isDialogOpen} onClose={handleModalClose}>
        {" "}
        <StoreLocationPicker
          key={editingArea?.id || "new"}
          close={handleModalClose}
          areaToEdit={editingArea}
        />{" "}
      </Modal>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                onClick={() => setSearchTerm("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Filter Toggle and Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters{" "}
              {hasActiveFilters && <span className="text-purple-600">•</span>}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all filters
              </Button>
            )}

            <div className="text-sm text-gray-600">
              Showing {processedAreas.length} of {areas.length} areas
            </div>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <div className="flex gap-2">
                  <Select
                    value={sortField}
                    onValueChange={(value: SortField) => setSortField(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="range">Range</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {getSortIcon(sortField)}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(value: StatusFilter) =>
                    setStatusFilter(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(false)}
                  className="w-full"
                >
                  Hide Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Areas</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <AreaTableSkeleton />
              </TabsContent>
              <TabsContent value="active">
                <AreaTableSkeleton />
              </TabsContent>
              <TabsContent value="inactive">
                <AreaTableSkeleton />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All Areas ({filteredAreas.all.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({filteredAreas.active.length})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive ({filteredAreas.inactive.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <AreaTable
                  areas={filteredAreas.all}
                  onEditClick={openEditModal}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </TabsContent>
              <TabsContent value="active">
                <AreaTable
                  areas={filteredAreas.active}
                  onEditClick={openEditModal}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </TabsContent>
              <TabsContent value="inactive">
                <AreaTable
                  areas={filteredAreas.inactive}
                  onEditClick={openEditModal}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </TabsContent>
            </Tabs>

            {processedAreas.length === 0 && areas.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No areas found</p>
                <p className="text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            <div className="flex justify-center items-center gap-5 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium 
               hover:bg-purple-700 transition-colors duration-200 
               disabled:bg-purple-300 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium 
               hover:bg-purple-700 transition-colors duration-200 
               disabled:bg-purple-300 disabled:cursor-not-allowed"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages || currentPage + 1)
                  )
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter />
    </div>
    // </div>
  );
}
