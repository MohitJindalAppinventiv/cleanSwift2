
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Customer, statusStyles } from "./types";
import { Link } from "react-router-dom";

interface CustomersTableProps {
  customers: Customer[];
}

export const CustomersTable = ({ customers }: CustomersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Order</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.id}</TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>
              <div>{customer.email}</div>
              <div className="text-sm text-muted-foreground">
                {customer.phone}
              </div>
            </TableCell>
            <TableCell>{customer.orders}</TableCell>
            <TableCell>${customer.spent.toFixed(2)}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`${statusStyles[customer.status]}`}
              >
                {customer.status}
              </Badge>
            </TableCell>
            <TableCell>{customer.lastOrder}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/customer-details/${customer.id}`}>View</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
