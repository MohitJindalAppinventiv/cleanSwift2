
// import React, { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { CouponsHeader } from "./CouponsHeader";
// import { CouponsTable } from "./CouponsTable";
// import { axiosInstance } from "@/api/axios/axiosInstance";
// import API from "@/api/endpoints/endpoint"; // Replace with your actual API endpoint file
// import { toast } from "sonner";

// export function CouponsConfigManager() {
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchCoupons = async () => {
//     try {
//       const res = await axiosInstance.get(API.GET_ALL_COUPONS()); // your GET API here
//       console.log(res);
//       setCoupons(res.data.data);
//     } catch (error) {
//       toast.error("Failed to load coupons");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   return (
//     <div className="space-y-4">
//       <CouponsHeader />
//       <Card>
//         <CouponsTable coupons={coupons} loading={loading} refetchCoupons={fetchCoupons} />
//       </Card>
//     </div>
//   );
// }


import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCoupons } from "@/store/slices/couponSlice";
import { Card } from "@/components/ui/card";
import { CouponsHeader } from "./CouponsHeader";
import { CouponsCardView } from "./CouponsTable";

export function CouponsConfigManager() {
  const dispatch = useAppDispatch();
  const { coupons, loading } = useAppSelector(state => state.coupons);
  console.log("coupons data",coupons);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <CouponsHeader />
      <Card>
        <CouponsCardView coupons={coupons} loading={loading} />
      </Card>
    </div>
  );
}
