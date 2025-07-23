
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Placeholder data for now
const coupons = [
  {
    id: "1",
    code: "WELCOME10",
    discountPercentage: 10,
    validFrom: new Date("2023-05-01"),
    validUntil: new Date("2023-12-31"),
    minOrderValue: 20,
    isActive: true,
    currentUsage: 45,
    maxUsage: 100,
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-15"),
  },
  {
    id: "2",
    code: "SUMMER20",
    discountPercentage: 20,
    validFrom: new Date("2023-06-01"),
    validUntil: new Date("2023-08-31"),
    minOrderValue: 30,
    isActive: true,
    currentUsage: 28,
    maxUsage: 200,
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-20"),
  },
];

export function CouponsTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Min Order</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No coupons found
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>{coupon.discountPercentage}%</TableCell>
                <TableCell>
                  {format(coupon.validUntil, "MMM dd, yyyy")}
                </TableCell>
                <TableCell>${coupon.minOrderValue}</TableCell>
                <TableCell>
                  {coupon.currentUsage}/{coupon.maxUsage}
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.isActive ? "secondary" : "destructive"} className={coupon.isActive ? "bg-green-600 hover:bg-green-700" : ""}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
