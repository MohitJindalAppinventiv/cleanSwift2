
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input"; 
import { Search } from "lucide-react";
import { CustomerSearch } from "@/components/customers/CustomerSearch";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { CustomersHeader } from "@/components/customers/CustomersHeader";
import { CustomersMobileHeader } from "@/components/customers/CustomersMobileHeader";
import { mockCustomers } from "@/components/customers/types";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isMobile) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <CustomersMobileHeader />
          <CustomerSearch 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
          />
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CustomersHeader />
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 w-[300px]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <CustomersTable customers={filteredCustomers} />
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
