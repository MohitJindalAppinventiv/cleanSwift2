
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  status: "active" | "new" | "loyal";
  avatarUrl?: string;
}

const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    orderCount: 12,
    status: "loyal",
  },
  {
    id: "C002",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    orderCount: 5,
    status: "active",
  },
  {
    id: "C003",
    name: "Robert Smith",
    email: "robert.s@example.com",
    orderCount: 2,
    status: "new",
  },
  {
    id: "C004",
    name: "Emily Chen",
    email: "emily.c@example.com",
    orderCount: 8,
    status: "active",
  },
];

const statusStyles = {
  active: "bg-blue-100 text-blue-800",
  new: "bg-green-100 text-green-800",
  loyal: "bg-purple-100 text-purple-800",
};

export function RecentCustomers() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Customers</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCustomers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={customer.avatarUrl} />
                  <AvatarFallback>
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {customer.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {customer.orderCount} orders
                </div>
                <Badge
                  variant="outline"
                  className={`${statusStyles[customer.status]}`}
                >
                  {customer.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
