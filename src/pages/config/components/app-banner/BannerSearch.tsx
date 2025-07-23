
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BannerSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BannerSearch({ searchQuery, onSearchChange }: BannerSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search banners..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 md:max-w-sm"
      />
    </div>
  );
}
