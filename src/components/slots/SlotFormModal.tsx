import React, { useState } from "react";
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

interface TimeRange {
  startTime: string;
  startPeriod: "AM" | "PM";
  endTime: string;
  endPeriod: "AM" | "PM";
  maxOrders: number;
}

export default function SlotFormModal({ open, onClose }: SlotFormModalProps) {
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [weekDay, setWeekDay] = useState<number>(1);
  const [propagateWeeks, setPropagateWeeks] = useState<number>(2);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    {
      startTime: "",
      startPeriod: "AM",
      endTime: "",
      endPeriod: "PM",
      maxOrders: 5,
    },
  ]);

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectSlotsLoading);

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time: string, period: "AM" | "PM"): string => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);

    if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    } else if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    }

    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  };

  // Format time for display with AM/PM
  const formatTimeForDisplay = (time: string, period: "AM" | "PM"): string => {
    if (!time) return "";
    return `${time} ${period}`;
  };

  const handleSubmit = async () => {
    // Convert AM/PM to 24-hour format before sending
    const formattedTimeRanges = timeRanges.map((range) => ({
      startTime: convertTo24Hour(range.startTime, range.startPeriod),
      endTime: convertTo24Hour(range.endTime, range.endPeriod),
      maxOrders: range.maxOrders,
    }));

    const result = await dispatch(
      addSlot({
        type,
        weekDay,
        propagateWeeks,
        timeRanges: formattedTimeRanges,
      })
    );

    if (addSlot.fulfilled.match(result)) {
      setType("pickup");
      setWeekDay(1);
      setPropagateWeeks(2);
      setTimeRanges([
        {
          startTime: "",
          startPeriod: "AM",
          endTime: "",
          endPeriod: "PM",
          maxOrders: 5,
        },
      ]);
      toast.success("Slots created successfully");
      onClose();
    } else {
      toast.error((result.payload as string) || "Failed to create slots");
    }
  };

  const updateTimeRange = (
    index: number,
    field: keyof TimeRange,
    value: string | number | "AM" | "PM"
  ) => {
    const newRanges = [...timeRanges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setTimeRanges(newRanges);
  };

  const addTimeRange = () => {
    setTimeRanges([
      ...timeRanges,
      {
        startTime: "",
        startPeriod: "AM",
        endTime: "",
        endPeriod: "PM",
        maxOrders: 5,
      },
    ]);
  };

  const removeTimeRange = (index: number) => {
    if (timeRanges.length > 1) {
      const newRanges = timeRanges.filter((_, i) => i !== index);
      setTimeRanges(newRanges);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Slots (Propagated by Week)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as any)}
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
              min="1"
              max="12"
              value={propagateWeeks}
              onChange={(e) => setPropagateWeeks(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Time Ranges</Label>
            {timeRanges.map((range, i) => (
              <div key={i} className="border p-4 rounded-lg mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div>
                    <Label className="text-sm">Start Time</Label>
                    <div className="flex gap-2">
                      {/* <Input
                      type="time"
                        placeholder="HH:MM"
                        value={range.startTime}
                        onChange={(e) =>
                          updateTimeRange(i, "startTime", e.target.value)
                        }
                      /> */}
                      {/* <Select
                        value={range.startPeriod}
                        onValueChange={(value) =>
                          updateTimeRange(i, "startPeriod", value as "AM" | "PM")
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select> */}

                      <Input
                        type="text"
                        placeholder="HH:MM"
                        value={range.startTime}
                        onChange={(e) =>
                          updateTimeRange(i, "startTime", e.target.value)
                        }
                      />
                      <Select
                        value={range.startPeriod}
                        onValueChange={(value) =>
                          updateTimeRange(
                            i,
                            "startPeriod",
                            value as "AM" | "PM"
                          )
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* End Time */}
                  <div>
                    <Label className="text-sm">End Time</Label>
                    <div className="flex gap-2">
                      {/* <Input
                        type="time"
                        placeholder="HH:MM"
                        value={range.endTime}
                        onChange={(e) =>
                          updateTimeRange(i, "endTime", e.target.value)
                        }
                      /> */}
                      {/* <Input
                        type="text"
                        placeholder="HH:MM"
                        value={range.endTime}
                        onChange={(e) =>
                          updateTimeRange(i, "endTime", e.target.value)
                        }
                      />
                      <Select
                        value={range.endPeriod}
                        onValueChange={(value) =>
                          updateTimeRange(
                            i,
                            "endTime",
                            value as "AM" | "PM"
                          )
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select> */}
                      <Input
                        type="text"
                        placeholder="HH:MM"
                        value={range.endTime}
                        onChange={(e) =>
                          updateTimeRange(i, "endTime", e.target.value)
                        }
                      />
                      <Select
                        value={range.endPeriod}
                        onValueChange={(value) =>
                          updateTimeRange(i, "endPeriod", value as "AM" | "PM")
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 items-end">
                  <div className="flex-1">
                    <Label className="text-sm">Max Orders</Label>
                    <Input
                      type="number"
                      min="1"
                      value={range.maxOrders}
                      onChange={(e) =>
                        updateTimeRange(i, "maxOrders", Number(e.target.value))
                      }
                    />
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
            ))}

            <Button type="button" variant="outline" onClick={addTimeRange}>
              + Add Time Range
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating..." : "Create Slots"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
