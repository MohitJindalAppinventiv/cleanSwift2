import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, X, Scale, Package } from "lucide-react";
import { Service } from "../types";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    serviceId: string | null;
  }>({ open: false, serviceId: null });
  const [filter, setFilter] = useState<"all" | "per_kg" | "per_item">("all");

  useEffect(() => {
    setLocalServices(services);
  }, [services]);

  const handleEditService = (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    navigate(`/config/services/edit/${serviceId}`);
  };

  const handleServiceClick = (service: Service) => {
    try {
      if (service.pricingmodel === "per_kg") {
        navigate(`/config/products/${service.id}`, {
          state: { idType: 'service' }
        });
      } else {
        navigate(`/config/categories/${service.id}`);
      }
    } catch (err) {
      console.error("Error navigating:", err);
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      setDeletingServiceId(serviceId);
      await axios.delete(
        "https://us-central1-laundry-app-dee6a.cloudfunctions.net/deleteService",
        { params: { serviceId } }
      );
      toast({ title: "Success", description: "Service deleted successfully" });
      await fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    } finally {
      setDeletingServiceId(null);
      setConfirmDialog({ open: false, serviceId: null });
    }
  };

  const toggleServiceStatus = async (
    e: React.MouseEvent | React.ChangeEvent,
    serviceId: string,
    currentStatus: "active" | "inactive"
  ) => {
    e.stopPropagation();
    const newStatus: "active" | "inactive" = currentStatus === "active" ? "inactive" : "active";

    try {
      setUpdatingStatus(serviceId);
      await axios.patch(
        `https://us-central1-laundry-app-dee6a.cloudfunctions.net/changeStatusOfService?serviceId=${serviceId}`
      );
      setLocalServices((prev) =>
        prev.map((service) =>
          service.id === serviceId ? { ...service, status: newStatus } : service
        )
      );
      toast({
        title: "Success",
        description: `Service marked as ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating service status:", error);
      toast({ title: "Error", description: "Failed to update service status", variant: "destructive" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    setSelectedImage(imageUrl);
  };

  const filteredServices = localServices.filter(service => {
    if (filter === "all") return true;
    if (filter === "per_kg") return service.pricingmodel === "per_kg";
    if (filter === "per_item") return service.pricingmodel !== "per_kg";
    return true;
  });

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={() => setConfirmDialog({ open: false, serviceId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <p>Are you sure you want to delete this service? This action cannot be undone.</p>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, serviceId: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDialog.serviceId) {
                  deleteService(confirmDialog.serviceId);
                }
              }}
            >
              {deletingServiceId === confirmDialog.serviceId ? (
                <span className="animate-spin">↻</span>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 -right-2 h-8 w-8 bg-white/90 hover:bg-white text-black hover:text-red-500 transition-colors rounded-full shadow-lg z-10"
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={selectedImage}
              alt="Service preview"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Service Cards Grid */}
      <div className="w-full">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="px-6"
          >
            All Services
          </Button>
          <Button
            variant={filter === "per_kg" ? "default" : "outline"}
            onClick={() => setFilter("per_kg")}
            className="px-6"
          >
            Per KG
          </Button>
          <Button
            variant={filter === "per_item" ? "default" : "outline"}
            onClick={() => setFilter("per_item")}
            className="px-6"
          >
            Per Item
          </Button>
        </div>

        {filteredServices.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-center">
            <p className="text-gray-500 text-lg">No services found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredRowId(service.id)}
                onMouseLeave={() => setHoveredRowId(null)}
              >
                {/* Service Image */}
                <div className="relative group">
                  {service.thumbnail ? (
                    <>
                      <img
                        src={service.thumbnail}
                        alt={service.name}
                        className="w-full h-40 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={(e) => handleImageClick(e, service.thumbnail)}
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg cursor-pointer"
                           onClick={(e) => handleImageClick(e, service.thumbnail)}>
                        <span className="text-white text-sm font-medium px-3 py-1 bg-black/30 rounded-md">
                          Click to view
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        service.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 cursor-pointer" onClick={() => handleServiceClick(service)}>
                  {/* Service Name */}
                  <h3 className="font-semibold text-lg mb-2 truncate" title={service.name}>
                    {service.name}
                  </h3>

                  {/* Service Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]" title={service.description}>
                    {service.description}
                  </p>
                </div>

                {/* Actions Section - Non-clickable */}
                <div className="px-4 pb-4">
                  {/* Actions */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Active</span>
                      <Switch
                        checked={service.status === "active"}
                        onClick={(e) => toggleServiceStatus(e, service.id, service.status)}
                        disabled={updatingStatus === service.id}
                      />
                    </div>

                    {/* Edit and Delete Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEditService(e, service.id)}
                        aria-label="Edit service"
                        type="button"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDialog({ open: true, serviceId: service.id });
                        }}
                        disabled={deletingServiceId === service.id || updatingStatus === service.id}
                        aria-label="Delete service"
                        type="button"
                        className="h-8 w-8 p-0 text-black hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Pricing Model Button */}
                  <div className="w-full">
                    <Button
                      variant="outline"
                      className={`w-full h-9 text-sm font-semibold border-2 transition-colors cursor-pointer ${
                        service.pricingmodel === "per_kg" 
                          ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" 
                          : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                      }`}
                      onClick={() => handleServiceClick(service)}
                    >
                      <div className="flex items-center gap-2">
                        {service.pricingmodel === "per_kg" ? (
                          <Scale className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                        {service.pricingmodel === "per_kg" ? "Per KG" : "Per Item"}
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}