import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation} from "react-router-dom";
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
import { OrderStatusBadge } from "@/components/dashboard/orders/OrderStatusBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { ArrowLeft, Mail, Phone, MapPin, User } from "lucide-react";
import axios from "axios";
import CustomerDetailsSkeleton from "./customerDetailsSkeleton";

// types.ts

export interface Address{
  id:string;
  addressLabel:string;
  streetAddress:string;
  apartmentSuite?:string;
  city:string;
  state:string;
  zipCode:string;
}

const showAddress=(address:Address)=>{
  const add=`${address?.apartmentSuite} ${address?.streetAddress}, ${address?.city}, ${address?.state}, ${address?.zipCode}`;
  return add;
}

export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  alternateNumber?: string | null;
  email?: string | null;
  addresses?: Address[];
  profilePictureUrl?: string | null;
  isActive: boolean;
  readableUserId: string;
  profileCreated: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  deletedByAdmin?: boolean;
  profileCreatedAt?: { _seconds: number; _nanoseconds: number };
  profileUpdatedAt?: { _seconds: number; _nanoseconds: number };
}

export interface Order {
  id: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
  finalTotal: number;
  status: "pending" | "confirmed" | "outForPickup" | "delivered" | "cancelled"; // adapt to your enum
  totalItems: number;
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("details");
  const [customer, setCustomer] = useState<Customer>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]); // ✅ real orders
  const [pagination, setPagination] = useState<Pagination>(null);

    const location = useLocation();
      const from = location.state?.from;


  useEffect(() => {
    const fetchCustomerAndOrders = async () => {
      setLoading(true);
      setError("");
      try {
        // ✅ Fetch customer details
        const profileRes = await axiosInstance.get(`/getUserProfileById`, {
          params: { userId: id },
        });
        console.log("profile Response", profileRes);
        setCustomer(profileRes.data.data);
        console.log("customer data",customer);

        // ✅ Fetch orders
        const ordersRes = await axiosInstance.get(`/getUserOrderAdmin`, {
          params: { userId: id, limit: 10, page: 1 }, // pagination support
        });
        console.log("customer order response", ordersRes);

        if (ordersRes.data.success) {
          setOrders(ordersRes.data.data.orders || []);
          setPagination(ordersRes.data.data.pagination);
        }
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("Failed to load customer details");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomerAndOrders();
  }, [id]);

  const handleBack=()=>{
        if (from === "orders") {
      navigate("/orders"); // 👈 go back to orders if that's where we came from
    } else if (from==="/") {
      navigate("/"); // 👈 default
    }
    else if(from==="payments"){
      navigate("/payments")
    }
    else{
      navigate("/customers");
    }
}

  if (loading) {
    return <CustomerDetailsSkeleton />;
  }

  if (error || !customer) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error || "Customer not found"}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleBack()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 capitalize bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {from==="/"?"Home":from}
            </button>
            <h2 className="text-3xl font-bold text-gray-900">
              {customer.fullName}
            </h2>
          </div>
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm font-medium ${
              customer.isActive
                ? "text-green-600 border-green-600"
                : "text-red-600 border-red-600"
            }`}
          >
            {customer.isActive ? "Active" : "Deleted"}
          </Badge>
        </div>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 ring-2 ring-gray-200">
                  {customer.profilePictureUrl && (
                    <AvatarImage
                      src={customer.profilePictureUrl}
                      alt={customer.fullName}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="text-2xl bg-gray-100 text-gray-600">
                    {customer.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {customer.fullName}
                  </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{customer.addresses[0].city}</span>
                    </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phoneNumber}</span>
                  </div>
            
 
                </div>
              </div>

              <div
                className={`grid ${
                  isMobile ? "grid-cols-2" : "grid-cols-3"
                } gap-4 mt-6 md:mt-0 md:ml-auto`}
              >
                <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {orders.length}
                  </h4>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
                  <h4 className="text-lg font-semibold text-gray-900">
                    &#8377;
                    {orders
                      .reduce((sum, order) => sum + order.finalTotal, 0)
                      .toFixed(2)}
                  </h4>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {orders.length > 0
                      ? new Date(
                          orders
                            .slice() // copy
                            .sort(
                              (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime()
                            )[0].createdAt
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </h4>
                  <p className="text-sm text-gray-500">Last Order</p>
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
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="details"
              className="py-2 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Personal Details
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="py-2 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Order History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Full Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {customer.fullName}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Phone Number
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {customer.phoneNumber}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Alternate Number
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {customer.alternateNumber || "N/A"}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {showAddress(customer.addresses[0]) || "N/A"}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Customer ID
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {customer.readableUserId}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Status
                      </dt>
                      <dd className="mt-1 text-sm">
                        <Badge
                          variant="outline"
                          className={`${
                            customer.isActive
                              ? "text-green-600 border-green-600"
                              : "text-red-600 border-red-600"
                          }`}
                        >
                          {customer.isActive ? "Active" : "Deleted"}
                        </Badge>
                      </dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-700">
                          Order ID
                        </TableHead>
                        <TableHead className="text-gray-700">Date</TableHead>
                        <TableHead className="text-gray-700">Amount</TableHead>
                        <TableHead className="text-gray-700">
                          Total Items
                        </TableHead>

                        <TableHead className="text-gray-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <TableCell className="font-medium text-blue-600">
                            <Link to={`../../order-details/${order.id}`}>
                            {order.orderId}
                            </Link>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            &#8377;{order.finalTotal.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {order.totalItems}
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
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
