
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/store/index";
// import { Edit, Trash2, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   deleteArea,
//   toggleAreaStatus,
//   selectIsSubmitting,
// } from "@/store/slices/locationSlice";
// import { Switch } from "@/components/ui/switch";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogFooter,
// } from "@/components/ui/dialog";

// interface Area {
//   id: string;
//   locationName: string;
//   address?: string;
//   range: number;
//   isActive: boolean;
// }

// interface AreaTableProps {
//   areas: Area[];
//   onEditClick?: (area: Area) => void;
// }

// export function AreaTable({ areas, onEditClick }: AreaTableProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const isSubmitting = useSelector(selectIsSubmitting);
//   const [actioningId, setActioningId] = useState<string | null>(null);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

//   const handleToggleStatus = async (id: string) => {
//     setActioningId(id);
//     await dispatch(toggleAreaStatus(id));
//     setActioningId(null);
//   };

//   const confirmDelete = async () => {
//     if (!selectedDeleteId) return;
//     setActioningId(selectedDeleteId);
//     await dispatch(deleteArea(selectedDeleteId));
//     setActioningId(null);
//     setDeleteModalOpen(false);
//     setSelectedDeleteId(null);
//   };

//   return (
//     <div className="border rounded-md mt-4">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Address</TableHead>
//             <TableHead>Service Range (km)</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {areas.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={5} className="text-center py-4">
//                 No areas found
//               </TableCell>
//             </TableRow>
//           ) : (
//             areas.map((area) => (
//               <TableRow
//                 key={area.id}
//                 className={isSubmitting ? "opacity-60 pointer-events-none" : ""}
//               >
//                 <TableCell className="font-medium">
//                   <div className="flex items-center gap-2">
//                     <MapPin size={16} />
//                     {area.locationName}
//                   </div>
//                 </TableCell>
//                 <TableCell>{area.address || "N/A"}</TableCell>
//                 <TableCell>{area.range}</TableCell>
//                 <TableCell>
//                   {area.isActive ? (
//                     <Badge
//                       variant="secondary"
//                       className="bg-green-100 text-green-800"
//                     >
//                       Active
//                     </Badge>
//                   ) : (
//                     <Badge
//                       variant="destructive"
//                       className="bg-red-100 text-red-800"
//                     >
//                       Inactive
//                     </Badge>
//                   )}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <div className="flex justify-end gap-2 items-center">
//                     <Switch
//                       checked={area.isActive}
//                       onCheckedChange={() => handleToggleStatus(area.id)}
//                       disabled={isSubmitting}
//                     />
//                     <Button
//                       onClick={() => onEditClick?.(area)}
//                       variant="ghost"
//                       size="icon"
//                       disabled={isSubmitting}
//                       title="Edit"
//                     >
//                       <Edit size={16} />
//                     </Button>
//                     <Button
//                       onClick={() => {
//                         setSelectedDeleteId(area.id);
//                         setDeleteModalOpen(true);
//                       }}
//                       variant="ghost"
//                       size="icon"
//                       disabled={isSubmitting}
//                       title="Delete"
//                     >
//                       {actioningId === area.id ? (
//                         <span className="animate-spin h-4 w-4 rounded-full border-2 border-t-transparent border-gray-600"></span>
//                       ) : (
//                         <Trash2 size={16} />
//                       )}
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>

//       {/* Confirm Deletion Modal */}
//       <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
//         <DialogContent>
//           <p>Are you sure you want to delete this area?</p>
//           <DialogFooter className="flex justify-end gap-2 mt-4">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setDeleteModalOpen(false);
//                 setSelectedDeleteId(null);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={confirmDelete}
//               disabled={isSubmitting}
//             >
//               {actioningId === selectedDeleteId ? (
//                 <span className="animate-spin h-4 w-4 rounded-full border-2 border-t-transparent border-white"></span>
//               ) : (
//                 "Delete"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }




// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/store/index";
// import { Edit, Trash2, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   deleteArea,
//   toggleAreaStatus,
//   selectIsSubmitting,
// } from "@/store/slices/locationSlice";
// import { Switch } from "@/components/ui/switch";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
// } from "@/components/ui/dialog";

