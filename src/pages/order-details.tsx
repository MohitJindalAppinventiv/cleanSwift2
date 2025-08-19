// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   ChevronLeft,
//   Package,
//   Calendar,
//   Clock,
//   DollarSign,
//   Truck,
//   FileText,
//   User,
//   Shield
// } from "lucide-react";
// import { Order, OrderItem, mockOrders, serviceLabels } from "@/components/dashboard/orders/types";
// import { OrderStatusBadge } from "@/components/dashboard/orders/OrderStatusBadge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// const OrderDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     // In a real app, this would be an API call
//     const foundOrder = mockOrders.find(o => o.id === id);
//     setOrder(foundOrder || null);
//   }, [id]);

//   if (!order) {
//     return (
//       <DashboardLayout>
//         <div className="space-y-6">
//           <div className="flex items-center">
//             <Button
//               variant="ghost"
//               onClick={() => navigate("/orders")}
//               className="mr-4"
//             >
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back to Orders
//             </Button>
//             <h2 className="text-3xl font-bold tracking-tight">Order Not Found</h2>
//           </div>
//           <p>The requested order could not be found.</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   // Calculate subtotal and tax
//   const items = order.items || [];
//   const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
//   const tax = subtotal * 0.07;
//   const calculatedTotal = subtotal + tax + order.deliveryCharge - order.discount;

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Button
//               variant="ghost"
//               onClick={() => navigate("/orders")}
//               className="mr-4"
//             >
//               <ChevronLeft className="mr-2 h-4 w-4" />
//               Back to Orders
//             </Button>
//             <div>
//               <h2 className="text-3xl font-bold tracking-tight">Order {order.id}</h2>
//               <p className="text-muted-foreground">View and manage order details</p>
//             </div>
//           </div>
//           <OrderStatusBadge status={order.status} />
//         </div>

//         {/* Order Summary Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5" />
//               Order Summary
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-6 md:grid-cols-3">
//               <div>
//                 <h3 className="font-medium mb-3">Order Status</h3>
//                 <dl className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <dt className="text-sm text-muted-foreground">Current Status:</dt>
//                     <dd><OrderStatusBadge status={order.status} /></dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Service Type:</dt>
//                     <dd className="text-sm font-medium">{serviceLabels[order.service]}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Order ID:</dt>
//                     <dd className="text-sm font-medium">{order.id}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Total Quantity:</dt>
//                     <dd className="text-sm font-medium">{order.totalQuantity} items</dd>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <dt className="text-sm text-muted-foreground">Driver:</dt>
//                     <dd>
//                       {order.driver ? (
//                         <span className="text-sm font-medium flex items-center">
//                           <Truck className="h-3.5 w-3.5 mr-1.5" />
//                           {order.driver}
//                         </span>
//                       ) : (
//                         <Button size="sm" variant="outline">
//                           Assign Driver
//                         </Button>
//                       )}
//                     </dd>
//                   </div>
//                 </dl>
//               </div>

//               <div>
//                 <h3 className="font-medium mb-3">Timing Information</h3>
//                 <dl className="space-y-3">
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Order Date:</dt>
//                     <dd className="text-sm font-medium">{order.date}</dd>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <dt className="text-sm text-muted-foreground">Pickup:</dt>
//                     <dd className="text-sm font-medium flex items-center">
//                       <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
//                       {order.pickupDate}
//                       <Clock className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
//                       {order.pickupTime}
//                     </dd>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <dt className="text-sm text-muted-foreground">Delivery:</dt>
//                     <dd className="text-sm font-medium flex items-center">
//                       <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
//                       {order.deliveryDate}
//                       <Clock className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
//                       {order.deliveryTime}
//                     </dd>
//                   </div>
//                 </dl>
//               </div>

