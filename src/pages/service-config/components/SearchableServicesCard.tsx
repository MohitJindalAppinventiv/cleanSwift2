
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceTable from "./ServiceTable";
import SearchBar from "./SearchBar";
import { Service } from "../types";

interface SearchableServicesCardProps {
  filteredServices: Service[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchableServicesCard: React.FC<SearchableServicesCardProps> = ({ 
  filteredServices, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Services</CardTitle>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </CardHeader>
      <CardContent>
        <ServiceTable services={filteredServices} />
        {filteredServices.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No services found. Please try a different search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchableServicesCard;
