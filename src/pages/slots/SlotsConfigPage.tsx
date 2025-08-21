import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import SlotTable from "@/pages/slots/SlotTable";
import SlotFormModal from "@/pages/slots/SlotFormModal";

export default function SlotsConfigPage() {
  const [typeFilter, setTypeFilter] = useState<"pickup" | "delivery" | "all">(
    "all"
  );
  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  const [showModal, setShowModal] = useState(false);
  // console.log("dateRange",dateRange);

  const handleAddSlot = () => setShowModal(true);

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        <div className="flex flex-row justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Slot Configuration
            </h2>
            <br />
            <p className="text-muted-foreground">Configure your slots.</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* <CardTitle>Slot Configuration</CardTitle> */}
            <div className="flex items-center gap-4 flex-wrap">
              <Select
                value={typeFilter}
                // onValueChange={(value) => setTypeFilter(value as any)}
                onValueChange={(value: "pickup" | "delivery" | "all") =>
                  setTypeFilter(value)
                } 
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>

              <CalendarDateRangePicker
                value={dateRange}
                onChange={setDateRange}
              /> 


              {(dateRange?.startDate || dateRange?.endDate) && (
                <Button
                  variant="outline"
                  onClick={() => setDateRange({})}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </Button>
              )}

              <Button className="fixed bottom-6 right-6 rounded-full shadow-lg px-5 py-5 z-50" onClick={handleAddSlot}>
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </div>
        </div>
        <br />

        <SlotTable type={typeFilter} dateRange={dateRange} />
        <SlotFormModal open={showModal} onClose={() => setShowModal(false)} />
      </div>
    </DashboardLayout>
  );
}
