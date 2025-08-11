// // import React, { useEffect, useState } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Switch } from "@/components/ui/switch";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog";
// // import { axiosInstance } from "@/api/axios/axiosInstance";
// // import { format, formatDate } from "date-fns";
// // import { Pencil, Trash2 } from "lucide-react";
// // import UpdateSlotModal from "./UpdateSlotModal";

// // interface Slot {
// //   id: string;
// //   type: "pickup" | "delivery";
// //   date: string;
// //   startTime: string;
// //   endTime: string;
// //   maxOrders: number;
// //   currentOrders: number;
// //   active: boolean;
// // }

// // interface SlotTableProps {
// //   type: string;
// //   dateRange: { startDate?: Date; endDate?: Date };
// // }

// // export default function SlotTable({ type, dateRange }: SlotTableProps) {
// //   const [slotsByDate, setSlotsByDate] = useState<Record<string, Slot[]>>({});
// //   const [loading, setLoading] = useState(false);
// //   const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
// //   const [editSlot, setEditSlot] = useState<Slot | null>(null);
// //   const [editModalOpen, setEditModalOpen] = useState(false);

// //   const fetchSlots = async () => {
// //     setLoading(true);
// //     try {
// //       const params: Record<string, any> = {};

// //       if (dateRange.startDate) {
// //         params.startDate = formatDate(dateRange.startDate, "yyyy-MM-dd");
// //       }
// //       if (dateRange.endDate) {
// //         params.endDate = formatDate(dateRange.endDate, "yyyy-MM-dd");
// //       }
// //       if (type !== "all") {
// //         params.type = type;
// //       }

// //       const response = await axiosInstance.get("/adminListSlots", { params });
// //       setSlotsByDate(response.data.slotsByDate);
// //     } catch (error) {
// //       console.error("Error fetching slots", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSlots();
// //   }, [type, dateRange]);

