import { useEffect, useState } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Package,
  Calendar,
  DollarSign,
  FileText,
  User,
  IndianRupee,
  BadgePercent,
} from "lucide-react";
import {
  OrderStatus,
  OrderStatusBadge,
} from "@/components/dashboard/orders/OrderStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { OrderDetailsSkeleton } from "./orderDetailsSkeleton";

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  itemTotal: number;
}

interface FirebasetimeStamp {
  _seconds: number;
  _nanoseconds: number;
}

// interface AddressDetails {
//   addressLabel: string;
//   fullAddress?: string;
// }

interface SlotDetails {
  date: string;
  timeSlot?: string;
}

interface Order {
  id: string;
  userId: string;
  orderId: string;
  paymentId: string;
  customerName: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  finalTotal: number;
  totalPrice: number;
  deliveryCharges: number;
  platformFee: number;
  discount: number;
  couponCode: string;
  createdAt: FirebasetimeStamp;
  updatedAt: FirebasetimeStamp;
  lastUpdated: number;
  paymentCreatedAt?: number;
  addressDetails: AddressDetails;
  pickupSlotDetails: SlotDetails;
  deliverySlotDetails: SlotDetails;
  items: OrderItem[];
  userDetails: UserDetails;
}
interface UserDetails {
  readableUserId: string;
  phoneNumber: string;
  fullName: string;
}

interface AddressDetails {
  apartmentSuite: string | null;
  city: string;
  state: string;
  streetAddress: string;
}

const paymentMethods={
  "cod":"Cash On Delivery",
  "online":"Online",
}

function formatAddress(address: AddressDetails) {
  return `${address.apartmentSuite ? address.apartmentSuite : ""} ${
    address.streetAddress
  }, ${address.city}, ${address.state}`;
}

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const location=useLocation();

    const from = location.state?.from;


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/getOrderByIdAdmin`, {
          params: { orderId: id },
        });
        setOrder(res.data.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  function convertTime(time: FirebasetimeStamp): string {
    const date = new Date(time._seconds * 1000 + time._nanoseconds / 1000);
    return date.toLocaleString();
  }

  function convertTimestamp(timestamp: number): string {
    if (!timestamp) {
      return "N/A";
    }
    return new Date(timestamp).toLocaleString();
  }

  if (loading) return <OrderDetailsSkeleton />;

  if (!order) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center">

            <Button
              variant="ghost"
              onClick={() => handleBack()}
              className="mr-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">
              Order Not Found
            </h2>
          </div>
          <p>The requested order could not be found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const items = order.items || [];
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);

  const handleBack=()=>{
        if (from === "orders") {
      navigate("/orders"); // 👈 go back to orders if that's where we came from
    } else {
      navigate("/"); // 👈 default
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => handleBack()}
              className="mr-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Order {order.orderId}
              </h2>
              <p className="text-muted-foreground">
                View and manage order details
              </p>
            </div>
          </div>

          {/* Status Section */}
          <div className="flex items-center gap-4">
            {/* Order Status */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">
                Order Status
              </span>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Payment Status */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">
                Payment Status
              </span>
              <Badge
                variant={
                  order.paymentStatus === "paid" ? "success" : "destructive"
                }
              >
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Order Info */}
              <div>
                <h3 className="font-semibold mb-2 border-b pb-1">
                  Order Information
                </h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Order ID</dt>
                  <dd className="font-medium">{order.orderId}</dd>

                  <dt className="text-muted-foreground">Payment ID</dt>
                  <dd className="font-medium">{order.paymentId}</dd>

                  <dt className="text-muted-foreground">Total Items</dt>
                  <dd className="font-medium">{items.length}</dd>
                </dl>
              </div>

              {/* Timing */}
              <div>
                <h3 className="font-semibold mb-2 border-b pb-1">
                  Timing Information
                </h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Order Date</dt>
                  <dd className="font-medium">
                    {convertTime(order.createdAt)}
                  </dd>

                  <dt className="text-muted-foreground">Last Updated</dt>
                  <dd className="font-medium">
                    {convertTime(order.updatedAt)}
                  </dd>

                  <dt className="text-muted-foreground">Pickup Slot</dt>
                  <dd className="font-medium flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {order?.pickupSlotDetails?.date || "-"}
                  </dd>

                  <dt className="text-muted-foreground">Delivery Slot</dt>
                  <dd className="font-medium flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {order?.deliverySlotDetails?.date || "-"}
                  </dd>
                </dl>
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-semibold mb-2 border-b pb-1">
                  Payment Details
                </h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Method</dt>
                  <dd className="font-medium capitalize">
                    {paymentMethods[order.paymentMethod]}
                  </dd>

                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium capitalize">
                    {order.paymentStatus}
                  </dd>

                  <dt className="text-muted-foreground">Payment Date</dt>
                  <dd className="font-medium">
                    {order?.paymentCreatedAt
                      ? convertTimestamp(order?.paymentCreatedAt)
                      : "Payment hasn't initialized Yet"}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left side */}
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium text-right">
                  ₹{order.totalPrice.toFixed(2)}
                </dd>

                <dt className="text-muted-foreground">Delivery Charges</dt>
                <dd className="font-medium text-right">
                  ₹{order.deliveryCharges.toFixed(2)}
                </dd>

                <dt className="text-muted-foreground">Platform Fee</dt>
                <dd className="font-medium text-right">
                  ₹{order.platformFee.toFixed(2)}
                </dd>
              </dl>

              {/* Right side */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-green-600">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium">
                    -₹{order.discount.toFixed(2)}
                  </span>
                </div>

                {order.couponCode && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Coupon Applied
                    </span>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <BadgePercent className="h-3 w-3" />
                      {order.couponCode}
                    </Badge>
                  </div>
                )}

                <Separator className="my-3" />

                <div className="flex justify-between items-center text-lg font-bold pt-1">
                  <span>Final Total</span>
                  <span className="flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {order.finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.qty}</TableCell>
                      <TableCell className="text-right">
                        ₹{item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.itemTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Customer Details */}
              <div>
                <h3 className="font-semibold mb-2 border-b pb-1">
                  Customer Details
                </h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Customer Name</dt>
                  <dd className="font-medium">{order.customerName}</dd>

                  <dt className="text-muted-foreground">User ID</dt>
                  <dd className="font-medium">
                    {order.userDetails.readableUserId}
                  </dd>

                  <dt className="text-muted-foreground">Phone Number</dt>
                  <dd className="font-medium">
                    {order.userDetails.phoneNumber}
                  </dd>
                </dl>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold mb-2 border-b pb-1">
                  Delivery Address
                </h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd className="font-medium">
                    {formatAddress(order.addressDetails)}
                  </dd>

                  {/* {order.addressDetails.fullAddress && (
                    <>
                      <dt className="text-muted-foreground">Full Address</dt>
                      <dd className="font-medium">
                        {order.addressDetails.fullAddress}
                      </dd>
                    </>
                  )} */}
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailsPage;
