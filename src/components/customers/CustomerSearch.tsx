
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerSearch = ({ searchQuery, onSearchChange }: CustomerSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search customers..."
        className="pl-8"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};
