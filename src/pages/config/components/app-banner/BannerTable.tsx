
import { useState } from "react";
import { AppBanner } from "../../types/banner";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface BannerTableProps {
  banners: AppBanner[];
  onEdit: (banner: AppBanner) => void;
  onDelete: (bannerId: string) => void;
}

export function BannerTable({ banners, onEdit, onDelete }: BannerTableProps) {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  return (
    <div className="w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No banners found.
              </TableCell>
            </TableRow>
          ) : (
            banners.map((banner) => (
              <TableRow
                key={banner.id}
                onMouseEnter={() => setHoveredRowId(banner.id)}
                onMouseLeave={() => setHoveredRowId(null)}
              >
                <TableCell className="font-medium">{banner.title}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {banner.description}
                </TableCell>
                <TableCell>
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-10 w-16 rounded object-cover"
                  />
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      banner.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {format(banner.createdAt, "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(banner)}
                      aria-label="Edit banner"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(banner.id)}
                      aria-label="Delete banner"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
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