//               <div>
//                 <h3 className="font-medium mb-3">Payment Details</h3>
//                 <dl className="space-y-3">
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Payment Status:</dt>
//                     <dd className="text-sm">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
//                         order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
//                       </span>
//                     </dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Payment Method:</dt>
//                     <dd className="text-sm font-medium">Credit Card</dd>
//                   </div>
//                   <Separator className="my-1" />
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Subtotal:</dt>
//                     <dd className="text-sm font-medium">${subtotal.toFixed(2)}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Discount:</dt>
//                     <dd className="text-sm font-medium text-green-600">-${order.discount.toFixed(2)}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Delivery Charge:</dt>
//                     <dd className="text-sm font-medium">${order.deliveryCharge.toFixed(2)}</dd>
//                   </div>
//                   <div className="flex justify-between">
//                     <dt className="text-sm text-muted-foreground">Tax:</dt>
//                     <dd className="text-sm font-medium">${tax.toFixed(2)}</dd>
//                   </div>
//                   <div className="flex justify-between items-center pt-1">
//                     <dt className="font-medium">Total Amount:</dt>
//                     <dd className="text-lg font-bold flex items-center">
//                       <DollarSign className="h-4 w-4" />
//                       {order.total.toFixed(2)}
//                     </dd>
//                   </div>
//                 </dl>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Order Items Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Package className="h-5 w-5" />
//               Order Items
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Item</TableHead>
//                     <TableHead className="text-right">Quantity</TableHead>
//                     <TableHead className="text-right">Price</TableHead>
//                     <TableHead className="text-right">Total</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {items.map((item) => (
//                     <TableRow key={item.id}>
//                       <TableCell className="font-medium">{item.name}</TableCell>
//                       <TableCell className="text-right">{item.quantity}</TableCell>
//                       <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
//                       <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
//                     </TableRow>
//                   ))}
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
//                     <TableCell className="text-right font-medium">${subtotal.toFixed(2)}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-right font-medium">Discount</TableCell>
//                     <TableCell className="text-right font-medium text-green-600">-${order.discount.toFixed(2)}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-right font-medium">Delivery Charge</TableCell>
//                     <TableCell className="text-right font-medium">${order.deliveryCharge.toFixed(2)}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-right font-medium">Tax (7%)</TableCell>
//                     <TableCell className="text-right font-medium">${tax.toFixed(2)}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell colSpan={3} className="text-right font-semibold text-lg">Total</TableCell>
//                     <TableCell className="text-right font-semibold text-lg">${order.total.toFixed(2)}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Customer Information Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Customer Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <dl className="space-y-4">
//               <div className="flex justify-between">
//                 <dt className="font-medium text-muted-foreground">Name</dt>
//                 <dd>{order.customer}</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="font-medium text-muted-foreground">Email</dt>
//                 <dd>{order.customer.toLowerCase().replace(' ', '.')}@example.com</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="font-medium text-muted-foreground">Phone</dt>
//                 <dd>+1 (555) 123-4567</dd>
//               </div>
//               <Separator />
//               <div className="flex justify-between">
//                 <dt className="font-medium text-muted-foreground">Customer Since</dt>
//                 <dd>January 15, 2023</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="font-medium text-muted-foreground">Total Orders</dt>
//                 <dd>5</dd>
//               </div>
//             </dl>
//           </CardContent>
//         </Card>

//         <div className="flex flex-wrap gap-4">
//           <Button>Update Status</Button>
//           <Button variant="outline">Contact Customer</Button>
//           {!order.driver && <Button variant="secondary">Assign Driver</Button>}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default OrderDetailsPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Package,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  User,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/dashboard/orders/OrderStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosInstance } from "@/api/axios/axiosInstance";

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

interface FirebasetimeStamp {
  _seconds: number;
  _nanoseconds: number;
}
interface Order {
  id: string;
  userId: string;
  status: string;
  paymentMethod: string;
  finalTotal: number;
  createdAt: FirebasetimeStamp;
  updatedAt: string;
  addressDetails: {
    addressLabel: string;
    fullAddress: string;
  };
  pickupSlotDetails: {
    date: string;
    timeSlot: string;
  };
  deliverySlotDetails: {
    date: string;
    timeSlot: string;
  };
  items: OrderItem[];
}

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/getOrderByIdAdmin`, {
          params: {
            orderId: id,
          },
        });
        console.log(res);
        setOrder(res.data.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };
    fetchOrder();
  }, [id]);


  function convertTime(time: FirebasetimeStamp): string {
    const date = new Date(time._seconds * 1000 + time._nanoseconds / 1000);
    return date.toLocaleString();
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/orders")}
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
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/orders")}
              className="mr-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Order {order.id}
              </h2>
              <p className="text-muted-foreground">
                View and manage order details
              </p>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
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
            <div className="grid gap-6 md:grid-cols-3">
              {/* Status */}
              <div>
                <h3 className="font-medium mb-3">Order Status</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-muted-foreground">
                      Current Status:
                    </dt>
                    <dd>
                      <OrderStatusBadge status={order.status} />
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Order ID:</dt>
                    <dd className="text-sm font-medium">{order.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">
                      Total Items:
                    </dt>
                    <dd className="text-sm font-medium">{items.length}</dd>
                  </div>
                </dl>
              </div>

              {/* Timing */}
              <div>
                <h3 className="font-medium mb-3">Timing Information</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">
                      Order Date:
                    </dt>
                    <dd className="text-sm font-medium">
                      {/* {new Date(order.createdAt).toLocaleString()} */}
                      {convertTime(order.createdAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-muted-foreground">Pickup:</dt>
                    <dd className="text-sm font-medium flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {order?.pickupSlotDetails?.date}
                      <Clock className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
                      {order?.pickupSlotDetails?.timeSlot}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-muted-foreground">Delivery:</dt>
                    <dd className="text-sm font-medium flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {order?.deliverySlotDetails?.date}
                      <Clock className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
                      {order?.deliverySlotDetails?.timeSlot}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-medium mb-3">Payment Details</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">
                      Payment Method:
                    </dt>
                    <dd className="text-sm font-medium">
                      {order.paymentMethod}
                    </dd>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between items-center pt-1">
                    <dt className="font-medium">Total Amount:</dt>
                    <dd className="text-lg font-bold flex items-center">
                      <DollarSign className="h-4 w-4" />
                      {order.finalTotal}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.qty}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.qty * item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-right font-semibold text-lg"
                    >
                      Total
                    </TableCell>
                    <TableCell className="text-right font-semibold text-lg">
                      ${order.finalTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info (basic since API only gives address) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">User ID</dt>
                <dd>{order.userId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Address</dt>
                <dd>{order.addressDetails.addressLabel}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailsPage;
