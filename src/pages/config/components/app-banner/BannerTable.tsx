// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { format } from "date-fns";

// interface Banner {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   isActive: boolean;
//   createdAt: Date;
// }

// interface BannerTableProps {
//   banners: Banner[];
//   onEdit: (banner: Banner) => void;
//   onDelete: (id: string) => void;
//   onToggle: (id: string) => void;
// }

// export function BannerTable({
//   banners,
//   onEdit,
//   onDelete,
//   onToggle,
// }: BannerTableProps) {
//   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

//   const handleToggle = async (id: string) => {
//     setUpdatingStatus(id);
//     await onToggle(id);
//     setUpdatingStatus(null);
//   };

//   return (
//     <div className="w-full overflow-auto rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Title</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Image</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {banners.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={6} className="h-24 text-center">
//                 No banners found.
//               </TableCell>
//             </TableRow>
//           ) : (
//             banners.map((banner) => (
//               <TableRow key={banner.id}>
//                 <TableCell className="font-medium">{banner.title}</TableCell>
//                 <TableCell className="max-w-xs truncate">
//                   {banner.description}
//                 </TableCell>
//                 <TableCell>
//                   <img
//                     src={banner.imageUrl}
//                     alt={banner.title}
//                     className="h-10 w-16 rounded object-cover"
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <span
//                     className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
//                       banner.isActive
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {banner.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </TableCell>
//                 <TableCell>
//                   {format(new Date(banner.createdAt), "MMM d, yyyy")}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <div className="flex items-center justify-end gap-2">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleToggle(banner.id)}
//                       disabled={updatingStatus === banner.id}
//                     >
//                       {updatingStatus === banner.id ? (
//                         <span className="animate-spin">↻</span>
//                       ) : banner.isActive ? (
//                         <Eye className="h-4 w-4 text-green-600" />
//                       ) : (
//                         <EyeOff className="h-4 w-4 text-gray-500" />
//                       )}
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => onEdit(banner)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => onDelete(banner.id)}
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

//old table
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Edit, Trash2 } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { format } from "date-fns";
// import { Switch } from "@/components/ui/switch";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
// } from "@/components/ui/dialog";

// interface Banner {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   isActive: boolean;
//   createdAt: Date;
// }

// interface BannerTableProps {
//   banners: Banner[];
//   onEdit: (banner: Banner) => void;
//   onDelete: (id: string) => void;
//   onToggle: (id: string) => Promise<void>;
// }

// export function BannerTable({
//   banners,
//   onEdit,
//   onDelete,
//   onToggle,
// }: BannerTableProps) {
//   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
//   const [confirmDialog, setConfirmDialog] = useState<{
//     open: boolean;
//     bannerId: string | null;
//   }>({ open: false, bannerId: null });

//   const handleToggle = async (id: string) => {
//     setUpdatingStatus(id);
//     await onToggle(id);
//     setUpdatingStatus(null);
//   };

//   return (
//     <>
//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={confirmDialog.open}
//         onOpenChange={() =>
//           setConfirmDialog({ open: false, bannerId: null })
//         }
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <p>Are you sure you want to delete this banner?</p>
//           </DialogHeader>
//           <DialogFooter className="flex justify-end gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setConfirmDialog({ open: false, bannerId: null })}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => {
//                 if (confirmDialog.bannerId) {
//                   onDelete(confirmDialog.bannerId);
//                   setConfirmDialog({ open: false, bannerId: null });
//                 }
//               }}
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Banner Table */}
//       <div className="w-full overflow-auto rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Title</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead>Image</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Created</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {banners.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="h-24 text-center">
//                   No banners found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               banners.map((banner) => (
//                 <TableRow key={banner.id}>
//                   <TableCell className="font-medium">{banner.title}</TableCell>
//                   <TableCell className="max-w-xs truncate">
//                     {banner.description}
//                   </TableCell>
//                   <TableCell>
//                     <img
//                       src={banner.imageUrl}
//                       alt={banner.title}
//                       className="h-10 w-16 rounded object-cover"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <span
//                       className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
//                         banner.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {banner.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     {format(new Date(banner.createdAt), "MMM d, yyyy")}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       {/* Toggle Switch */}
//                       <Switch
//                         checked={banner.isActive}
//                         onClick={() => handleToggle(banner.id)}
//                         disabled={updatingStatus === banner.id}
//                       />

