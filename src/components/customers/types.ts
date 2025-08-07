
export interface Customer {
  id: string;
  readableUserId: string;
  fullName: string;
  phoneNumber: string;
  alternateNumber: string | null;
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  deletedByAdmin: boolean;
}

export const mockCustomers: Customer[] = [
  {
    id: "C1001",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    phone: "555-123-4567",
    orders: 12,
    spent: 345.67,
    status: "active",
    lastOrder: "2023-05-15",
  },
  {
    id: "C1002",
    name: "Michael Smith",
    email: "michael.s@example.com",
    phone: "555-987-6543",
    orders: 5,
    spent: 189.99,
    status: "active",
    lastOrder: "2023-05-10",
  },
  {
    id: "C1003",
    name: "Sophia Garcia",
    email: "sophia.g@example.com",
    phone: "555-456-7890",
    orders: 1,
    spent: 42.50,
    status: "new",
    lastOrder: "2023-05-18",
  },
  {
    id: "C1004",
    name: "William Brown",
    email: "william.b@example.com",
    phone: "555-234-5678",
    orders: 0,
    spent: 0,
    status: "inactive",
    lastOrder: "N/A",
  },
  {
    id: "C1005",
    name: "Olivia Davis",
    email: "olivia.d@example.com",
    phone: "555-345-6789",
    orders: 8,
    spent: 267.25,
    status: "active",
    lastOrder: "2023-05-12",
  },
];

export const statusStyles = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  new: "bg-blue-100 text-blue-800",
};
