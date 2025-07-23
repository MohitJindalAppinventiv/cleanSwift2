import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            <p className="text-muted-foreground">
              View and manage all customer orders
            </p>
          </div>
          <Button asChild>
            <Link to="/order/create">
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:flex md:items-center md:justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or order ID..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New Order</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pickup">Out for Pickup</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="wash_fold">Wash & Fold</SelectItem>
                <SelectItem value="dry_clean">Dry Clean</SelectItem>
                <SelectItem value="express">Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <OrdersTable 
          searchQuery={searchQuery} 
          statusFilter={statusFilter}
          serviceFilter={serviceFilter}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