// //   const handleDelete = async (id: string) => {
// //     try {
// //       await axiosInstance.delete("/adminDeleteSlot", {
// //         params: { slotId: id },
// //       });
// //       fetchSlots();
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   const handleToggle = async (id: string) => {
// //     try {
// //       await axiosInstance.post(
// //         "/adminToggleSlot",
// //         {},
// //         {
// //           params: {
// //             slotId: id,
// //           },
// //         }
// //       );
// //       fetchSlots();
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {Object.entries(slotsByDate).map(([date, slots]) => {
// //         const pickupSlots = slots.filter((slot) => slot.type === "pickup");
// //         const deliverySlots = slots.filter((slot) => slot.type === "delivery");

// //         return (
// //           <Card key={date}>
// //             <CardHeader>
// //               <CardTitle>{format(new Date(date), "PPP")}</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               {/* Pickup Section */}
// //               {pickupSlots.length > 0 && (
// //                 <div>
// //                   <h3 className="text-lg font-semibold mb-2">Pickup Slots</h3>
// //                   <div className="space-y-2">
// //                     {pickupSlots.map((slot) => (
// //                       <SlotItem
// //                         key={slot.id}
// //                         slot={slot}
// //                         onEdit={() => {
// //                           setEditSlot(slot);
// //                           setEditModalOpen(true);
// //                         }}
// //                         onToggle={() => handleToggle(slot.id)}
// //                         onDelete={() => setSlotToDelete(slot)}
// //                         slotToDelete={slotToDelete}
// //                         handleDelete={handleDelete}
// //                       />
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Delivery Section */}
// //               {deliverySlots.length > 0 && (
// //                 <div>
// //                   <h3 className="text-lg font-semibold mt-4 mb-2">
// //                     Delivery Slots
// //                   </h3>
// //                   <div className="space-y-2">
// //                     {deliverySlots.map((slot) => (
// //                       <SlotItem
// //                         key={slot.id}
// //                         slot={slot}
// //                         onEdit={() => {
// //                           setEditSlot(slot);
// //                           setEditModalOpen(true);
// //                         }}
// //                         onToggle={() => handleToggle(slot.id)}
// //                         onDelete={() => setSlotToDelete(slot)}
// //                         slotToDelete={slotToDelete}
// //                         handleDelete={handleDelete}
// //                       />
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         );
// //       })}

// //       {loading && <div className="text-center">Loading slots...</div>}

// //       <UpdateSlotModal
// //         open={editModalOpen}
// //         onClose={() => setEditModalOpen(false)}
// //         slot={editSlot}
// //         onUpdated={fetchSlots}
// //       />
// //     </div>
// //   );
// // }

// // const SlotItem = ({
// //   slot,
// //   onEdit,
// //   onToggle,
// //   onDelete,
// //   slotToDelete,
// //   handleDelete,
// // }: {
// //   slot: Slot;
// //   onEdit: () => void;
// //   onToggle: () => void;
// //   onDelete: () => void;
// //   slotToDelete: Slot | null;
// //   handleDelete: (id: string) => void;
// // }) => {
// //   return (
// //     <div className="flex justify-between items-center p-2 border rounded-md">
// //       <div className="flex flex-col gap-1">
// //         <span className="font-medium">
// //           {slot.startTime} - {slot.endTime}
// //         </span>
// //         <span className="text-sm text-muted-foreground">
// //           Orders: {slot.currentOrders} / {slot.maxOrders}
// //         </span>
// //       </div>

// //       <div className="flex items-center gap-3">
// //         <Badge variant={slot.active ? "default" : "destructive"}>
// //           {slot.active ? "Active" : "Inactive"}
// //         </Badge>

// //         <Button size="icon" variant="ghost" onClick={onEdit}>
// //           <Pencil className="w-4 h-4" />
// //         </Button>

// //         <Switch checked={slot.active} onCheckedChange={onToggle} />

// //         <AlertDialog>
// //           <AlertDialogTrigger asChild>
// //             <Button size="icon" variant="destructive" onClick={onDelete}>
// //               <Trash2 className="w-4 h-4" />
// //             </Button>
// //           </AlertDialogTrigger>
// //           <AlertDialogContent>
// //             <AlertDialogHeader>
// //               <AlertDialogTitle>
// //                 Are you sure you want to delete this slot?
// //               </AlertDialogTitle>
// //               <AlertDialogDescription>
// //                 This action cannot be undone. It will permanently delete the
// //                 slot scheduled at{" "}
// //                 <strong>
// //                   {slotToDelete?.startTime} - {slotToDelete?.endTime}
// //                 </strong>
// //                 .
// //               </AlertDialogDescription>
// //             </AlertDialogHeader>
// //             <AlertDialogFooter>
// //               <AlertDialogCancel>Cancel</AlertDialogCancel>
// //               <AlertDialogAction
// //                 onClick={() => {
// //                   if (slotToDelete) {
// //                     handleDelete(slotToDelete.id);
// //                   }
// //                 }}
// //               >
// //                 Delete
// //               </AlertDialogAction>
// //             </AlertDialogFooter>
// //           </AlertDialogContent>
// //         </AlertDialog>
// //       </div>
// //     </div>
// //   );
// // };



// // // SlotTable.tsx
// // import React, { useEffect, useState } from "react";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Switch } from "@/components/ui/switch";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog";
// // import { axiosInstance } from "@/api/axios/axiosInstance";
// // import { format, formatDate } from "date-fns";
// // import { Pencil, Trash2 } from "lucide-react";
// // import UpdateSlotModal from "./UpdateSlotModal";

// // interface Slot {
// //   id: string;
// //   type: "pickup" | "delivery";
// //   date: string;
// //   startTime: string;
// //   endTime: string;
// //   maxOrders: number;
// //   currentOrders: number;
// //   active: boolean;
// // }

// // interface SlotTableProps {
// //   type: string;
// //   dateRange: { startDate?: Date; endDate?: Date };
// // }

// // export default function SlotTable({ type, dateRange }: SlotTableProps) {
// //   const [slotsByDate, setSlotsByDate] = useState<Record<string, Slot[]>>({});
// //   const [loading, setLoading] = useState(false);
// //   const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
// //   const [editSlot, setEditSlot] = useState<Slot | null>(null);
// //   const [editModalOpen, setEditModalOpen] = useState(false);

// //   const fetchSlots = async () => {
// //     setLoading(true);
// //     try {
// //       const params: Record<string, any> = {};

// //       if (dateRange.startDate) {
// //         params.startDate = formatDate(dateRange.startDate, "yyyy-MM-dd");
// //       }
// //       if (dateRange.endDate) {
// //         params.endDate = formatDate(dateRange.endDate, "yyyy-MM-dd");
// //       }
// //       if (type !== "all") {
// //         params.type = type;
// //       }

// //       const response = await axiosInstance.get("/adminListSlots", { params });
// //       setSlotsByDate(response.data.slotsByDate);
// //     } catch (error) {
// //       console.error("Error fetching slots", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSlots();
// //   }, [type, dateRange]);

// //   const handleDelete = async (id: string) => {
// //     try {
// //       await axiosInstance.delete("/adminDeleteSlot", {
// //         params: { slotId: id },
// //       });
// //       fetchSlots();
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   const handleToggle = async (id: string) => {
// //     try {
// //       await axiosInstance.post(
// //         "/adminToggleSlot",
// //         {},
// //         { params: { slotId: id } }
// //       );
// //       fetchSlots();
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {loading && <div className="text-center text-muted-foreground">Loading slots...</div>}

// //       {Object.entries(slotsByDate).map(([date, slots]) => {
// //         const pickupSlots = slots.filter((s) => s.type === "pickup");
// //         const deliverySlots = slots.filter((s) => s.type === "delivery");

// //         return (
// //           <Card key={date} className="border shadow-sm">
// //             <CardHeader>
// //               <CardTitle className="text-xl font-semibold text-primary">
// //                 {format(new Date(date), "PPP")}
// //               </CardTitle>
// //             </CardHeader>

// //             <CardContent className="space-y-6">
// //               {pickupSlots.length > 0 && (
// //                 <div>
// //                   <h3 className="text-base font-semibold mb-3">📦 Pickup Slots</h3>
// //                   <div className="space-y-3">
// //                     {pickupSlots.map((slot) => (
// //                       <SlotItem
// //                         key={slot.id}
// //                         slot={slot}
// //                         onEdit={() => {
// //                           setEditSlot(slot);
// //                           setEditModalOpen(true);
// //                         }}
// //                         onToggle={() => handleToggle(slot.id)}
// //                         onDelete={() => setSlotToDelete(slot)}
// //                         slotToDelete={slotToDelete}
// //                         handleDelete={handleDelete}
// //                       />
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {deliverySlots.length > 0 && (
// //                 <div>
// //                   <h3 className="text-base font-semibold mb-3">🚚 Delivery Slots</h3>
// //                   <div className="space-y-3">
// //                     {deliverySlots.map((slot) => (
// //                       <SlotItem
// //                         key={slot.id}
// //                         slot={slot}
// //                         onEdit={() => {
// //                           setEditSlot(slot);
// //                           setEditModalOpen(true);
// //                         }}
// //                         onToggle={() => handleToggle(slot.id)}
// //                         onDelete={() => setSlotToDelete(slot)}
// //                         slotToDelete={slotToDelete}
// //                         handleDelete={handleDelete}
// //                       />
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         );
// //       })}

// //       <UpdateSlotModal
// //         open={editModalOpen}
// //         onClose={() => setEditModalOpen(false)}
// //         slot={editSlot}
// //         onUpdated={fetchSlots}
// //       />
// //     </div>
// //   );
// // }

// // const SlotItem = ({
// //   slot,
// //   onEdit,
// //   onToggle,
// //   onDelete,
// //   slotToDelete,
// //   handleDelete,
// // }: {
// //   slot: Slot;
// //   onEdit: () => void;
// //   onToggle: () => void;
// //   onDelete: () => void;
// //   slotToDelete: Slot | null;
// //   handleDelete: (id: string) => void;
// // }) => {
// //   return (
// //     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-lg bg-muted/40">
// //       <div className="flex flex-col gap-1">
// //         <div className="text-sm font-medium">
// //           🕒 {slot.startTime} - {slot.endTime}
// //         </div>
// //         <div className="text-xs text-muted-foreground">
// //           Orders: {slot.currentOrders} / {slot.maxOrders}
// //         </div>
// //       </div>

// //       <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-auto">
// //         <Badge variant={slot.active ? "default" : "destructive"}>
// //           {slot.active ? "Active" : "Inactive"}
// //         </Badge>

// //         <Switch checked={slot.active} onCheckedChange={onToggle} />

// //         <Button size="icon" variant="ghost" onClick={onEdit}>
// //           <Pencil className="w-4 h-4" />
// //         </Button>

// //         <AlertDialog>
// //           <AlertDialogTrigger asChild>
// //             <Button size="icon" variant="destructive" onClick={onDelete}>
// //               <Trash2 className="w-4 h-4" />
// //             </Button>
// //           </AlertDialogTrigger>
// //           <AlertDialogContent>
// //             <AlertDialogHeader>
// //               <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
// //               <AlertDialogDescription>
// //                 This will permanently delete the slot from{" "}
// //                 <strong>
// //                   {slotToDelete?.startTime} - {slotToDelete?.endTime}
// //                 </strong>
// //                 . This action cannot be undone.
// //               </AlertDialogDescription>
// //             </AlertDialogHeader>
// //             <AlertDialogFooter>
// //               <AlertDialogCancel>Cancel</AlertDialogCancel>
// //               <AlertDialogAction
// //                 onClick={() => {
// //                   if (slotToDelete) handleDelete(slotToDelete.id);
// //                 }}
// //               >
// //                 Delete
// //               </AlertDialogAction>
// //             </AlertDialogFooter>
// //           </AlertDialogContent>
// //         </AlertDialog>
// //       </div>
// //     </div>
// //   );
// // };


// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import { Pencil, Trash2, Clock, Package, Truck, Users, Calendar } from "lucide-react";

// // Helper functions for date formatting
// const formatDate = (date: Date, formatStr: string) => {
//   if (formatStr === "yyyy-MM-dd") {
//     return date.toISOString().split('T')[0];
//   }
//   return date.toLocaleDateString();
// };

// const format = (date: Date, formatStr: string) => {
//   if (formatStr === "EEEE, MMMM do, yyyy") {
//     const options: Intl.DateTimeFormatOptions = { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     };
//     return date.toLocaleDateString('en-US', options);
//   }
//   if (formatStr === "PPP") {
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   }
//   return date.toLocaleDateString();
// };
// import UpdateSlotModal from "./UpdateSlotModal";

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
//   const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
//   const [editSlot, setEditSlot] = useState<Slot | null>(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);

//   const fetchSlots = async () => {
//     setLoading(true);
//     try {
//       const params: Record<string, any> = {};

//       if (dateRange.startDate) {
//         params.startDate = formatDate(dateRange.startDate, "yyyy-MM-dd");
//       }
//       if (dateRange.endDate) {
//         params.endDate = formatDate(dateRange.endDate, "yyyy-MM-dd");
//       }
//       if (type !== "all") {
//         params.type = type;
//       }

//       const response = await axiosInstance.get("/adminListSlots", { params });
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
//       await axiosInstance.delete("/adminDeleteSlot", {
//         params: { slotId: id },
//       });
//       fetchSlots();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleToggle = async (id: string) => {
//     try {
//       await axiosInstance.post(
//         "/adminToggleSlot",
//         {},
//         { params: { slotId: id } }
//       );
//       fetchSlots();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getSlotUtilization = (slot: Slot) => {
//     const percentage = (slot.currentOrders / slot.maxOrders) * 100;
//     return Math.round(percentage);
//   };

//   const getUtilizationColor = (percentage: number) => {
//     if (percentage >= 90) return "bg-red-500";
//     if (percentage >= 70) return "bg-amber-500";
//     if (percentage >= 40) return "bg-blue-500";
//     return "bg-green-500";
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 space-y-4">
//         <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//         <p className="text-slate-600 text-sm font-medium">Loading slots...</p>
//       </div>
//     );
//   }

//   if (Object.keys(slotsByDate).length === 0) {
//     return (
//       <div className="text-center py-16">
//         <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-slate-600 mb-2">No slots found</h3>
//         <p className="text-slate-500">No slots match your current filters.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {Object.entries(slotsByDate).map(([date, slots]) => {
//         const pickupSlots = slots.filter((s) => s.type === "pickup");
//         const deliverySlots = slots.filter((s) => s.type === "delivery");

//         return (
//           <Card key={date} className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4">
//               <div className="flex items-center gap-3">
//                 <Calendar className="w-6 h-6" />
//                 <CardTitle className="text-xl font-bold">
//                   {format(new Date(date), "EEEE, MMMM do, yyyy")}
//                 </CardTitle>
//               </div>
//               <div className="text-blue-100 text-sm font-medium">
//                 {slots.length} slot{slots.length !== 1 ? 's' : ''} scheduled
//               </div>
//             </CardHeader>

//             <CardContent className="p-6 space-y-8">
//               {pickupSlots.length > 0 && (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
//                     <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1.5 rounded-full">
//                       <Package className="w-4 h-4 text-emerald-700" />
//                       <h3 className="text-sm font-bold text-emerald-800">Pickup Slots</h3>
//                     </div>
//                     <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
//                       {pickupSlots.length} available
//                     </span>
//                   </div>
//                   <div className="grid gap-4">
//                     {pickupSlots.map((slot) => (
//                       <SlotItem
//                         key={slot.id}
//                         slot={slot}
//                         onEdit={() => {
//                           setEditSlot(slot);
//                           setEditModalOpen(true);
//                         }}
//                         onToggle={() => handleToggle(slot.id)}
//                         onDelete={() => setSlotToDelete(slot)}
//                         slotToDelete={slotToDelete}
//                         handleDelete={handleDelete}
//                         getSlotUtilization={getSlotUtilization}
//                         getUtilizationColor={getUtilizationColor}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {deliverySlots.length > 0 && (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
//                     <div className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full">
//                       <Truck className="w-4 h-4 text-blue-700" />
//                       <h3 className="text-sm font-bold text-blue-800">Delivery Slots</h3>
//                     </div>
//                     <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
//                       {deliverySlots.length} available
//                     </span>
//                   </div>
//                   <div className="grid gap-4">
//                     {deliverySlots.map((slot) => (
//                       <SlotItem
//                         key={slot.id}
//                         slot={slot}
//                         onEdit={() => {
//                           setEditSlot(slot);
//                           setEditModalOpen(true);
//                         }}
//                         onToggle={() => handleToggle(slot.id)}
//                         onDelete={() => setSlotToDelete(slot)}
//                         slotToDelete={slotToDelete}
//                         handleDelete={handleDelete}
//                         getSlotUtilization={getSlotUtilization}
//                         getUtilizationColor={getUtilizationColor}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         );
//       })}

//       <UpdateSlotModal
//         open={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//         slot={editSlot}
//         onUpdated={fetchSlots}
//       />
//     </div>
//   );
// }

// const SlotItem = ({
//   slot,
//   onEdit,
//   onToggle,
//   onDelete,
//   slotToDelete,
//   handleDelete,
//   getSlotUtilization,
//   getUtilizationColor,
// }: {
//   slot: Slot;
//   onEdit: () => void;
//   onToggle: () => void;
//   onDelete: () => void;
//   slotToDelete: Slot | null;
//   handleDelete: (id: string) => void;
//   getSlotUtilization: (slot: Slot) => number;
//   getUtilizationColor: (percentage: number) => string;
// }) => {
//   const utilization = getSlotUtilization(slot);
//   const utilizationColor = getUtilizationColor(utilization);

//   return (
//     <div className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
//       slot.active 
//         ? 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-blue-100/50' 
//         : 'border-slate-300 bg-slate-50/50 opacity-75'
//     }`}>
//       {/* Status indicator bar */}
//       <div className={`absolute top-0 left-0 right-0 h-1 ${
//         slot.active ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-slate-400'
//       }`} />
      
//       <div className="p-5">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Left side - Time and details */}
//           <div className="flex-1 space-y-3">
//             <div className="flex items-center gap-3">
//               <div className={`p-2 rounded-lg ${slot.active ? 'bg-blue-50' : 'bg-slate-100'}`}>
//                 <Clock className={`w-5 h-5 ${slot.active ? 'text-blue-600' : 'text-slate-500'}`} />
//               </div>
//               <div>
//                 <div className="font-bold text-lg text-slate-800">
//                   {slot.startTime} - {slot.endTime}
//                 </div>
//                 <div className="text-sm text-slate-500 capitalize">
//                   {slot.type} slot
//                 </div>
//               </div>
//             </div>

//             {/* Capacity info */}
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4 text-slate-500" />
//                 <span className="text-sm font-medium text-slate-700">
//                   {slot.currentOrders} / {slot.maxOrders} orders
//                 </span>
//               </div>
              
//               {/* Progress bar */}
//               <div className="flex-1 max-w-32">
//                 <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-full transition-all duration-300 ${utilizationColor}`}
//                     style={{ width: `${utilization}%` }}
//                   />
//                 </div>
//               </div>
              
//               <span className={`text-xs font-bold px-2 py-1 rounded-full ${
//                 utilization >= 90 ? 'bg-red-100 text-red-700' :
//                 utilization >= 70 ? 'bg-amber-100 text-amber-700' :
//                 utilization >= 40 ? 'bg-blue-100 text-blue-700' :
//                 'bg-green-100 text-green-700'
//               }`}>
//                 {utilization}%
//               </span>
//             </div>
//           </div>

//           {/* Right side - Status and actions */}
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-3">
//               <Badge 
//                 variant={slot.active ? "default" : "secondary"}
//                 className={`px-3 py-1 font-medium ${
//                   slot.active 
//                     ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
//                     : 'bg-slate-100 text-slate-600 border-slate-200'
//                 }`}
//               >
//                 {slot.active ? "Active" : "Inactive"}
//               </Badge>

//               <Switch 
//                 checked={slot.active} 
//                 onCheckedChange={onToggle}
//                 className="data-[state=checked]:bg-green-500"
//               />
//             </div>

//             <div className="flex items-center gap-1 ml-2">
//               <Button 
//                 size="sm" 
//                 variant="ghost" 
//                 onClick={onEdit}
//                 className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-700 group-hover:bg-blue-50"
//               >
//                 <Pencil className="w-4 h-4" />
//               </Button>

//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button 
//                     size="sm" 
//                     variant="ghost" 
//                     onClick={onDelete}
//                     className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-700"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent className="max-w-md">
//                   <AlertDialogHeader>
//                     <AlertDialogTitle className="text-red-600">Delete Slot</AlertDialogTitle>
//                     <AlertDialogDescription className="space-y-2">
//                       <p>Are you sure you want to permanently delete this slot?</p>
//                       <div className="p-3 bg-slate-50 rounded-lg border">
//                         <div className="font-medium text-slate-800">
//                           {slotToDelete?.startTime} - {slotToDelete?.endTime}
//                         </div>
//                         <div className="text-sm text-slate-600 capitalize">
//                           {slotToDelete?.type} slot
//                         </div>
//                       </div>
//                       <p className="text-sm text-red-600">This action cannot be undone.</p>
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction
//                       onClick={() => {
//                         if (slotToDelete) handleDelete(slotToDelete.id);
//                       }}
//                       className="bg-red-600 hover:bg-red-700"
//                     >
//                       Delete Slot
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CheckCircle2
} from "lucide-react";

// Helper functions for date formatting
const formatDate = (date: Date, formatStr: string) => {
  if (formatStr === "yyyy-MM-dd") {
    return date.toISOString().split('T')[0];
  }
  return date.toLocaleDateString();
};

const format = (date: Date, formatStr: string) => {
  if (formatStr === "EEEE, MMMM do, yyyy") {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }
  if (formatStr === "PPP") {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  return date.toLocaleDateString();
};

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
      const params: Record<string, any> = {};

      if (dateRange.startDate) {
        params.startDate = formatDate(dateRange.startDate, "yyyy-MM-dd");
      }
      if (dateRange.endDate) {
        params.endDate = formatDate(dateRange.endDate, "yyyy-MM-dd");
      }
      if (type !== "all") {
        params.type = type;
      }

      const response = await axiosInstance.get("/adminListSlots", { params });
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
      await axiosInstance.delete("/adminDeleteSlot", {
        params: { slotId: id },
      });
      fetchSlots();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await axiosInstance.post(
        "/adminToggleSlot",
        {},
        { params: { slotId: id } }
      );
      fetchSlots();
    } catch (error) {
      console.log(error);
    }
  };

  const getSlotUtilization = (slot: Slot) => {
    const percentage = (slot.currentOrders / slot.maxOrders) * 100;
    return Math.round(percentage);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    if (percentage >= 40) return "bg-blue-500";
    return "bg-green-500";
  };

  const getUtilizationStatus = (percentage: number) => {
    if (percentage >= 90) return { color: "text-red-600", icon: AlertCircle, label: "High" };
    if (percentage >= 70) return { color: "text-amber-600", icon: Activity, label: "Medium" };
    if (percentage >= 40) return { color: "text-blue-600", icon: Activity, label: "Low" };
    return { color: "text-green-600", icon: CheckCircle2, label: "Available" };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">Loading slots...</p>
      </div>
    );
  }

  if (Object.keys(slotsByDate).length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No slots found</h3>
        <p className="text-slate-500 max-w-md mx-auto">No slots match your current filters. Try adjusting your date range or slot type.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(slotsByDate).map(([date, slots]) => {
        const pickupSlots = slots.filter((s) => s.type === "pickup");
        const deliverySlots = slots.filter((s) => s.type === "delivery");

        return (
          <Card key={date} className="border border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {format(new Date(date), "EEEE, MMMM do, yyyy")}
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      {slots.length} slot{slots.length !== 1 ? 's' : ''} scheduled
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {pickupSlots.length > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{pickupSlots.length}</div>
                      <div className="text-xs text-emerald-600 uppercase font-medium">Pickup</div>
                    </div>
                  )}
                  {deliverySlots.length > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{deliverySlots.length}</div>
                      <div className="text-xs text-blue-600 uppercase font-medium">Delivery</div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Pickup Slots Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Pickup Slots</h3>
                    {pickupSlots.length > 0 && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {pickupSlots.length}
                      </Badge>
                    )}
                  </div>
                  
                  {pickupSlots.length > 0 ? (
                    <div className="space-y-3">
                      {pickupSlots.map((slot) => (
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
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No pickup slots scheduled</p>
                    </div>
                  )}
                </div>

                {/* Delivery Slots Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Delivery Slots</h3>
                    {deliverySlots.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        {deliverySlots.length}
                      </Badge>
                    )}
                  </div>
                  
                  {deliverySlots.length > 0 ? (
                    <div className="space-y-3">
                      {deliverySlots.map((slot) => (
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
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No delivery slots scheduled</p>
                    </div>
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
        onUpdated={fetchSlots}
      />

      <AlertDialog open={!!slotToDelete} onOpenChange={() => setSlotToDelete(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Delete Slot
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Are you sure you want to permanently delete this slot?</p>
              {slotToDelete && (
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-800">
                      {slotToDelete.startTime} - {slotToDelete.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    {slotToDelete.type === 'pickup' ? (
                      <Package className="w-3 h-3" />
                    ) : (
                      <Truck className="w-3 h-3" />
                    )}
                    <span className="capitalize">{slotToDelete.type} slot</span>
                  </div>
                </div>
              )}
              <p className="text-sm text-red-600 font-medium">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (slotToDelete) {
                  handleDelete(slotToDelete.id);
                  setSlotToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Slot
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
}: {
  slot: Slot;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  getSlotUtilization: (slot: Slot) => number;
  getUtilizationColor: (percentage: number) => string;
  getUtilizationStatus: (percentage: number) => { 
    color: string; 
    icon: React.ComponentType<any>; 
    label: string; 
  };
}) => {
  const utilization = getSlotUtilization(slot);
  const utilizationColor = getUtilizationColor(utilization);
  const status = getUtilizationStatus(utilization);
  const StatusIcon = status.icon;

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
      slot.active 
        ? 'border-slate-200 bg-white hover:border-slate-300' 
        : 'border-slate-200 bg-slate-50 opacity-75'
    }`}>
      {/* Header with time and status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-900">
            {slot.startTime} - {slot.endTime}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch 
            checked={slot.active} 
            onCheckedChange={onToggle}
            size="sm"
            className="data-[state=checked]:bg-green-500"
          />
          <Badge 
            variant={slot.active ? "default" : "secondary"}
            className={`text-xs ${
              slot.active 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {slot.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Capacity section */}
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
        
        {/* Progress bar */}
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
        >
          <Pencil className="w-3 h-3" />
        </Button>
        
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onDelete}
          className="h-8 px-2 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};