
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Customer, statusStyles } from "./types";
import { Link } from "react-router-dom";

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <Card key={customer.id} className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {customer.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold">{customer.fullName}</h4>
            <p className="text-sm text-muted-foreground">
              {customer?.email}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${statusStyles[customer?.isActive]}`}
        >
          {customer.isActive}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">Phone:</p>
          <p>{customer.phoneNumber}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Orders:</p>
          <p>{customer.orders}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Spent:</p>
          <p>${customer.spent.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Last Order:</p>
          <p>{customer.lastOrder}</p>
        </div>
      </div>
      <div className="mt-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/customer-details/${customer.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
};
