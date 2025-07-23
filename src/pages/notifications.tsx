import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";

const mockNotifications = [
  {
    id: "NOT-001",
    type: "order",
    title: "New Order Received",
    message: "Order ORD-001 has been placed by Emma Johnson",
    timestamp: "2023-05-20 10:30 AM",
    read: false,
    priority: "high",
  },
  {
    id: "NOT-002",
    type: "payment",
    title: "Payment Confirmed",
    message: "Payment for Order ORD-002 has been successfully processed",
    timestamp: "2023-05-20 09:15 AM",
    read: true,
    priority: "medium",
  },
  {
    id: "NOT-003",
    type: "review",
    title: "New Review",
    message: "Sarah Wilson left a 5-star review for your service",
    timestamp: "2023-05-19 08:45 PM",
    read: false,
    priority: "low",
  },
  {
    id: "NOT-004",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM",
    timestamp: "2023-05-19 06:00 PM",
    read: true,
    priority: "medium",
  },
];

const NotificationsPage = () => {
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const todayCount = mockNotifications.filter(n => n.timestamp.includes("2023-05-20")).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Bell className="h-4 w-4" />;
      case "payment":
        return <CheckCircle className="h-4 w-4" />;
      case "review":
        return <MessageSquare className="h-4 w-4" />;
      case "system":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            <p className="text-muted-foreground">
              Stay updated with your business activities
            </p>
          </div>
          <Button variant="outline">
            Mark All as Read
          </Button>
        </div>

        {/* Notification Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                Notifications pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayCount}</div>
              <p className="text-xs text-muted-foreground">
                Received today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockNotifications.filter(n => n.priority === "high").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Urgent notifications
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockNotifications.length}</div>
              <p className="text-xs text-muted-foreground">
                All notifications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Latest updates and alerts for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "bg-white"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={getPriorityColor(notification.priority)}
                        >
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;