//                       {/* Edit */}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => onEdit(banner)}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>

//                       {/* Delete */}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() =>
//                           setConfirmDialog({
//                             open: true,
//                             bannerId: banner.id,
//                           })
//                         }
//                       >
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </>
//   );
// }
//new one 

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Edit, Trash2, X } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
// } from "@/components/ui/dialog";

// interface Banner {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   isActive: boolean;
//   createdAt: Date;
// }

// interface BannerTableProps {
//   banners: Banner[];
//   onEdit: (banner: Banner) => void;
//   onDelete: (id: string) => void;
//   onToggle: (id: string) => Promise<void>;
//   isLoading: boolean;
// }

// export function BannerTable({
//   banners,
//   onEdit,
//   onDelete,
//   onToggle,
//   isLoading,
// }: BannerTableProps) {
//   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
//   const [confirmDialog, setConfirmDialog] = useState<{
//     open: boolean;
//     bannerId: string | null;
//   }>({ open: false, bannerId: null });
//   const [selectedImage, setSelectedImage] = useState<{
//     imageUrl: string;
//     title: string;
//   } | null>(null);

//   const handleToggle = async (id: string) => {
//     setUpdatingStatus(id);
//     await onToggle(id);
//     setUpdatingStatus(null);
//   };

//   const handleImageClick = (e: React.MouseEvent, imageUrl: string, title: string) => {
//     e.stopPropagation();
//     setSelectedImage({ imageUrl, title });
//   };

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }).format(date);
//   };

//   return (
//     <div className="space-y-6 p-6">
//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={confirmDialog.open}
//         onOpenChange={() => setConfirmDialog({ open: false, bannerId: null })}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <p className="text-sm text-gray-600">
//               Are you sure you want to delete this banner? This action cannot be undone.
//             </p>
//           </DialogHeader>
//           <DialogFooter className="flex justify-end gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setConfirmDialog({ open: false, bannerId: null })}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => {
//                 if (confirmDialog.bannerId) {
//                   onDelete(confirmDialog.bannerId);
//                   setConfirmDialog({ open: false, bannerId: null });
//                 }
//               }}
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Image Preview Modal */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
//           onClick={() => setSelectedImage(null)}
//         >
//           <div className="relative max-w-[90vw] max-h-[90vh]">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setSelectedImage(null)}
//               className="absolute -top-12 -right-2 h-8 w-8 bg-white/90 hover:bg-white text-black hover:text-red-500 transition-colors rounded-full shadow-lg z-10"
//             >
//               <X className="h-5 w-5" />
//             </Button>
//             <div className="max-h-[80vh] max-w-[80vw] flex items-center justify-center">
//               <img
//                 src={selectedImage.imageUrl}
//                 alt={selectedImage.title}
//                 className="max-h-[70vh] max-w-[70vw] object-contain rounded-lg shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   maxHeight: "70vh",
//                   maxWidth: "70vw",
//                   width: "auto",
//                   height: "auto",
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Banner Cards */}
//       {isLoading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(3)].map((_, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
//             >
//               {/* Image Placeholder */}
//               <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse"></div>
//               {/* Content Placeholder */}
//               <div className="p-6 space-y-4">
//                 <div className="flex items-start justify-between">
//                   <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
//                   <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
//                   <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
//                 </div>
//                 <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   <div className="flex items-center space-x-2">
//                     <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : banners.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="bg-gray-50 rounded-lg p-8">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
//             <p className="text-gray-500">Create your first banner to get started.</p>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {banners.map((banner) => (
//             <div
//               key={banner.id}
//               className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
//             >
//               {/* Banner Image with Hover Overlay */}
//               <div className="relative group h-48">
//                 {banner.imageUrl ? (
//                   <>
//                     <img
//                       src={banner.imageUrl}
//                       alt={banner.title}
//                       className="w-full h-full object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
//                       onClick={(e) => handleImageClick(e, banner.imageUrl, banner.title)}
//                       style={{
//                         maxHeight: "192px",
//                         objectFit: "cover",
//                       }}
//                     />
//                     <div
//                       className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg cursor-pointer"
//                       onClick={(e) => handleImageClick(e, banner.imageUrl, banner.title)}
//                     >
//                       <span className="text-white text-sm font-medium px-3 py-1 bg-black/30 rounded-md">
//                         Click to view
//                       </span>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
//                     <span className="text-gray-400 text-sm">No image</span>
//                   </div>
//                 )}
//               </div>

