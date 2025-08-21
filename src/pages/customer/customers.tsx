// import { useEffect, useState } from "react";
// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import { CustomersTable } from "@/pages/customer/CustomersTable";
// import { CustomersHeader } from "@/pages/customer/CustomersHeader";
// import { getAllUsers } from "@/api/customers/index";
// import { Customer } from "@/components/customers/types";
// import { Button } from "@/components/ui/button";
// import { CustomersTableSkeleton } from "@/pages/customer/CustomerTableSkeleton";


// const CustomersPage = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllUsers({
//         search: searchQuery,
//         page,
//         limit: 10,
//         status,
//       });
//       console.log("data in customers", data);
//       setCustomers(data.profiles);
//       setPage(data.pagination.currentPage);
//       setTotalPages(data.pagination.totalPages);
//       console.log(totalPages);
//     } catch (err) {
//       console.error("Failed to fetch users", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [searchQuery, page, status]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [page]);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setPage(1); // Reset to page 1 on new search
//   };
//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <CustomersHeader />
//         <div className="flex gap-2 items-center">
//           <Button
//             variant={status === "all" ? "default" : "outline"}
//             onClick={() => {
//               setStatus("all");
//               setPage(1);
//             }}
//           >
//             All
//           </Button>
//           <Button
//             variant={status === "active" ? "default" : "outline"}
//             onClick={() => {
//               setStatus("active");
//               setPage(1);
//             }}
//           >
//             Active
//           </Button>
//           <Button
//             variant={status === "inactive" ? "default" : "outline"}
//             onClick={() => {
//               setStatus("inactive");
//               setPage(1);
//             }}
//           >
//             Inactive
//           </Button>
//         </div>
//         <div className="relative max-w-sm">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search customers..."
//             className="pl-8 w-[300px]"
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </div>
//         {loading ? (
//           // <div className="text-muted-foreground">Loading users...</div>
//           // <TableRowSkeleton/>
//           <CustomersTableSkeleton />
//         ) : (
//           // <CustomersTable  totalPages={totalPages} customers={customers} fetchData={fetchUsers} />
//           <CustomersTable
//             customers={customers}
//             totalPages={totalPages}
//             page={page}
//             setPage={setPage}
//             fetchData={fetchUsers}
//           />
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default CustomersPage;


import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CustomersTable } from "@/pages/customer/CustomersTable";
import { CustomersHeader } from "@/pages/customer/CustomersHeader";
import { getAllUsers } from "@/api/customers/index";
import { Customer } from "@/components/customers/types";
import { Button } from "@/components/ui/button";
import { CustomersTableSkeleton } from "@/pages/customer/CustomerTableSkeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Added limit state
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const fetchUsers = async (pageNum: number = page, limitNum: number = limit) => {
    try {
      setLoading(true);
      const data = await getAllUsers({
        search: searchQuery,
        page: pageNum,
        limit: limitNum,
        status,
      });
      console.log("data in customers", data);
      setCustomers(data.profiles);
      setPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      console.log(totalPages);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, status]); // Removed page and limit from dependencies

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
        {/* <div className="flex gap-2 items-center">
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
        </div> */}

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

  {/* Right side (search + rows per page) */}
  <div className="flex items-center justify-between gap-4">
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search customers..."
        className="pl-8 w-[300px]"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>

    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">Rows per page:</span>
      <Select
        value={limit.toString()}
        onValueChange={(newLimit) => {
          const limitValue = parseInt(newLimit, 10);
          setLimit(limitValue);
          setPage(1);
          fetchUsers(1, limitValue);
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder={limit} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="15">15</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
        {loading ? (
          <CustomersTableSkeleton />
        ) : (
          <CustomersTable
            customers={customers}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            fetchData={fetchUsers}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;