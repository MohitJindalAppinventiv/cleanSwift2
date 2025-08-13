import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SlotTableSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card
          key={i}
          className="rounded-lg shadow-sm"
        >
          <CardHeader className="bg-white border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {["Pickup Slots", "Delivery Slots"].map((section, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  {Array.from({ length: 2 }).map((_, slotIdx) => (
                    <div
                      key={slotIdx}
                      className="border rounded-lg p-4 mb-3"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
