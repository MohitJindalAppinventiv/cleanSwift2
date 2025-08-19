
import { Button } from "@/components/ui/button";
import { BannerSearch } from "./BannerSearch";
import { Link } from "react-router-dom";

interface BannerHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BannerHeader({ searchQuery, onSearchChange }: BannerHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4  sm:flex-row sm:items-center">
      <h2 className="text-3xl font-bold tracking-tight">App Banners</h2>
      <div className="ml-auto flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2">
        <BannerSearch
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <Button asChild className="sm:ml-2">
          <Link to="/config/app-banner/create">Create Banner</Link>
        </Button>
      </div>
    </div>
  );
}