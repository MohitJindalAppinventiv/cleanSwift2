// // File: components/slots/SlotTable.tsx
// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import API from "@/api/endpoints/slot";
// import { format } from "date-fns";
// import { Pencil, Trash2, Ban } from "lucide-react";

// interface Slot {
//   id: string;
//   type: "pickup" | "delivery";
//   date: string;
//   startTime: string;
//   endTime: string;
//   maxOrders: number;
//   currentOrders: number;
//   active: boolean;
// }

// interface SlotTableProps {
//   type: string;
//   dateRange: { startDate?: Date; endDate?: Date };
// }

// export default function SlotTable({ type, dateRange }: SlotTableProps) {
//   const [slotsByDate, setSlotsByDate] = useState<Record<string, Slot[]>>({});
//   const [loading, setLoading] = useState(false);
//   const fetchSlots = async () => {
//     setLoading(true);

//     try {
//       const params: Record<string, any> = {
//         startDate: dateRange.startDate,
//         endDate: dateRange.endDate,
//       };

//       if (type !== "all") {
//         params.type = type;
//       }
//       const response = await axiosInstance.get("/adminListSlots", {
//         params,
//       });
//       console.log("Slots get response", response);
//       setSlotsByDate(response.data.slotsByDate);
//     } catch (error) {
//       console.error("Error fetching slots", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchSlots();
//   }, [type, dateRange]);

//   const handleDelete = async (id: string) => {
//     try {
//       const response = await axiosInstance.delete("/adminDeleteSlot", {

//         params:{
//           slotId: id,
//         }
//       });
//       console.log("Slot deleted response", response);
//       fetchSlots();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleToggle = async (id: string) => {
//     try {
//       const response = await axiosInstance.post(
//         "/adminToggleSlot",
//         {},
//         {
//           params: {
//             slotId: id,
//           },
//         }
//       );
//       console.log("Slot Toggle response", response);
//       fetchSlots();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {Object.entries(slotsByDate).map(([date, slots]) => (
//         <Card key={date}>
//           <CardHeader>
//             <CardTitle>{format(new Date(date), "PPP")}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             {slots.map((slot) => (
//               <div
//                 key={slot.id}
//                 className="flex justify-between items-center p-2 border rounded-md"
//               >
//                 <div className="flex flex-col gap-1">
//                   <span className="font-medium">
//                     {slot.startTime} - {slot.endTime} ({slot.type})
//                   </span>
//                   <span className="text-sm text-muted-foreground">
//                     Orders: {slot.currentOrders} / {slot.maxOrders}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant={slot.active ? "default" : "destructive"}>
//                     {slot.active ? "Active" : "Inactive"}
//                   </Badge>
//                   <Button size="icon" variant="ghost">
//                     <Pencil className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     onClick={() => handleToggle(slot.id)}
//                     size="icon"
//                     variant="ghost"
//                   >
//                     <Ban className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     onClick={() => handleDelete(slot.id)}
//                     size="icon"
//                     variant="destructive"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       ))}
//       {loading && <div className="text-center">Loading slots...</div>}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import UpdateSlotModal from "./UpdateSlotModal";

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

interface SlotTableProps {
  type: string;
  dateRange: { startDate?: Date; endDate?: Date };
}

export default function SlotTable({ type, dateRange }: SlotTableProps) {
  const [slotsByDate, setSlotsByDate] = useState<Record<string, Slot[]>>({});
  const [loading, setLoading] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
  const [editSlot, setEditSlot] = useState<Slot | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
      if (type !== "all") {
        params.type = type;
      }

      const response = await axiosInstance.get("/adminListSlots", { params });
      console.log("fetch slots response",response);
      setSlotsByDate(response.data.slotsByDate);
    } catch (error) {
      console.error("Error fetching slots", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [type, dateRange]);

  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.delete("/adminDeleteSlot", {
        params: { slotId: id },
      });
      console.log("Slot deleted response", response);
      fetchSlots();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const response = await axiosInstance.post(
        "/adminToggleSlot",
        {},
        {
          params: {
            slotId: id,
          },
        }
      );
      console.log("Slot Toggle response", response);
      fetchSlots();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(slotsByDate).map(([date, slots]) => (
        <Card key={date}>
          <CardHeader>
            <CardTitle>{format(new Date(date), "PPP")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex justify-between items-center p-2 border rounded-md"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {slot.startTime} - {slot.endTime} ({slot.type})
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Orders: {slot.currentOrders} / {slot.maxOrders}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={slot.active ? "default" : "destructive"}>
                    {slot.active ? "Active" : "Inactive"}
                  </Badge>

                  {/* Edit button (not changed) */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditSlot(slot);
                      setEditModalOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Toggle switch */}
                  <Switch
                    checked={slot.active}
                    onCheckedChange={() => handleToggle(slot.id)}
                    aria-label="Toggle slot active"
                  />

                  {/* Delete with confirmation modal */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setSlotToDelete(slot)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this slot?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. It will permanently
                          delete the slot scheduled at{" "}
                          <strong>
                            {slotToDelete?.startTime} - {slotToDelete?.endTime}
                          </strong>
                          .
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setSlotToDelete(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (slotToDelete) {
                              handleDelete(slotToDelete.id);
                              setSlotToDelete(null);
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      {loading && <div className="text-center">Loading slots...</div>}

      <UpdateSlotModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        slot={editSlot}
        onUpdated={fetchSlots}
      />
    </div>
  );
}
