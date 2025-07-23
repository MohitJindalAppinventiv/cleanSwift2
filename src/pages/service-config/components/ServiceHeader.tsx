
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

interface ServiceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Service Management</h1>
      <Button className="flex items-center gap-2" asChild>
        <Link to="/config/services/create">
          <Plus size={16} />
          Add New Service
        </Link>
      </Button>
    </div>
  );
};

export default ServiceHeader;
