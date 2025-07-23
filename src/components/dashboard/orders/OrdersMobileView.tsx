
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Order, serviceLabels } from "./types";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrdersMobileViewProps {
  orders: Order[];
}

export function OrdersMobileView({ orders }: OrdersMobileViewProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{order.id}</h3>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-muted-foreground">Service:</div>
              <div>{serviceLabels[order.service]}</div>

              <div className="text-muted-foreground">Order Date:</div>
              <div>{order.date}</div>

              <div className="text-muted-foreground">Pickup Date:</div>
              <div>{order.pickupDate}</div>

              <div className="text-muted-foreground">Delivery Date:</div>
              <div>{order.deliveryDate}</div>

              <div className="text-muted-foreground">Total:</div>
              <div className="font-semibold">${order.total.toFixed(2)}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              onClick={() => navigate(`/order-details/${order.id}`)}
              variant="default" 
              size="sm"
            >
              View Details
            </Button>
            <Button variant="outline" size="sm">
              Update Status
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
