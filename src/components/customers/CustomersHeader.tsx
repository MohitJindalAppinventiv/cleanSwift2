
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CustomersHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">
          Manage your customer database
        </p>
      </div>
      <Button asChild>
        <Link to="/customers/create">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Link>
      </Button>
    </div>
  );
};
