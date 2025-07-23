
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CustomersMobileHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      <Button size="icon" asChild>
        <Link to="/customers/create">
          <UserPlus size={18} />
        </Link>
      </Button>
    </div>
  );
};
