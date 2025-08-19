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

// import { useEffect, useMemo, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { fetchCoupons } from "@/store/slices/couponSlice";
// import { Card } from "@/components/ui/card";
// import { CouponsHeader } from "./CouponsHeader";
// import { CouponsCardView } from "./CouponsTable";

// export function CouponsConfigManager() {
//   const dispatch = useAppDispatch();
//   const { coupons, loading } = useAppSelector((state) => state.coupons);

//   const [filterStatus, setFilterStatus] = useState<
//     "all" | "active" | "inactive"
//   >("all");
//   const [sortKey, setSortKey] = useState<"code" | "expiry" | "discount">(
//     "code"
//   );
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [searchTerm, setSearchTerm] = useState("");

//   console.log("coupons data", coupons);

//   useEffect(() => {
//     dispatch(fetchCoupons());
//   }, [dispatch]);

//   const filteredSortedCoupons = useMemo(() => {
//     let filtered = coupons;
//     if (filterStatus === "active") {
//       filtered = filtered.filter((c) => c.isActive);
//     } else if (filterStatus === "inactive") {
//       filtered = filtered.filter((c) => !c.isActive);
//     }

//     const sorted = [...filtered].sort((a, b) => {
//       if (sortKey === "code") {
//         return sortOrder === "asc"
//           ? a.couponCode.localeCompare(b.couponCode)
//           : b.couponCode.localeCompare(a.couponCode);
//       }
//       if (sortKey === "expiry") {
//         const aDate = new Date(a.validTill._seconds * 1000);
//         const bDate = new Date(b.validTill._seconds * 1000);
//         return sortOrder === "asc"
//           ? aDate.getTime() - bDate.getTime()
//           : bDate.getTime() - aDate.getTime();
//       }
//       if (sortKey === "discount") {
//         const aDisc = a.discountPercentage ?? 0;
//         const bDisc = b.discountPercentage ?? 0;
//         return sortOrder === "asc" ? aDisc - bDisc : bDisc - aDisc;
//       }
//       return 0;
//     });

//     return sorted;
//   }, [coupons, filterStatus, sortKey, sortOrder]);

//   return (
//     <div className="space-y-4">
//       <CouponsHeader
//         filterStatus={filterStatus}
//         setFilterStatus={setFilterStatus}
//         sortKey={sortKey}
//         setSortKey={setSortKey}
//         sortOrder={sortOrder}
//         setSortOrder={setSortOrder}
//       />
//       <Card>
//         <CouponsCardView coupons={filteredSortedCoupons} loading={loading} />
//       </Card>
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCoupons } from "@/store/slices/couponSlice";
import { Card } from "@/components/ui/card";
import { CouponsHeader } from "./CouponsHeader";
import { CouponsCardView } from "./CouponsTable";

export function CouponsConfigManager() {
  const dispatch = useAppDispatch();
  const { coupons, loading } = useAppSelector((state) => state.coupons);

  // Filters, sort & search state
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const [sortKey, setSortKey] = useState<"code" | "expiry" | "discount">("code");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  interface FirestoreTimestamp {
    _seconds: number;
    _nanoseconds: number;
  }
  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  // Utility to convert FirestoreTimestamp to Date for sorting expiry
  const convertFirestoreTimestamp = (ts: FirestoreTimestamp) =>
    new Date(ts._seconds * 1000);

  // Filter, search, and sort coupons
  const filteredCoupons = useMemo(() => {
    let filtered = coupons;

    // Filter by status
    if (filterStatus !== "all") {
      const isActiveFilter = filterStatus === "active";
      filtered = filtered.filter((c) => c.isActive === isActiveFilter);
    }

    // Search filter (couponCode or couponName)
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.couponCode.toLowerCase().includes(lowerSearch) ||
          c.couponName.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    filtered = filtered.slice().sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortKey) {
        case "code":
          aVal = a.couponCode.toLowerCase();
          bVal = b.couponCode.toLowerCase();
          break;
        case "expiry":
          aVal = convertFirestoreTimestamp(a.validTill).getTime();
          bVal = convertFirestoreTimestamp(b.validTill).getTime();
          break;
        case "discount":
          aVal = a.discountPercentage || 0;
          bVal = b.discountPercentage || 0;
          break;
        default:
          aVal = a.couponCode.toLowerCase();
          bVal = b.couponCode.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [coupons, filterStatus, searchTerm, sortKey, sortOrder]);

  return (
    <div className="space-y-4">
      <CouponsHeader
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Card>
        <CouponsCardView coupons={filteredCoupons} loading={loading} />
      </Card>
    </div>
  );
}
