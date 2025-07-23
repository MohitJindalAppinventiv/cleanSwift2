
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Service } from "../types";

interface ServiceTableProps {
  services: Service[];
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services }) => {
  const navigate = useNavigate();

  const handleEditService = (serviceId: string) => {
    navigate(`/config/services/edit/${serviceId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Thumbnail</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">{service.name}</TableCell>
            <TableCell>
              {service.thumbnail && (
                <img 
                  src={service.thumbnail} 
                  alt={service.name}
                  className="w-16 h-12 object-cover rounded"
                />
              )}
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {service.description}
            </TableCell>
            <TableCell>
              <Badge
                variant={service.status === "active" ? "default" : "secondary"}
                className={
                  service.status === "active"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 hover:bg-gray-500"
                }
              >
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditService(service.id)}
                className="flex items-center gap-1"
              >
                <Edit size={16} />
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServiceTable;