// interface Area {
//   id: string;
//   locationName: string;
//   address?: string;
//   range: number;
//   isActive: boolean;
// }

// interface AreaTableProps {
//   areas: Area[];
//   onEditClick?: (area: Area) => void;
// }

// export function AreaTable({ areas, onEditClick }: AreaTableProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const isSubmitting = useSelector(selectIsSubmitting);
//   const [actioningId, setActioningId] = useState<string | null>(null);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

//   const handleToggleStatus = async (id: string) => {
//     setActioningId(id);
//     await dispatch(toggleAreaStatus(id));
//     setActioningId(null);
//   };

//   const confirmDelete = async () => {
//     if (!selectedDeleteId) return;
//     setActioningId(selectedDeleteId);
//     await dispatch(deleteArea(selectedDeleteId));
//     setActioningId(null);
//     setDeleteModalOpen(false);
//     setSelectedDeleteId(null);
//   };

//   return (
//     <div className="border rounded-lg shadow-sm mt-4 overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-purple-50">
//             <TableHead className="font-semibold text-gray-700">Name</TableHead>
//             <TableHead className="font-semibold text-gray-700">Address</TableHead>
//             <TableHead className="font-semibold text-gray-700">
//               Service Range (km)
//             </TableHead>
//             <TableHead className="font-semibold text-gray-700">Status</TableHead>
//             <TableHead className="text-right font-semibold text-gray-700">
//               Actions
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {areas.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={5} className="text-center py-6 text-gray-500">
//                 No areas found
//               </TableCell>
//             </TableRow>
//           ) : (
//             areas.map((area, index) => (
//               <TableRow
//                 key={area.id}
//                 className={`transition-colors ${
//                   index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                 } hover:bg-purple-50`}
//               >
//                 <TableCell className="font-medium">
//                   <div className="flex items-center gap-2">
//                     <MapPin size={16} className="text-purple-600" />
//                     {area.locationName}
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-gray-600">
//                   {area.address || "N/A"}
//                 </TableCell>
//                 <TableCell className="text-gray-600">{area.range}</TableCell>
//                 <TableCell>
//                   {area.isActive ? (
//                     <Badge className="bg-green-100 text-green-800 border border-green-300">
//                       Active
//                     </Badge>
//                   ) : (
//                     <Badge className="bg-red-100 text-red-800 border border-red-300">
//                       Inactive
//                     </Badge>
//                   )}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <div className="flex justify-end gap-2 items-center">
//                     <Switch
//                       checked={area.isActive}
//                       onCheckedChange={() => handleToggleStatus(area.id)}
//                       disabled={isSubmitting}
//                     />
//                     <Button
//                       onClick={() => onEditClick?.(area)}
//                       variant="outline"
//                       size="icon"
//                       disabled={isSubmitting}
//                       title="Edit"
//                       className="border-purple-300 text-purple-600 hover:bg-purple-100"
//                     >
//                       <Edit size={16} />
//                     </Button>
//                     <Button
//                       onClick={() => {
//                         setSelectedDeleteId(area.id);
//                         setDeleteModalOpen(true);
//                       }}
//                       variant="outline"
//                       size="icon"
//                       disabled={isSubmitting}
//                       title="Delete"
//                       className="border-red-300 text-red-600 hover:bg-red-100"
//                     >
//                       {actioningId === area.id ? (
//                         <span className="animate-spin h-4 w-4 rounded-full border-2 border-t-transparent border-red-500"></span>
//                       ) : (
//                         <Trash2 size={16} />
//                       )}
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>

//       {/* Confirm Deletion Modal */}
//       <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
//         <DialogContent>
//           <p className="text-gray-700">Are you sure you want to delete this area?</p>
//           <DialogFooter className="flex justify-end gap-2 mt-4">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setDeleteModalOpen(false);
//                 setSelectedDeleteId(null);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={confirmDelete}
//               disabled={isSubmitting}
//             >
//               {actioningId === selectedDeleteId ? (
//                 <span className="animate-spin h-4 w-4 rounded-full border-2 border-t-transparent border-white"></span>
//               ) : (
//                 "Delete"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/index";
import { Edit, Trash2, MapPin, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  deleteArea,
  toggleAreaStatus,
  selectIsSubmitting,
} from "@/store/slices/locationSlice";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

interface Area {
  id: string;
  locationName: string;
  address?: string;
  range: number;
  isActive: boolean;
}

type SortField = 'name' | 'range' | 'status';
type SortOrder = 'asc' | 'desc';

interface AreaTableProps {
  areas: Area[];
  onEditClick?: (area: Area) => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
}

interface SortableHeaderProps {
  field: SortField;
  currentSortField?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
  children: React.ReactNode;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  currentSortField,
  sortOrder,
  onSort,
  children,
  className = "",
}) => {
  const getSortIcon = () => {
    if (currentSortField !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-purple-600" /> : 
      <ArrowDown className="w-4 h-4 text-purple-600" />;
  };

  return (
    <TableHead 
      className={`font-semibold text-gray-700 cursor-pointer transition-colors ${className}`}
      onClick={() => onSort?.(field)}
    >
      <div className="flex items-center justify-between group">
        {children}
        {getSortIcon()}
      </div>
    </TableHead>
  );
};

export function AreaTable({ 
  areas, 
  onEditClick, 
  sortField, 
  sortOrder, 
  onSort 
}: AreaTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isSubmitting = useSelector(selectIsSubmitting);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string) => {
    setActioningId(id);
    await dispatch(toggleAreaStatus(id));
    setActioningId(null);
  };

  const confirmDelete = async () => {
    if (!selectedDeleteId) return;
    setActioningId(selectedDeleteId);
    await dispatch(deleteArea(selectedDeleteId));
    setActioningId(null);
    setDeleteModalOpen(false);
    setSelectedDeleteId(null);
  };

  return (
    <div className="border rounded-lg shadow-sm mt-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-purple-50">
            <SortableHeader
              field="name"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              Name
            </SortableHeader>
            <TableHead className="font-semibold text-gray-700">Address</TableHead>
            <SortableHeader
              field="range"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              Service Range (km)
            </SortableHeader>
            <SortableHeader
              field="status"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
            >
              Status
            </SortableHeader>
            <TableHead className="text-right font-semibold text-gray-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No areas found
              </TableCell>
            </TableRow>
          ) : (
            areas.map((area, index) => (
              <TableRow
                key={area.id}
                className={`transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-purple-600 flex-shrink-0" />
                    <span className="truncate max-w-[200px]" title={area.locationName}>
                      {area.locationName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 max-w-[250px]">
                  <span className="truncate block" title={area.address || "N/A"}>
                    {area.address || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">
                  <span className="inline-flex items-center align px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {area.range} km
                  </span>
                </TableCell>
                <TableCell>
                  {area.isActive ? (
                    <Badge className="bg-green-100 text-green-800 border border-green-300">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border border-red-300">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        {area.isActive ? 'On' : 'Off'}
                      </span>
                      <Switch
                        checked={area.isActive}
                        onCheckedChange={() => handleToggleStatus(area.id)}
                        disabled={isSubmitting || actioningId === area.id}
                        // size="sm"
                      />
                    </div>
                    <Button
                      onClick={() => onEditClick?.(area)}
                      variant="outline"
                      size="icon"
                      disabled={isSubmitting}
                      title="Edit area"
                      className="border-purple-300 text-purple-600 hover:bg-purple-100 h-8 w-8"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedDeleteId(area.id);
                        setDeleteModalOpen(true);
                      }}
                      variant="outline"
                      size="icon"
                      disabled={isSubmitting}
                      title="Delete area"
                      className="border-red-300 text-red-600 hover:bg-red-100 h-8 w-8"
                    >
                      {actioningId === area.id ? (
                        <span className="animate-spin h-3 w-3 rounded-full border-2 border-t-transparent border-red-500"></span>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Confirm Deletion Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Delete Service Area</h3>
              <p className="text-gray-500 text-sm mt-1">
                This action cannot be undone. Are you sure you want to delete this service area?
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedDeleteId(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="min-w-[80px]"
            >
              {actioningId === selectedDeleteId ? (
                <span className="animate-spin h-4 w-4 rounded-full border-2 border-t-transparent border-white"></span>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}