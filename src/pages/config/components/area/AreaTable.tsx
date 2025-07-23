
import React from "react";
import { Eye, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Area } from "../../types/area";

interface AreaTableProps {
  areas: Area[];
  filter: "all" | "active" | "inactive";
}

export function AreaTable({ areas, filter }: AreaTableProps) {
  return (
    <div className="border rounded-md mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Postal Codes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No areas found
              </TableCell>
            </TableRow>
          ) : (
            areas.map((area) => (
              <TableRow key={area.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {area.name}
                  </div>
                </TableCell>
                <TableCell>{area.city}</TableCell>
                <TableCell>{area.postalCodes.join(", ")}</TableCell>
                <TableCell>
                  {area.isActive ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-red-100 text-red-800">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
