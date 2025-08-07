import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { CustomersHeader } from "@/components/customers/CustomersHeader";
import { getAllUsers } from "@/api/customers/index";
import { Customer } from "@/components/customers/types";
import { Button } from "@/components/ui/button";

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const isMobile = useIsMobile();
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers({ search: searchQuery, page, limit: 10,status });
      console.log("data in customers",data)
      setCustomers(data.profiles);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, page, status]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CustomersHeader />
                  <div className="flex gap-2 items-center">
            <Button
              variant={status === "all" ? "default" : "outline"}
              onClick={() => {
                setStatus("all");
                setPage(1);
              }}
            >
              All
            </Button>
            <Button
              variant={status === "active" ? "default" : "outline"}
              onClick={() => {
                setStatus("active");
                setPage(1);
              }}
            >
              Active
            </Button>
            <Button
              variant={status === "inactive" ? "default" : "outline"}
              onClick={() => {
                setStatus("inactive");
                setPage(1);
              }}
            >
              Inactive
            </Button>
          </div>
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
        {loading ? (
          <div className="text-muted-foreground">Loading users...</div>
        ) : (
          <CustomersTable customers={customers} fetchData={fetchUsers} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
