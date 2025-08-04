
import { Button } from "@/components/ui/button";
import { BannerSearch } from "./BannerSearch";
import { Link } from "react-router-dom";

interface BannerHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BannerHeader({ searchQuery, onSearchChange }: BannerHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">App Banners</h1>
        <p className="text-sm text-muted-foreground">
          Manage promotional banners that appear in your app
        </p>
      </div>
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
      