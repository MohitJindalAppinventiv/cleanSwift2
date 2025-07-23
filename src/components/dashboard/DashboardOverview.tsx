
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Users, Package, Clock, Loader, Check, X } from "lucide-react";

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
  
  // Mock data for the overview
  const overviewData = [
    { label: "Users", value: 4, icon: <Users size={20} className="text-blue-500" /> },
    { label: "Orders", value: 0, icon: <Package size={20} className="text-indigo-500" /> },
    { label: "Pending", value: 0, icon: <Clock size={20} className="text-yellow-500" /> },
    { label: "On Progress", value: 0, icon: <Loader size={20} className="text-orange-500" /> },
    { label: "Delivered", value: 1, icon: <Check size={20} className="text-green-500" /> },
    { label: "Cancel Order", value: 0, icon: <X size={20} className="text-red-500" /> },
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
