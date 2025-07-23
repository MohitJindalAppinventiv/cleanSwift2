
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockCustomers, statusStyles } from "@/components/customers/types";
import { mockOrders } from "@/components/dashboard/orders/types";
import { OrderStatusBadge } from "@/components/dashboard/orders/OrderStatusBadge";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("details");
  
  // Find the customer by ID
  const customer = mockCustomers.find((c) => c.id === id);
  
  // Find orders for this customer
  const customerOrders = mockOrders.filter((order) => 
    order.customer === customer?.name
  );
  
  if (!customer) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Customer not found</h2>
          <p>The customer you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
          <Badge 
            variant="outline" 
            className={`${statusStyles[customer.status]}`}
          >
            {customer.status}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-semibold">{customer.name}</h3>
                  <p className="text-muted-foreground">{customer.email}</p>
                  <p className="text-muted-foreground">{customer.phone}</p>
                </div>
              </div>
              
              <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-6 mt-6 md:mt-0 md:ml-auto`}>
                <div className="text-center p-4 bg-slate-50 rounded-md">
                  <h4 className="text-lg font-semibold">{customer.orders}</h4>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-md">
                  <h4 className="text-lg font-semibold">${customer.spent.toFixed(2)}</h4>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-md">
                  <h4 className="text-lg font-semibold">{customer.lastOrder}</h4>
                  <p className="text-sm text-muted-foreground">Last Order</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details">Personal Details</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                    <dd className="mt-1 text-sm">{customer.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email Address</dt>
                    <dd className="mt-1 text-sm">{customer.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Phone Number</dt>
                    <dd className="mt-1 text-sm">{customer.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Customer ID</dt>
                    <dd className="mt-1 text-sm">{customer.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="mt-1 text-sm">
                      <Badge variant="outline" className={`${statusStyles[customer.status]}`}>
                        {customer.status}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Customer Since</dt>
                    <dd className="mt-1 text-sm">May 2023</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {customerOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No orders found for this customer.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDetailsPage;