//               {/* Banner Content */}
//               <div className="p-6">
//                 {/* Header with Title and Status */}
//                 <div className="flex items-start justify-between mb-3">
//                   <h3 className="text-xl font-bold text-gray-900 leading-tight">
//                     {banner.title}
//                   </h3>
//                   <span
//                     className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
//                       banner.isActive
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {banner.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </div>

//                 {/* Description */}
//                 <p className="text-gray-600 text-sm line-clamp-3 mb-4">
//                   {banner.description}
//                 </p>

//                 {/* Date */}
//                 <div className="text-xs text-gray-500 mb-4">
//                   Created on {formatDate(banner.createdAt)}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       checked={banner.isActive}
//                       onClick={() => handleToggle(banner.id)}
//                       disabled={updatingStatus === banner.id}
//                     />
//                     <span className="text-sm text-gray-600">
//                       {banner.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => onEdit(banner)}
//                       className="p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() =>
//                         setConfirmDialog({
//                           open: true,
//                           bannerId: banner.id,
//                         })
//                       }
//                       className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => Promise<void>;
  isLoading: boolean;
}

export function BannerTable({
  banners,
  onEdit,
  onDelete,
  onToggle,
  isLoading,
}: BannerTableProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    bannerId: string | null;
  }>({ open: false, bannerId: null });
  const [deleting, setDeleting] = useState(false); // Add deleting state
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string;
    title: string;
  } | null>(null);

  const handleToggle = async (id: string) => {
    setUpdatingStatus(id);
    await onToggle(id);
    setUpdatingStatus(null);
  };

  const handleImageClick = (e: React.MouseEvent, imageUrl: string, title: string) => {
    e.stopPropagation();
    setSelectedImage({ imageUrl, title });
  };

  const handleDelete = async () => {
    if (!confirmDialog.bannerId) return;
    setDeleting(true); // Start loading
    try {
      await onDelete(confirmDialog.bannerId); // Await the delete operation
      setConfirmDialog({ open: false, bannerId: null }); // Close dialog on success
    } catch (error) {
      console.error("Error deleting banner:", error);
      // Optionally show an error toast
      // toast.error("Failed to delete banner");
    } finally {
      setDeleting(false); // Stop loading
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={() => !deleting && setConfirmDialog({ open: false, bannerId: null })} // Prevent closing during deletion
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this banner? This action cannot be undone.
            </p>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, bannerId: null })}
              disabled={deleting} // Disable during deletion
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting} // Disable during deletion
            >
              {deleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 -right-2 h-8 w-8 bg-white/90 hover:bg-white text-black hover:text-red-500 transition-colors rounded-full shadow-lg z-10"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="max-h-[80vh] max-w-[80vw] flex items-center justify-center">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-h-[70vh] max-w-[70vw] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxHeight: "70vh",
                  maxWidth: "70vw",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Banner Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse"></div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
            <p className="text-gray-500">Create your first banner to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
            >
              <div className="relative group h-48">
                {banner.imageUrl ? (
                  <>
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={(e) => handleImageClick(e, banner.imageUrl, banner.title)}
                      style={{
                        maxHeight: "192px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg cursor-pointer"
                      onClick={(e) => handleImageClick(e, banner.imageUrl, banner.title)}
                    >
                      <span className="text-white text-sm font-medium px-3 py-1 bg-black/30 rounded-md">
                        Click to view
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {banner.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      banner.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {banner.description}
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  Created on {formatDate(banner.createdAt)}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={banner.isActive}
                      onClick={() => handleToggle(banner.id)}
                      disabled={updatingStatus === banner.id}
                    />
                    <span className="text-sm text-gray-600">
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(banner)}
                      className="p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setConfirmDialog({
                          open: true,
                          bannerId: banner.id,
                        })
                      }
                      className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}