import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { axiosInstance } from "@/api/axios/axiosInstance";

function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // inside Complaint component

  // New function to mark complaint as read
  const markAsRead = async (complaintId: string) => {
    try {
      setLoading(true);

      const response = await axiosInstance.put(
        `/adminMarkComplaintAsRead`,
        null,
        {
          params: { id: complaintId },
        }
      );

      const data = response.data;
      if (data.success) {
        // Update complaint status locally so UI refreshes
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === complaintId
              ? { ...c, status: "read", readAt: data.data.readAt }
              : c
          )
        );
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err: any) {
      console.error("Error marking complaint as read:", err);
      setError(err.message || "Failed to mark complaint as read");
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {
        page: page.toString(),
        limit: pagination.limit.toString(),
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status !== "all") {
        params.status = status;
      }

      // Axios GET request with params and headers
      const response = await axiosInstance.get("/adminGetComplaints", {
        params,
      });

      console.log("complaint response", response);

      const data = response.data;

      if (data.success) {
        setComplaints(data.data.complaints);
        setPagination(data.data.pagination);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints(1, searchQuery, statusFilter);
  };

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    fetchComplaints(1, searchQuery, status);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchComplaints(newPage, searchQuery, statusFilter);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses =
      "px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1";

    switch (status) {
      case "new":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "read":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    //   case "resolved":
    //     return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <AlertCircle size={12} />;
      case "read":
        return <Eye size={12} />;
    //   case "resolved":
    //     return <CheckCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Complaint Management
            </h1>
            <p className="text-gray-600">
              Manage and respond to user complaints
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {["all", "new", "read", ].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading complaints...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-2">
                <AlertCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Error Loading Complaints
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() =>
                  fetchComplaints(pagination.page, searchQuery, statusFilter)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Complaints Found
              </h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No complaints have been submitted yet"}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-2">User</div>
                  <div className="col-span-4">Message</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* User Info */}
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-gray-900">
                          {complaint.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {complaint.userReadableId}
                        </div>
                        <div className="text-xs text-gray-400">
                          {complaint.userEmail}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="col-span-4">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {complaint.message}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <span className={getStatusBadge(complaint.status)}>
                          {getStatusIcon(complaint.status)}
                          {complaint.status}
                        </span>
                      </div>

                      {/* Created Date */}
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600">
                          {formatDate(complaint.createdAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2">
                        {complaint.status === "new" ? (
                          <button
                            onClick={() => markAsRead(complaint.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mark as Read
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            Already {complaint.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {pagination.page} of {pagination.totalPages}(
                      {pagination.total} total complaints)
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>

                      <span className="px-3 py-1 text-sm">
                        Page {pagination.page}
                      </span>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Complaint;
