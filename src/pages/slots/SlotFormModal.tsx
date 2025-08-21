
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { addSlot, selectSlotsLoading } from "@/store/slices/slotSlice";

interface SlotFormModalProps {
  open: boolean;
  onClose: () => void;
}
type SlotType = "pickup" | "delivery";

interface TimeRange {
  startTime: string;
  endTime: string;
  maxOrders: number;
}

interface ValidationErrors {
  timeRanges: {
    startTime?: string;
    endTime?: string;
    maxOrders?: string;
    timeRange?: string;
    duration?: string;
  }[];
  general?: string;
}

export default function SlotFormModal({ open, onClose }: SlotFormModalProps) {
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [weekDay, setWeekDay] = useState<number>(0);
  const [propagateWeeks, setPropagateWeeks] = useState<number>(2);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    {
      startTime: "",
      endTime: "",
      maxOrders: 5,
    },
  ]);
  const [errors, setErrors] = useState<ValidationErrors>({ timeRanges: [{}] });

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectSlotsLoading);

    useEffect(() => {
    if (!open) {
      setType("pickup");
      setWeekDay(0);
      setPropagateWeeks(2);
      setTimeRanges([{ startTime: "", endTime: "", maxOrders: 5 }]);
      setErrors({ timeRanges: [{}] });
    }
  }, [open]);

  // Helper function to calculate duration in hours
  const calculateDurationInHours = (startTime: string, endTime: string): number => {
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
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
    }
    
    return `${wholeHours}h ${minutes}m`;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      timeRanges: timeRanges.map(() => ({})),
    };
    let hasErrors = false;

    // Validate each time range
    timeRanges.forEach((range, index) => {
      // Check if start time is empty
      if (!range.startTime.trim()) {
        newErrors.timeRanges[index].startTime = "Start time is required";
        hasErrors = true;
      }

      // Check if end time is empty
      if (!range.endTime.trim()) {
        newErrors.timeRanges[index].endTime = "End time is required";
        hasErrors = true;
      }

      // Check if both times are provided
      if (range.startTime && range.endTime) {
        const startTime = new Date(`2000-01-01T${range.startTime}`);
        const endTime = new Date(`2000-01-01T${range.endTime}`);
        
        // Handle next day scenarios
        if (endTime <= startTime) {
          endTime.setDate(endTime.getDate() + 1);
        }
        
        const durationHours = calculateDurationInHours(range.startTime, range.endTime);
        
        // Validate 2-hour maximum duration
        if (durationHours > 2) {
          newErrors.timeRanges[index].duration = `Duration cannot exceed 2 hours (current: ${formatDuration(durationHours)})`;
          hasErrors = true;
        }
        
        // Validate minimum duration (optional - you can remove this if not needed)
        if (durationHours < 0.5) {
          newErrors.timeRanges[index].duration = "Duration must be at least 30 minutes";
          hasErrors = true;
        }
      }

      // Check max orders
      if (!range.maxOrders || range.maxOrders < 1) {
        newErrors.timeRanges[index].maxOrders = "Max orders must be at least 1";
        hasErrors = true;
      }

      // Check max orders upper limit (optional)
      if (range.maxOrders > 100) {
        newErrors.timeRanges[index].maxOrders = "Max orders cannot exceed 100";
        hasErrors = true;
      }
    });

    // Check for overlapping time ranges
    for (let i = 0; i < timeRanges.length; i++) {
      for (let j = i + 1; j < timeRanges.length; j++) {
        const range1 = timeRanges[i];
        const range2 = timeRanges[j];
        
        if (range1.startTime && range1.endTime && range2.startTime && range2.endTime) {
          const start1 = new Date(`2000-01-01T${range1.startTime}`);
          const end1 = new Date(`2000-01-01T${range1.endTime}`);
          const start2 = new Date(`2000-01-01T${range2.startTime}`);
          const end2 = new Date(`2000-01-01T${range2.endTime}`);

          // Handle next day scenarios for both ranges
          if (end1 <= start1) {
            end1.setDate(end1.getDate() + 1);
          }
          if (end2 <= start2) {
            end2.setDate(end2.getDate() + 1);
          }

          // Check if ranges overlap
          if (start1 < end2 && start2 < end1) {
            newErrors.timeRanges[i].timeRange = "Time ranges cannot overlap";
            newErrors.timeRanges[j].timeRange = "Time ranges cannot overlap";
            hasErrors = true;
          }
        }
      }
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    const result = await dispatch(
      addSlot({
        type,
        weekDay,
        propagateWeeks,
        timeRanges,
      })
    );

    if (addSlot.fulfilled.match(result)) {
      setType("pickup");
      setWeekDay(1);
      setPropagateWeeks(2);
      setTimeRanges([
        {
          startTime: "",
          endTime: "",
          maxOrders: 5,
        },
      ]);
      setErrors({ timeRanges: [{}] });
      toast.success("Slots created successfully");
      onClose();
    } else {
      toast.error((result.payload as string) || "Failed to create slots");
    }
  };

  const updateTimeRange = (
    index: number,
    field: keyof TimeRange,
    value: string | number
  ) => {
    const newRanges = [...timeRanges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setTimeRanges(newRanges);

    // Clear errors for this field when user starts typing
    const newErrors = { ...errors };
    if (field === "startTime") {
      delete newErrors.timeRanges[index].startTime;
    } else if (field === "endTime") {
      delete newErrors.timeRanges[index].endTime;
    } else if (field === "maxOrders") {
      delete newErrors.timeRanges[index].maxOrders;
    }
    // Clear time range and duration errors when either time is updated
    if (field === "startTime" || field === "endTime") {
      delete newErrors.timeRanges[index].timeRange;
      delete newErrors.timeRanges[index].duration;
    }
    setErrors(newErrors);
  };

  const addTimeRange = () => {
    setTimeRanges([
      ...timeRanges,
      {
        startTime: "",
        endTime: "",
        maxOrders: 5,
      },
    ]);
    setErrors({
      ...errors,
      timeRanges: [...errors.timeRanges, {}],
    });
  };

  const removeTimeRange = (index: number) => {
    if (timeRanges.length > 1) {
      const newRanges = timeRanges.filter((_, i) => i !== index);
      const newErrors = {
        ...errors,
        timeRanges: errors.timeRanges.filter((_, i) => i !== index),
      };
      setTimeRanges(newRanges);
      setErrors(newErrors);
    }
  };

  const WeekDays = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Slots (Propagated by Week)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(value: SlotType) => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Weekday</Label>
            <Select
              value={weekDay.toString()}
              onValueChange={(value) => setWeekDay(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Weekday" />
              </SelectTrigger>
              <SelectContent>
                {WeekDays.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Propagate Weeks</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={propagateWeeks}
              onChange={(e) => {
                const val = Math.max(1, Math.min(12, Number(e.target.value)));
                setPropagateWeeks(val);
              }}
            />
          </div>

          {/* Time Ranges */}
          <div>
            <Label>Time Ranges</Label>
            <p className="text-sm text-slate-600 mb-3">
              Each slot duration must not exceed 2 hours.
            </p>
            {timeRanges.map((range, i) => {
              const duration = calculateDurationInHours(range.startTime, range.endTime);
              const durationText = duration > 0 ? formatDuration(duration) : "";
              const isDurationValid = duration > 0 && duration <= 2;
              
              return (
                <div key={i} className="border p-4 rounded-lg mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Time */}
                    <div>
                      <Label className="text-sm">Start Time</Label>
                      <Input
                        type="time"
                        value={range.startTime}
                        onChange={(e) =>
                          updateTimeRange(i, "startTime", e.target.value)
                        }
                        className={errors.timeRanges[i]?.startTime ? "border-red-500" : ""}
                      />
                      {errors.timeRanges[i]?.startTime && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.timeRanges[i].startTime}
                        </p>
                      )}
                    </div>

                    {/* End Time */}
                    <div>
                      <Label className="text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={range.endTime}
                        onChange={(e) =>
                          updateTimeRange(i, "endTime", e.target.value)
                        }
                        className={errors.timeRanges[i]?.endTime ? "border-red-500" : ""}
                      />
                      {errors.timeRanges[i]?.endTime && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.timeRanges[i].endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Duration Display */}
                  {durationText && (
                    <div className="mt-2">
                      <div className={`text-xs px-2 py-1 rounded inline-block ${
                        isDurationValid 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        Duration: {durationText}
                        {duration > 2 && " (exceeds 2-hour limit)"}
                      </div>
                    </div>
                  )}

                  {/* Duration Error */}
                  {errors.timeRanges[i]?.duration && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.timeRanges[i].duration}
                    </p>
                  )}

                  {/* Time Range Error (for overlap) */}
                  {errors.timeRanges[i]?.timeRange && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.timeRanges[i].timeRange}
                    </p>
                  )}

                  {/* Max Orders + Remove */}
                  <div className="flex gap-2 mt-4 items-end">
                    <div className="flex-1">
                      <Label className="text-sm">Max Orders</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={range.maxOrders}
                        onChange={(e) =>
                          updateTimeRange(i, "maxOrders", Number(e.target.value))
                        }
                        className={errors.timeRanges[i]?.maxOrders ? "border-red-500" : ""}
                      />
                      {errors.timeRanges[i]?.maxOrders && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.timeRanges[i].maxOrders}
                        </p>
                      )}
                    </div>
                    {timeRanges.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTimeRange(i)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            <Button type="button" variant="outline" onClick={addTimeRange}>
              + Add Time Range
            </Button>
          </div>

          {/* General Error */}
          {errors.general && (
            <p className="text-red-500 text-sm">{errors.general}</p>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating..." : "Create Slots"}
            </Button>
            <Button variant="outline" disabled={loading} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}