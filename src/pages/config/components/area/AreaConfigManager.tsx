// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/store/index";
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
// import {
//   getAreas,
//   selectStores,
//   selectIsLoading,
//   selectError,
//   selectIsSuccess,
//   clearStoreStatus,
// } from "@/store/slices/locationSlice";

// export interface Area {
//   id: string;
//   locationName: string;
//   address?: string;
//   range: number;
//   isActive: boolean;
// }

// export function AreaConfigManager() {
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const limit = 10;
//   const dispatch = useDispatch<AppDispatch>();
//   const areas = useSelector(selectStores);
//   const isLoading = useSelector(selectIsLoading);
//   const error = useSelector(selectError);
//   const isSuccess = useSelector(selectIsSuccess);

//   const [activeTab, setActiveTab] = useState<string>("all");
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [editingArea, setEditingArea] = useState<Area | null>(null);

//   // Fetch areas on component mount

// useEffect(() => {
//   dispatch(getAreas({ page: currentPage, limit }));
// }, [dispatch, currentPage]);

//   // Handle success/error states
//   useEffect(() => {
//     if (isSuccess) {
//       toast.success("Operation completed successfully!");
//       dispatch(clearStoreStatus());
//       // Close modal if open
//       if (isDialogOpen) {
//         setIsDialogOpen(false);
//         setEditingArea(null);
//       }
//       // Refetch areas to get updated data
//       dispatch(getAreas());
//     }
//   }, [isSuccess, dispatch, isDialogOpen]);

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
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Service Area Configuration</h1>
//         <button
//           onClick={() => setIsDialogOpen(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
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
//             <div className="flex items-center justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               <span className="ml-2">Loading areas...</span>
//             </div>
//           ) : (
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//               <TabsList>
//                 <TabsTrigger value="all">
//                   All Areas ({filteredAreas.all.length})
//                 </TabsTrigger>
//                 <TabsTrigger value="active">
//                   Active ({filteredAreas.active.length})
//                 </TabsTrigger>
//                 <TabsTrigger value="inactive">
//                   Inactive ({filteredAreas.inactive.length})
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="all">
//                 <AreaTable
//                   areas={filteredAreas.all}
//                   onEditClick={openEditModal}
//                 />
//               </TabsContent>
//               <TabsContent value="active">
//                 <AreaTable
//                   areas={filteredAreas.active}
//                   onEditClick={openEditModal}
//                 />
//               </TabsContent>
//               <TabsContent value="inactive">
//                 <AreaTable
//                   areas={filteredAreas.inactive}
//                   onEditClick={openEditModal}
//                 />
//               </TabsContent>
//             </Tabs>
//           )}
//         </CardContent>
//         <CardFooter />
//       </Card>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AreaTable } from "./AreaTable";
import Modal from "@/components/modal";
import StoreLocationPicker from "@/components/StoreLocationPicker";
import { toast } from "sonner";
import {
  getAreas,
  selectStores,
  selectIsLoading,
  selectError,
  selectIsSuccess,
  clearStoreStatus,
} from "@/store/slices/locationSlice";

export interface Area {
  id: string;
  locationName: string;
  address?: string;
  range: number;
  isActive: boolean;
}

export function AreaConfigManager() {
  const dispatch = useDispatch<AppDispatch>();
  const areas = useSelector(selectStores);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isSuccess = useSelector(selectIsSuccess);
  const total = useSelector((state: any) => state.location.total); // adapt if stored differently

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

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

  const openEditModal = (area: Area) => {
    setEditingArea(area);
    setIsDialogOpen(true);
  };

  const handleModalClose = () => {
    setIsDialogOpen(false);
    setEditingArea(null);
  };

  const filteredAreas = {
    all: areas,
    active: areas.filter((a) => a.isActive),
    inactive: areas.filter((a) => !a.isActive),
  };

  return (
    <div className="space-y-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Service Area Configuration</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add New Service Area
        </button>

        <Modal isOpen={isDialogOpen} onClose={handleModalClose}>
          <StoreLocationPicker
            key={editingArea?.id || "new"}
            close={handleModalClose}
            areaToEdit={editingArea}
          />
        </Modal>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
          <CardDescription>
            Configure service areas for your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2">Loading areas...</span>
            </div>
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
                  <AreaTable areas={filteredAreas.all} onEditClick={openEditModal} />
                </TabsContent>
                <TabsContent value="active">
                  <AreaTable areas={filteredAreas.active} onEditClick={openEditModal} />
                </TabsContent>
                <TabsContent value="inactive">
                  <AreaTable areas={filteredAreas.inactive} onEditClick={openEditModal} />
                </TabsContent>
              </Tabs>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  className="px-4 py-2 border rounded disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className="px-4 py-2 border rounded disabled:opacity-50"
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
      </Card>
    </div>
  );
}
