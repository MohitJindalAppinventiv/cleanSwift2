import { useState, useEffect } from "react";
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
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Service } from "../types";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

interface ServiceTableProps {
  services: Service[];
  fetchServices: () => Promise<void>;
}

export function ServiceTable({ services, fetchServices }: ServiceTableProps) {
  const navigate = useNavigate();
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [localServices, setLocalServices] = useState<Service[]>(services);

  // Sync localServices when services prop changes
  useEffect(() => {
    setLocalServices(services);
  }, [services]);

  const handleEditService = (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation(); // Prevent row click event
    navigate(`/config/services/edit/${serviceId}`);
  };

  const handleServiceClick = (service: Service) => {
    try {
      if (service.pricingmodel === "per_kg") {
        // Go directly to product page for per_kg pricing
        navigate(`/config/products/${service.id}`);
      } else {
        // Go to category page for per_item pricing
        navigate(`/config/categories/${service.id}`);
      }
    } catch (err) {
      console.error("Error navigating:", err);
    }
  };

  const onDelete = async (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation(); // Prevent row click event
    try {
      setDeletingServiceId(serviceId); // Set the deleting state
      await axios.delete(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/deleteService",
        {
          params: { serviceId },
        }
      );
      toast({
        title: "Success",
        description: "Service deleted successfully",
        variant: "default",
      });
      await fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    } finally {
      setDeletingServiceId(null); // Reset the deleting state
    }
  };

  const toggleServiceStatus = async (e: React.MouseEvent, serviceId: string, currentStatus: "active" | "inactive") => {
    e.stopPropagation(); // Prevent row click event
    const newStatus: "active" | "inactive" = currentStatus === "active" ? "inactive" : "active";

    try {
      setUpdatingStatus(serviceId);

      // Call the API to update the service status
      await axios.patch(
        `https://us-central1-laundry-app-dee6a.cloudfunctions.net/changeStatusOfService?serviceId=${serviceId}`
      );
      setLocalServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceId ? { ...service, status: newStatus } : service
        )
      );
      toast({
        title: "Success",
        description: `Service marked as ${newStatus}`,
        variant: "default",
      });
    } catch (error) {
      // Revert optimistic update on error
      setLocalServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceId ? { ...service, status: currentStatus } : service
        )
      );
      console.error("Error updating service status:", error);
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pricing Model</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localServices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No services found.
              </TableCell>
            </TableRow>
          ) : (
            localServices.map((service) => (
              <TableRow
                key={service.id}
                onMouseEnter={() => setHoveredRowId(service.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                onClick={() => handleServiceClick(service)}
              >
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
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      service.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{service.pricingmodel || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Status Toggle Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => toggleServiceStatus(e, service.id, service.status)}
                      disabled={updatingStatus === service.id}
                      aria-label={
                        service.status === "active" ? "Deactivate service" : "Activate service"
                      }
                      type="button"
                    >
                      {updatingStatus === service.id ? (
                        <span className="animate-spin">↻</span>
                      ) : service.status === "active" ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>

                    {/* Edit Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEditService(e, service.id)}
                      aria-label="Edit service"
                      type="button"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => onDelete(e, service.id)}
                      disabled={deletingServiceId === service.id || updatingStatus === service.id}
                      aria-label="Delete service"
                      type="button"
                    >
                      {deletingServiceId === service.id ? (
                        <span className="animate-spin">↻</span>
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
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