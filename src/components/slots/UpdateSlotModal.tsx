import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  onUpdated: () => void; // callback to refresh table
}

export default function UpdateSlotModal({ open, onClose, slot, onUpdated }: UpdateSlotModalProps) {
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxOrders, setMaxOrders] = useState<number>(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slot) {
      setType(slot.type);
      setDate(slot.date.slice(0, 10)); // format as YYYY-MM-DD
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
      setMaxOrders(slot.maxOrders);
    }
  }, [slot]);

  const handleUpdate = async () => {
    if (!slot) return;

    setLoading(true);
    try {
      await axiosInstance.put("/adminUpdateSlot", {
        slotId: slot.id,
        type,
        date,
        startTime,
        endTime,
        maxOrders,
        
      });
      toast.success("Slot updated successfully");
      onClose();
      onUpdated();
    } catch (err) {
      toast.error("Failed to update slot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Slot</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>


          {/* <div className="space-y-2">
            <Label>Propogate Weeks</Label>
            <Input
              type="number"
              value={slot.propogateWeeks}
              onChange={(e) => setDate(e.target.value)}
            />
          </div> */}

          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>End Time</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Orders</Label>
            <Input
              type="number"
              value={maxOrders}
              onChange={(e) => setMaxOrders(Number(e.target.value))}
            />
          </div>

          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Slot"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
