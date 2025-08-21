import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { axiosInstance } from "@/api/axios/axiosInstance";

interface Slot {
  id: string;
  type: "pickup" | "delivery";
  date: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  currentOrders: number;
  active: boolean;
}

interface UpdateSlotModalProps {
  open: boolean;
  onClose: () => void;
  slot: Slot | null;
  onUpdated: () => void;
}

interface ValidationErrors {
  startTime?: string;
  endTime?: string;
  maxOrders?: string;
  duration?: string;
  timeRange?: string;
}

export default function UpdateSlotModal({
  open,
  onClose,
  slot,
  onUpdated,
}: UpdateSlotModalProps) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxOrders, setMaxOrders] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Determine if any changes were made
  const hasChanges = slot
    ? startTime !== slot.startTime ||
      endTime !== slot.endTime ||
      maxOrders !== slot.maxOrders
    : false;

  useEffect(() => {
    if (slot) {
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
      setMaxOrders(slot.maxOrders);
      setErrors({}); // Clear errors when slot changes
    }
  }, [slot]);

  // Helper function to calculate duration in hours
  const calculateDurationInHours = (
    startTime: string,
    endTime: string
  ): number => {
    if (!startTime || !endTime) return 0;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    // Handle next day scenarios (e.g., 23:00 to 01:00)
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60); // Convert to hours
  };

  // Helper function to format duration for display
  const formatDuration = (hours: number): string => {
    if (hours === 0) return "";
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? "s" : ""}`;
    }

    return `${wholeHours}h ${minutes}m`;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    // Check if start time is empty
    if (!startTime.trim()) {
      newErrors.startTime = "Start time is required";
      hasErrors = true;
    }

    // Check if end time is empty
    if (!endTime.trim()) {
      newErrors.endTime = "End time is required";
      hasErrors = true;
    }

    // Check if both times are provided
    if (startTime && endTime) {
      const startTimeDate = new Date(`2000-01-01T${startTime}`);
      const endTimeDate = new Date(`2000-01-01T${endTime}`);

      // Handle next day scenarios
      if (endTimeDate <= startTimeDate) {
        endTimeDate.setDate(endTimeDate.getDate() + 1);
      }

      const durationHours = calculateDurationInHours(startTime, endTime);

      // Validate 2-hour maximum duration
      if (durationHours > 2) {
        newErrors.duration = `Duration cannot exceed 2 hours (current: ${formatDuration(
          durationHours
        )})`;
        hasErrors = true;
      }

      // Validate minimum duration (optional - you can remove this if not needed)
      if (durationHours < 0.5) {
        newErrors.duration = "Duration must be at least 30 minutes";
        hasErrors = true;
      }
    }

    // Check max orders
    if (!maxOrders || maxOrders < 1) {
      newErrors.maxOrders = "Max orders must be at least 1";
      hasErrors = true;
    }

    // Check max orders upper limit
    if (maxOrders > 100) {
      newErrors.maxOrders = "Max orders cannot exceed 100";
      hasErrors = true;
    }

    // Check if max orders is less than current orders
    if (slot && maxOrders < slot.currentOrders) {
      newErrors.maxOrders = `Max orders cannot be less than current orders (${slot.currentOrders})`;
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleUpdate = async () => {
    if (!slot) return;

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(
        "/adminUpdateSlot",
        {
          startTime,
          endTime,
          maxOrders,
        },
        {
          params: { slotId: slot.id },
        }
      );
      toast.success("Slot updated successfully");
      onClose();
      onUpdated();
    } catch (err) {
      toast.error("Failed to update slot");
    } finally {
      setLoading(false);
    }
  };

  // Clear specific error when user starts typing
  const clearError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle start time change
  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    clearError("startTime");
    clearError("duration");
    clearError("timeRange");
  };

  // Handle end time change
  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    clearError("endTime");
    clearError("duration");
    clearError("timeRange");
  };

  // Handle max orders change
  const handleMaxOrdersChange = (value: string) => {
    const numValue = value === "" ? 1 : Number(value);
    setMaxOrders(numValue);
    clearError("maxOrders");
  };

  // Handle input focus to select all text
  const handleMaxOrdersFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // Calculate current duration for display
  const currentDuration = calculateDurationInHours(startTime, endTime);
  const durationText =
    currentDuration > 0 ? formatDuration(currentDuration) : "";
  const isDurationValid = currentDuration > 0 && currentDuration <= 2;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Slot</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Slot Info Display */}
          {slot && (
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">
                <strong>Type:</strong>{" "}
                {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
              </p>
              <p className="text-sm text-slate-600 mb-1">
                <strong>Date:</strong>{" "}
                {new Date(slot.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Current Orders:</strong> {slot.currentOrders}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className={errors.startTime ? "border-red-500" : ""}
            />
            {errors.startTime && (
              <p className="text-red-500 text-xs">{errors.startTime}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>End Time</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className={errors.endTime ? "border-red-500" : ""}
            />
            {errors.endTime && (
              <p className="text-red-500 text-xs">{errors.endTime}</p>
            )}
          </div>

          {/* Duration Display */}
          {durationText && (
            <div>
              <div
                className={`text-xs px-3 py-2 rounded-md inline-block ${
                  isDurationValid
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <strong>Duration:</strong> {durationText}
                {currentDuration > 2 && " (exceeds 2-hour limit)"}
              </div>
            </div>
          )}

          {/* Duration Error */}
          {errors.duration && (
            <p className="text-red-500 text-xs">{errors.duration}</p>
          )}

          {/* Time Range Error */}
          {errors.timeRange && (
            <p className="text-red-500 text-xs">{errors.timeRange}</p>
          )}

          <div className="space-y-2">
            <Label>Max Orders</Label>
            <Input
              type="number"
              min="1"
              max="100"
              value={maxOrders}
              onChange={(e) => handleMaxOrdersChange(e.target.value)}
              onFocus={handleMaxOrdersFocus}
              className={errors.maxOrders ? "border-red-500" : ""}
            />
            {errors.maxOrders && (
              <p className="text-red-500 text-xs">{errors.maxOrders}</p>
            )}
            {slot && slot.currentOrders > 0 && (
              <p className="text-xs text-amber-600">
                Note: This slot currently has {slot.currentOrders} active orders
              </p>
            )}
          </div>

          {/* <div className="flex gap-2 pt-4">
            <Button
              onClick={handleUpdate}
              disabled={loading || !isDurationValid}
              className="flex-1"
            >
              {loading ? "Updating..." : "Update Slot"}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div> */}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleUpdate}
              disabled={loading || !isDurationValid || !hasChanges} // disable if no changes
              className="flex-1"
            >
              {loading ? "Updating..." : "Update Slot"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading} // only disabled while updating
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
