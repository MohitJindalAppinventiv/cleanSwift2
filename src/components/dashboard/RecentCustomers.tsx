import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  avatarUrl?: string;
}

const statusStyles = {
  active: "bg-blue-100 text-blue-800",
  inactive: "bg-gray-100 text-gray-800",
};

export function RecentCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate  = useNavigate(); 



   const handleViewAll = () => {
    navigate("/customers");
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/getAllUser", {
          params: {
            page: 1,
            limit: 6,
            status: "active",
          },
        });

        const formattedCustomers = response.data.data.profiles.map(
          (profile: any) => ({
            id: profile.id,
            fullName: profile.fullName,
            phoneNumber: profile.phoneNumber,
            isActive: profile.isActive,
          })
        );

        setCustomers(formattedCustomers);
        setLoading(false);
      } catch (err: any) {
        // Check if the error response contains the session expired message
        const errorMessage =
          err.response?.data?.error === "Session expired. Please login again."
            ? "Session expired. Please login again."
            : "Failed to fetch customers";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Customers</CardTitle>
        <Button onClick= {handleViewAll} variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={customer.avatarUrl} />
                  <AvatarFallback>
                    {customer.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{customer.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {customer.phoneNumber}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`${statusStyles[customer.isActive ? "active" : "inactive"]}`}
                >
                  {customer.isActive ? "active" : "inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}