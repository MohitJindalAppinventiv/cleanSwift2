
import { axiosInstance } from "@/api/axios/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Users, Package, Clock, Loader, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface OverviewItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}



const OverviewItem = ({ icon, label, value }: OverviewItemProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <div className="p-3 rounded-full bg-blue-50">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export function DashboardOverview() {
  const isMobile = useIsMobile();

  const [users,setUsers]=useState();
  const [totalOrders,setTotalOrders]=useState();
    const [pendingOrders,setPendingOrders]=useState();
    const [processingOrders,setProcessingOrders]=useState();
    const [deliveredOrders,setDeliveredOrders]=useState();
    const [cancelledOrders,setCancelledOrders]=useState();


  const fetchOverviewData=async ()=>{
    const response=await axiosInstance.get("/getDashboardAnalytics");
    console.log("overview response",response);
    setUsers(response.data.data.totalUsers);
    setTotalOrders(response.data.data.totalOrders);
    setProcessingOrders(response.data.data.processedOrders)
    setPendingOrders(response.data.data.pendingOrders);
    setCancelledOrders(response.data.data.cancelledOrders);
    setDeliveredOrders(response.data.data.deliveredOrders);
  }
  useEffect(()=>{

    fetchOverviewData();
    // setUsers(data.users);
  },[])


  
  // Mock data for the overview
  const overviewData = [
    { label: "Users", value: users, icon: <Users size={20} className="text-blue-500" /> },
    { label: "Orders", value: totalOrders, icon: <Package size={20} className="text-indigo-500" /> },
    { label: "Pending", value: pendingOrders, icon: <Clock size={20} className="text-yellow-500" /> },
    { label: "On Progress", value: processingOrders, icon: <Loader size={20} className="text-orange-500" /> },
    { label: "Delivered", value: deliveredOrders, icon: <Check size={20} className="text-green-500" /> },
    { label: "Cancel Order", value: cancelledOrders, icon: <X size={20} className="text-red-500" /> },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Overview</h3>
      <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"}`}>
        {overviewData.map((item) => (
          <OverviewItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
}
