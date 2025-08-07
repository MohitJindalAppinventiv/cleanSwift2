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


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
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
}

export function BannerTable({
  banners,
  onEdit,
  onDelete,
  onToggle,
}: BannerTableProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    bannerId: string | null;
  }>({ open: false, bannerId: null });

  const handleToggle = async (id: string) => {
    setUpdatingStatus(id);
    await onToggle(id);
    setUpdatingStatus(null);
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={() =>
          setConfirmDialog({ open: false, bannerId: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <p>Are you sure you want to delete this banner?</p>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, bannerId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDialog.bannerId) {
                  onDelete(confirmDialog.bannerId);
                  setConfirmDialog({ open: false, bannerId: null });
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner Table */}
      <div className="w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No banners found.
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {banner.description}
                  </TableCell>
                  <TableCell>
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="h-10 w-16 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        banner.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(banner.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Toggle Switch */}
                      <Switch
                        checked={banner.isActive}
                        onClick={() => handleToggle(banner.id)}
                        disabled={updatingStatus === banner.id}
                      />

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setConfirmDialog({
                            open: true,
                            bannerId: banner.id,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
