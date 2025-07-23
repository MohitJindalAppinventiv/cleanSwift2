
import React from "react";
import { Card } from "@/components/ui/card";
import { CouponsHeader } from "./CouponsHeader";
import { CouponsTable } from "./CouponsTable";

export function CouponsConfigManager() {
  return (
    <div className="space-y-4">
      <CouponsHeader />
      <Card>
        <CouponsTable />
      </Card>
    </div>
  );
}
