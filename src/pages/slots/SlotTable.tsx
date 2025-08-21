
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store"; // Adjust import path as needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  Clock,
  Package,
  Truck,
  Users,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import UpdateSlotModal from "./UpdateSlotModal";
import {
  fetchSlots,
  deleteSlot,
  toggleSlot,
  selectSlots,
  selectSlotsLoading,
  selectSlotsError,
  clearError,
  type Slot,
  type DateRange,
} from "../../store/slices/slotSlice"; // Adjust import path as needed
import axios from "axios";
import { toast } from "sonner";
import SlotTableSkeleton from "./SlotTableSkeleton";

// Helper functions
const format = (date: Date, formatStr: string) => {
  if (formatStr === "EEEE, MMMM do, yyyy") {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  if (formatStr === "PPP") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return date.toLocaleDateString();
};

interface SlotTableProps {
  type: string;
  dateRange: DateRange;
}

const formatTo12Hour = (time24: string) => {
  if (!time24) return "";
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert 0 -> 12, 13 -> 1, etc.
  return `${hour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

export default function SlotTable({ type, dateRange }: SlotTableProps) {
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const slotsByDate = useSelector(selectSlots);
  const loading = useSelector(selectSlotsLoading);
  const error = useSelector(selectSlotsError);

  // Local state for modals
  const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
  const [editSlot, setEditSlot] = useState<Slot | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // Local state for loaders 
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [togglingSlotId, setTogglingSlotId] = useState<string | null>(null);

  // Fetch slots when type or dateRange changes
  useEffect(() => {
    dispatch(fetchSlots({ type, dateRange }));
  }, [dispatch, type, dateRange]);

  // Clear error when component unmounts or when error changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingSlotId(id);
      await dispatch(deleteSlot(id)).unwrap();
      setSlotToDelete(null);
      toast.success("Slot deleted successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete slot.");
      }
    } finally {
      setDeletingSlotId(null);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      setTogglingSlotId(id);
      await dispatch(toggleSlot(id)).unwrap();
    } catch (error) {
      console.error("Failed to toggle slot:", error);
      toast.error("Failed to toggle slot status");
    } finally {
      setTogglingSlotId(null);
    }
  };

  const handleSlotUpdated = () => {
    // Refetch slots after update
    dispatch(fetchSlots({ type, dateRange }));
  };

  const getSlotUtilization = (slot: Slot) =>
    Math.round((slot.currentOrders / slot.maxOrders) * 100);

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    if (percentage >= 40) return "bg-blue-500";
    return "bg-green-500";
  };

  const getUtilizationStatus = (percentage: number) => {
    if (percentage >= 90)
      return { color: "text-red-600", icon: AlertCircle, label: "High" };
    if (percentage >= 70)
      return { color: "text-amber-600", icon: Activity, label: "Medium" };
    if (percentage >= 40)
      return { color: "text-blue-600", icon: Activity, label: "Low" };
    return { color: "text-green-600", icon: CheckCircle2, label: "Available" };
  };

  // Error display
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error Loading Slots
          </h3>
          <p className="text-slate-600 max-w-md">{error}</p>
          <Button
            onClick={() => dispatch(fetchSlots({ type, dateRange }))}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <SlotTableSkeleton />;
  }

  // Empty state
  if (Object.keys(slotsByDate).length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          No slots found
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          No slots match your current filters. Try adjusting your date range or
          slot type.
        </p>
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
      {Object.entries(slotsByDate).map(([date, slots]) => {
        const pickupSlots = slots.filter((s) => s.type === "pickup");
        const deliverySlots = slots.filter((s) => s.type === "delivery");

        return (
          <Card
            key={date}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <CardHeader className="bg-white border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {format(new Date(date), "EEEE, MMMM do, yyyy")}
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                      {slots.length} slot{slots.length !== 1 ? "s" : ""}{" "}
                      scheduled
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  {pickupSlots.length > 0 && (
                    <div className="text-center">
                      <div className="font-semibold">{pickupSlots.length}</div>
                      <div className="uppercase">Pickup</div>
                    </div>
                  )}
                  {deliverySlots.length > 0 && (
                    <div className="text-center">
                      <div className="font-semibold">
                        {deliverySlots.length}
                      </div>
                      <div className="uppercase">Delivery</div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Pickup Slots */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-medium text-slate-800">Pickup Slots</h3>
                  </div>
                  {pickupSlots.length > 0 ? (
                    pickupSlots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        onEdit={() => {
                          setEditSlot(slot);
                          setEditModalOpen(true);
                        }}
                        onToggle={() => handleToggle(slot.id)}
                        onDelete={() => setSlotToDelete(slot)}
                        getSlotUtilization={getSlotUtilization}
                        getUtilizationColor={getUtilizationColor}
                        getUtilizationStatus={getUtilizationStatus}
                        isDeleting={deletingSlotId === slot.id}
                        isToggling={togglingSlotId === slot.id}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No pickup slots
                    </p>
                  )}
                </div>

                {/* Delivery Slots */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <h3 className="font-medium text-slate-800">
                      Delivery Slots
                    </h3>
                  </div>
                  {deliverySlots.length > 0 ? (
                    deliverySlots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        onEdit={() => {
                          setEditSlot(slot);
                          setEditModalOpen(true);
                        }}
                        onToggle={() => handleToggle(slot.id)}
                        onDelete={() => setSlotToDelete(slot)}
                        getSlotUtilization={getSlotUtilization}
                        getUtilizationColor={getUtilizationColor}
                        getUtilizationStatus={getUtilizationStatus}
                        isDeleting={deletingSlotId === slot.id}
                        isToggling={togglingSlotId === slot.id}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No delivery slots
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <UpdateSlotModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        slot={editSlot}
        onUpdated={handleSlotUpdated}
      />

      <AlertDialog
        open={!!slotToDelete}
        onOpenChange={() => setSlotToDelete(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Delete Slot
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this slot? This action cannot be undone.
              {slotToDelete && (
                <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                  <strong>Slot:</strong> {formatTo12Hour(slotToDelete.startTime)} - {formatTo12Hour(slotToDelete.endTime)}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingSlotId}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (slotToDelete) {
                  handleDelete(slotToDelete.id);
                }
              }}
              disabled={!!deletingSlotId}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingSlotId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Slot"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const SlotCard = ({
  slot,
  onEdit,
  onToggle,
  onDelete,
  getSlotUtilization,
  getUtilizationColor,
  getUtilizationStatus,
  isDeleting,
  isToggling,
}: {
  slot: Slot;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  getSlotUtilization: (slot: Slot) => number;
  getUtilizationColor: (percentage: number) => string;
  getUtilizationStatus: (percentage: number) => {
    color: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
  };
  isDeleting?: boolean;
  isToggling?: boolean;
}) => {
  const utilization = getSlotUtilization(slot);
  const utilizationColor = getUtilizationColor(utilization);
  const status = getUtilizationStatus(utilization);
  const StatusIcon = status.icon;

  return (
    <div
      className={`border rounded-lg p-4 mb-3 transition-all duration-200 hover:shadow-md ${
        slot.type === "pickup"
          ? "border-emerald-200 hover:border-emerald-300"
          : "border-indigo-200 hover:border-indigo-300"
      } ${!slot.active && "bg-slate-50 opacity-75"} ${
        isDeleting && "opacity-50 pointer-events-none"
      }`}
    >
      {/* Time & Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-900">
            {formatTo12Hour(slot.startTime)} - {formatTo12Hour(slot.endTime)}
          </span>
          {isDeleting && (
            <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 border-red-200">
              Deleting...
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isToggling ? (
            <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
          ) : (
            <Switch 
              checked={slot.active} 
              onCheckedChange={onToggle}
              disabled={isDeleting}
            />
          )}
          <Badge
            variant={slot.active ? "default" : "secondary"}
            className={`text-xs ${
              slot.active
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            {slot.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Capacity */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-slate-600">
            <Users className="w-3 h-3" />
            <span>Capacity</span>
          </div>
          <span className="font-medium text-slate-800">
            {slot.currentOrders} / {slot.maxOrders}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${utilizationColor}`}
            style={{ width: `${utilization}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 text-xs ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="font-medium">{status.label}</span>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {utilization}% filled
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="h-8 px-2 hover:bg-blue-50 hover:text-blue-700"
          disabled={isDeleting || isToggling}
        >
          <Pencil className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-8 px-2 hover:bg-red-50 hover:text-red-700"
          disabled={isDeleting || isToggling}
        >
          {isDeleting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3" />
          )}
        </Button>
      </div>
    </div>
  );
};