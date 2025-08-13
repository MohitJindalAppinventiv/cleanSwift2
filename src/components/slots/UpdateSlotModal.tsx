import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export default function UpdateSlotModal({ open, onClose, slot, onUpdated }: UpdateSlotModalProps) {

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxOrders, setMaxOrders] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slot) {
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
        startTime,
        endTime,
        maxOrders,
        
      },{
        params:{slotId:slot.id}
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
