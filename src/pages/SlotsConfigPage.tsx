// import React from 'react'
// import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
// export default function SlotsConfigPage() {
//   return (
//     <DashboardLayout>
//         <div>Dashboard config page</div>
//     </DashboardLayout>
//   )
// }


// File: pages/SlotsConfigPage.tsx

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDateRangePicker } from '@/components/date-range-picker'
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select'
import { Plus, RefreshCw } from 'lucide-react'
import  SlotTable  from '@/components/slots/SlotTable'
import SlotFormModal from '@/components/slots/SlotFormModal'

export default function SlotsConfigPage() {
  const [typeFilter, setTypeFilter] = useState<'pickup' | 'delivery' | 'all'>('all')
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({})
  const [showModal, setShowModal] = useState(false)
  console.log("dateRange",dateRange);

  const handleAddSlot = () => setShowModal(true);

  // useEffect(()=>{
    
  // },[dateRange,typeFilter,setDateRange,setTypeFilter])

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Slot Configuration</CardTitle>
            <div className="flex items-center gap-4 flex-wrap">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>

              <CalendarDateRangePicker value={dateRange} onChange={setDateRange} />

              <Button onClick={handleAddSlot}>
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>

              {/* <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button> */}
            </div>
          </CardHeader>
        </Card>

        <SlotTable type={typeFilter} dateRange={dateRange} />
        <SlotFormModal open={showModal} onClose={() => setShowModal(false)} />
      </div>
    </DashboardLayout>
  )
}
