// // File: components/slots/SlotFormModal.tsx
// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store";
// import { fetchSlots } from "@/store/slices/slotSlice";
// interface SlotFormModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export default function SlotFormModal({ open, onClose }: SlotFormModalProps) {
//   const [type, setType] = useState<"pickup" | "delivery">("pickup");
//   const [weekDay, setWeekDay] = useState<number>(1);
//   const [propagateWeeks, setPropagateWeeks] = useState<number>(2);
//   const [timeRanges, setTimeRanges] = useState([
//     { startTime: "0", endTime: "0", maxOrders: 5 },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const dispatch=useDispatch<AppDispatch>();

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await axiosInstance.post("/adminAddSlots",{ type, weekDay, propagateWeeks, timeRanges });
//       await dispatch(fetchSlots());
//       toast.success("Slots created successfully");
//       onClose();
//     } catch (err) {
//       toast.error("Failed to create slots");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateTimeRange = (index: number, field: string, value: string | number) => {
//     const newRanges = [...timeRanges];
//     newRanges[index] = { ...newRanges[index], [field]: value };
//     setTimeRanges(newRanges);
//   };

//   const addTimeRange = () => {
//     setTimeRanges([...timeRanges, { startTime: "", endTime: "", maxOrders: 5 }]);
//   };

// const WeekDays = [
//   { label: "Sunday", value: 0 },
//   { label: "Monday", value: 1 },
//   { label: "Tuesday", value: 2 },
//   { label: "Wednesday", value: 3 },
//   { label: "Thursday", value: 4 },
//   { label: "Friday", value: 5 },
//   { label: "Saturday", value: 6 },
// ];

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Slots (Propagated by Week)</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label>Type</Label>
//             <Select value={type} onValueChange={(value) => setType(value as any)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="pickup">Pickup</SelectItem>
//                 <SelectItem value="delivery">Delivery</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Weekday</Label>
//             <Select value={weekDay.toString()} onValueChange={(value)=>setWeekDay(Number(value))}>
//                 <SelectTrigger>
//                     <SelectValue placeholder="Select Weekday" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {WeekDays.map((day)=>(
//                         <SelectItem key={day.value} value={day.value.toString()}>{day.label}</SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Propagate Weeks</Label>
//             <Input
//               type="number"
//               value={propagateWeeks}
//               onChange={(e) => setPropagateWeeks(Number(e.target.value))}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label>Time Ranges</Label>
//             {timeRanges.map((range, i) => (
//               <div key={i} className="flex items-center gap-2">
//                 <Input
//                   placeholder="Start Time (HH:mm)"
//                   value={range.startTime}
//                   onChange={(e) => updateTimeRange(i, "startTime", e.target.value)}
//                 />
//                 <Input
//                   placeholder="End Time (HH:mm)"
//                   value={range.endTime}
//                   onChange={(e) => updateTimeRange(i, "endTime", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Max Orders"
//                   type="number"
//                   value={range.maxOrders}
//                   onChange={(e) => updateTimeRange(i, "maxOrders", Number(e.target.value))}
//                 />
//               </div>
//             ))}
//             <Button type="button" variant="outline" onClick={addTimeRange}>
//               + Add Time Range
//             </Button>
//           </div>

//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Creating..." : "Create Slots"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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

export default function SlotFormModal({ open, onClose }: SlotFormModalProps) {
  const [type, setType] = useState<"pickup" | "delivery">("pickup");
  const [weekDay, setWeekDay] = useState<number>(1);
  const [propagateWeeks, setPropagateWeeks] = useState<number>(2);
  const [timeRanges, setTimeRanges] = useState([
    { startTime: "", endTime: "", maxOrders: 5 },
  ]);

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectSlotsLoading);

  const handleSubmit = async () => {
    const result = await dispatch(
      addSlot({ type, weekDay, propagateWeeks, timeRanges })
    );
    if (addSlot.fulfilled.match(result)) {
      setType("pickup");
      setWeekDay(1);
      setPropagateWeeks(2);
      setTimeRanges([{ startTime: "", endTime: "", maxOrders: 5 }]);
      toast.success("Slots created successfully");
      onClose();
    } else {
      toast.error((result.payload as string) || "Failed to create slots");
    }
  };

  const updateTimeRange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newRanges = [...timeRanges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setTimeRanges(newRanges);
  };

  const addTimeRange = () => {
    setTimeRanges([
      ...timeRanges,
      { startTime: "", endTime: "", maxOrders: 5 },
    ]);
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
      <DialogContent>
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
              value={propagateWeeks}
              onChange={(e) => setPropagateWeeks(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Time Ranges</Label>
            {timeRanges.map((range, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  placeholder="Start Time (HH:mm)"
                  value={range.startTime}
                  onChange={(e) =>
                    updateTimeRange(i, "startTime", e.target.value)
                  }
                />
                <Input
                  placeholder="End Time (HH:mm)"
                  value={range.endTime}
                  onChange={(e) =>
                    updateTimeRange(i, "endTime", e.target.value)
                  }
                />
                <Input
                  placeholder="Max Orders"
                  type="number"
                  value={range.maxOrders}
                  onChange={(e) =>
                    updateTimeRange(i, "maxOrders", Number(e.target.value))
                  }
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addTimeRange}>
              + Add Time Range
            </Button>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Slots"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
