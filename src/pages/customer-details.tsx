import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockOrders } from "@/components/dashboard/orders/types";
import { OrderStatusBadge } from "@/components/dashboard/orders/OrderStatusBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { useNavigate } from "react-router-dom";

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  console.log("id: ", id);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("details");

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate=useNavigate();

  // 🟡 Replace with real order API later
  const customerOrders = mockOrders.filter(
    (order) => order.customer === customer?.fullName
  );

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get(`/getUserProfileById`, {
          params: {
            userId: `${id}`,
          },
        }); // <-- Adjust URL to your backend
        console.log("customer details", res);
        setCustomer(res.data.data);
      } catch (err: any) {
        setError("Failed to load customer details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading customer details...</div>
      </DashboardLayout>
    );
  }

  if (error || !customer) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error || "Customer not found"}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    
    <DashboardLayout>
      <div className="space-y-6">
        {/* <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Customer Details
          </h2>
          <Badge variant="outline" className="text-green-600 border-green-600">
            {customer.isActive ? "Active" : "Inactive"}
          </Badge>
        </div> */}

        <div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    <button
      onClick={() => navigate("/customers")}
      className="text-sm px-4 py-2 border rounded-md hover:bg-gray-100 transition"
    >
      ← Back
    </button>
    <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
  </div>
  <Badge variant="outline" className="text-green-600 border-green-600">
    {customer.isActive ? "Active" : "Inactive"}
  </Badge>
</div>


        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4">
                {/* <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl">
                    {customer.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar> */}
                <Avatar className="h-20 w-20">
                  {customer.profilePictureUrl && (
                    <AvatarImage
                      src={customer.profilePictureUrl}
                      alt={customer.fullName}
                    />
                  )}
                  <AvatarFallback className="text-xl">
                    {customer.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {/* <img src={customer.profileImageUrl} /> */}
                <div>
                  <h3 className="text-2xl font-semibold">
                    {customer.fullName}
                  </h3>
                  <p className="text-muted-foreground">
                    {customer.phoneNumber}
                  </p>
                  <p className="text-muted-foreground">
                    {customer.alternateNumber}
                  </p>
                </div>
              </div>

              <div
                className={`grid ${
                  isMobile ? "grid-cols-2" : "grid-cols-3"
                } gap-6 mt-6 md:mt-0 md:ml-auto`}
              >
                <div className="text-center p-4 bg-slate-50 rounded-md">
                  <h4 className="text-lg font-semibold">
                    {customerOrders.length}
                  </h4>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-md">
                  <h4 className="text-lg font-semibold">$120.50</h4>{" "}
                  {/* demo total */}
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-md">
                  <h4 className="text-lg font-semibold">July 2024</h4>{" "}
                  {/* demo last order */}
                  <p className="text-sm text-muted-foreground">Last Order</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details">Personal Details</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </dt>
                    <dd className="mt-1 text-sm">{customer.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </dt>
                    <dd className="mt-1 text-sm">{customer.phoneNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Alternate Number
                    </dt>
                    <dd className="mt-1 text-sm">{customer.alternateNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm">{customer.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Customer ID
                    </dt>
                    <dd className="mt-1 text-sm">{customer.readableUserId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm">
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
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
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
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
                    <p className="text-muted-foreground">
                      No orders found for this customer.
                    </p>
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
