
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CustomersHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      <p className="text-gray-500 text-sm">Manage your customer database</p>
    </div>
    </div>
  );
};
