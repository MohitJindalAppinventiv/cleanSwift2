
// import React from "react";
// import { Card } from "@/components/ui/card";
// import { CouponsHeader } from "./CouponsHeader";
// import { CouponsTable } from "./CouponsTable";

// export function CouponsConfigManager() {
//   return (
//     <div className="space-y-4">
//       <CouponsHeader />
//       <Card>
//         <CouponsTable />
//       </Card>
//     </div>
//   );
// }


// CouponsConfigManager.tsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CouponsHeader } from "./CouponsHeader";
import { CouponsTable } from "./CouponsTable";
import { axiosInstance } from "@/api/axios/axiosInstance";
import API from "@/api/endpoints/endpoint"; // Replace with your actual API endpoint file
import { toast } from "sonner";

export function CouponsConfigManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const res = await axiosInstance.get(API.GET_ALL_COUPONS()); // your GET API here
      console.log(res);
      setCoupons(res.data.data);
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="space-y-4">
      <CouponsHeader />
      <Card>
        <CouponsTable coupons={coupons} loading={loading} refetchCoupons={fetchCoupons} />
      </Card>
    </div>
  );
}
