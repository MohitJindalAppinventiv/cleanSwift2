
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/index";
import { Edit, Trash2, MapPin } from "lucide-react";
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
  DialogTrigger,
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

interface AreaTableProps {
  areas: Area[];
  onEditClick?: (area: Area) => void;
}

export function AreaTable({ areas, onEditClick }: AreaTableProps) {
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
    <div className="border rounded-md mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Service Range (km)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No areas found
              </TableCell>
            </TableRow>
          ) : (
            areas.map((area) => (
              <TableRow
                key={area.id}
                className={isSubmitting ? "opacity-60 pointer-events-none" : ""}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {area.locationName}
                  </div>
                </TableCell>
                <TableCell>{area.address || "N/A"}</TableCell>
                <TableCell>{area.range}</TableCell>
                <TableCell>
                  {area.isActive ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-800"
                    >
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 items-center">
                    <Switch
                      checked={area.isActive}
                      onCheckedChange={() => handleToggleStatus(area.id)}
                      disabled={isSubmitting}
                    />
                    <Button
                      onClick={() => onEditClick?.(area)}
                      variant="ghost"
                      size="icon"
                      disabled={isSubmitting}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedDeleteId(area.id);
                        setDeleteModalOpen(true);
                      }}
                      variant="ghost"
                      size="icon"
                      disabled={isSubmitting}
                      title="Delete"
                    >
                      {actioningId === area.id ? (
                        <span className="animate-spin h-4 w-4 rounded-full border-2 border-t-transparent border-gray-600"></span>
                      ) : (
                        <Trash2 size={16} />
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
        <DialogContent>
          <p>Are you sure you want to delete this area?</p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedDeleteId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
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

