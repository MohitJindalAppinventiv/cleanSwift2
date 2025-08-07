// File: components/slots/SlotTable.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { axiosInstance } from '@/api/axios/axiosInstance';
import API from '@/api/endpoints/slot';
import { format } from 'date-fns';
import { Pencil, Trash2, Ban } from 'lucide-react';

interface Slot {
  id: string;
  type: 'pickup' | 'delivery';
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
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/adminListSlots",
            {
                params:{

                    type:`${type}`,
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
        //   type: type === 'all' ? undefined : type,
        //   startDate: dateRange.startDate?.toISOString().split('T')[0],
        //   endDate: dateRange.endDate?.toISOString().split('T')[0],
        }
    );
        console.log("Slots get response",response);
        setSlotsByDate(response.data.slotsByDate);
      } catch (error) {
        console.error('Error fetching slots', error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchSlots();
  }, [type, dateRange]);

  const handleDelete=async (id:string)=>{
    try {
        const response = await axiosInstance.post("/adminDeleteSlot",{
        
                slotId:id,
            
        })
        console.log("Slot deleted response",response);
        fetchSlots();
    } catch (error) {
        console.log(error);
    }
  }

    const handleInactive=async (id:string)=>{
    try {
        const response = await axiosInstance.post("/adminInactivateSlot",{
                slotId:id,
            
        })
        console.log("Slot Inactive response",response);
        fetchSlots();
        
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="space-y-4">
      {Object.entries(slotsByDate).map(([date, slots]) => (
        <Card key={date}>
          <CardHeader>
            <CardTitle>{format(new Date(date), 'PPP')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {slots.map((slot) => (
              <div key={slot.id} className="flex justify-between items-center p-2 border rounded-md">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {slot.startTime} - {slot.endTime} ({slot.type})
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Orders: {slot.currentOrders} / {slot.maxOrders}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={slot.active ? 'default' : 'destructive'}>
                    {slot.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button size="icon" variant="ghost">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button onClick={()=>handleInactive(slot.id)} size="icon" variant="ghost">
                    <Ban className="w-4 h-4" />
                  </Button>
                  <Button onClick={()=>handleDelete(slot.id)} size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      {loading && <div className="text-center">Loading slots...</div>}
    </div>
  );
}