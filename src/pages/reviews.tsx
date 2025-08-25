import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/api/axios/axiosInstance";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  userId: string;
  orderId: string;
  customerName: string;
  customerInitials: string;
  serviceIds: string[];
  serviceNames: string[];
  readableOrderId: string;

  rating: number;
  comment: string;
  createdAt: { _seconds: number; _nanoseconds: number } | string;
  updatedAt: { _seconds: number; _nanoseconds: number } | string;
  isDeleted: boolean;
  hasResponse: boolean;
  response: {
    id: string;
    response: string;
    adminName: string;
    createdAt: { _seconds: number; _nanoseconds: number } | string;
    updatedAt: { _seconds: number; _nanoseconds: number } | string;
  } | null;
  orderDetails: {
    orderId: string;
    items: {
      name: string;
      price: number;
      productId: string;
      qty: number;
      serviceId: string;
      itemTotal: number;
    }[];
    totalPrice: number;
    createdAt: { _seconds: number; _nanoseconds: number } | string;
  };
}

interface Statistics {
  averageRating: number;
  totalReviews: number;
  fiveStarReviews: number;
  fiveStarPercentage: number;
  responseRate: number;
  ratingDistribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  changeFromLastMonth: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    statistics: Statistics;
    recentReviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters: {
      includeDeleted: boolean;
      userId: null | string;
      orderId: null | string;
      rating: null | number;
    };
  };
  message: string;
}

interface DeleteDialogState {
  open: boolean;
  type: "review" | "response";
  id: string;
  reviewId?: string;
  title: string;
  description: string;
  isLoading: boolean;
}

const ReviewsPage = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [editingResponse, setEditingResponse] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    type: "review",
    id: "",
    title: "",
    description: "",
    isLoading: false,
  });
  const [actionLoading, setActionLoading] = useState<{
    respond: { [key: string]: boolean };
    updateResponse: { [key: string]: boolean };
  }>({
    respond: {},
    updateResponse: {},
  });
  const { toast } = useToast();

  const fetchReviews = async (currentPage: number) => {
    setReviewsLoading(true);
    try {
      const response = await axiosInstance.get<ApiResponse>("/getAllReviews", {
        params: {
          page: currentPage,
          limit,
          includeDeleted: false,
        },
      });

      if (response.data.success) {
        setStatistics(response.data.data.statistics);
        setReviews(response.data.data.recentReviews);
        setPagination(response.data.data.pagination);
        setStatisticsLoading(false);
      }
    } catch (error: any) {
      const status = error.response?.status;
      toast({
        title: "Error",
        description:
          status === 400
            ? "Invalid request parameters"
            : status === 401
            ? "Authentication failed"
            : status === 500
            ? "Internal server error"
            : "Failed to fetch reviews",
        variant: "destructive",
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page, limit]);

  const openDeleteDialog = (
    type: "review" | "response",
    id: string,
    reviewId?: string
  ) => {
    setDeleteDialog({
      open: true,
      type,
      id,
      reviewId,
      title: type === "review" ? "Delete Review" : "Delete Response",
      description:
        type === "review"
          ? "Are you sure you want to delete this review? This action cannot be undone."
          : "Are you sure you want to delete this response? This action cannot be undone.",
      isLoading: false,
    });
  };

  const handleDeleteReview = async () => {
    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await axiosInstance.delete("/adminDeleteReview", {
        params: { reviewId: deleteDialog.id },
      });

      // Remove the review from state immediately
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== deleteDialog.id)
      );

      // Update statistics
      setStatistics((prevStats) => {
        if (!prevStats) return prevStats;
        const deletedReview = reviews.find((r) => r.id === deleteDialog.id);
        if (!deletedReview) return prevStats;

        const newTotalReviews = prevStats.totalReviews - 1;
        const newFiveStarReviews =
          deletedReview.rating === 5
            ? prevStats.fiveStarReviews - 1
            : prevStats.fiveStarReviews;

        let newAverageRating = prevStats.averageRating;
        let newFiveStarPercentage = 0;
        let newResponseRate = prevStats.responseRate;

        if (newTotalReviews > 0) {
          // Recalculate average rating
          const totalRatingPoints =
            prevStats.averageRating * prevStats.totalReviews -
            deletedReview.rating;
          newAverageRating = Number(
            (totalRatingPoints / newTotalReviews).toFixed(1)
          );

          // Recalculate five star percentage
          newFiveStarPercentage = Math.round(
            (newFiveStarReviews / newTotalReviews) * 100
          );

          // Recalculate response rate
          const totalResponses =
            Math.round(
              (prevStats.totalReviews * prevStats.responseRate) / 100
            ) - (deletedReview.hasResponse ? 1 : 0);
          newResponseRate = Math.round(
            (totalResponses / newTotalReviews) * 100
          );
        }

        return {
          ...prevStats,
          totalReviews: newTotalReviews,
          averageRating: newAverageRating,
          fiveStarReviews: newFiveStarReviews,
          fiveStarPercentage: newFiveStarPercentage,
          responseRate: newResponseRate,
          ratingDistribution: {
            ...prevStats.ratingDistribution,
            [deletedReview.rating.toString() as "1" | "2" | "3" | "4" | "5"]:
              prevStats.ratingDistribution[
                deletedReview.rating.toString() as "1" | "2" | "3" | "4" | "5"
              ] - 1,
          },
        };
      });

      // Update pagination if needed
      setPagination((prevPagination) => {
        if (!prevPagination) return prevPagination;
        const newTotal = prevPagination.total - 1;
        const newTotalPages = Math.ceil(newTotal / prevPagination.limit) || 1;

        return {
          ...prevPagination,
          total: newTotal,
          totalPages: newTotalPages,
        };
      });

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      setDeleteDialog((prev) => ({ ...prev, open: false, isLoading: false }));
    } catch (error: any) {
      const status = error.response?.status;
      toast({
        title: "Error",
        description:
          status === 400
            ? "Review ID is required"
            : status === 401
            ? "Authentication failed"
            : status === 404
            ? "Review not found"
            : status === 500
            ? "Internal server error"
            : "Failed to delete review",
        variant: "destructive",
      });
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteResponse = async () => {
    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await axiosInstance.delete("/adminDeleteResponse", {
        params: { responseId: deleteDialog.id },
      });

      // Remove the response from the specific review in state immediately
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.response?.id === deleteDialog.id
            ? {
                ...review,
                hasResponse: false,
                response: null,
              }
            : review
        )
      );

      // Update statistics - decrease response rate
      setStatistics((prevStats) => {
        if (!prevStats) return prevStats;
        const totalResponses =
          Math.round((prevStats.totalReviews * prevStats.responseRate) / 100) -
          1;
        const newResponseRate =
          prevStats.totalReviews > 0
            ? Math.round((totalResponses / prevStats.totalReviews) * 100)
            : 0;

        return {
          ...prevStats,
          responseRate: newResponseRate,
        };
      });

      toast({
        title: "Success",
        description: "Response deleted successfully",
      });
      setDeleteDialog((prev) => ({ ...prev, open: false, isLoading: false }));
    } catch (error: any) {
      const status = error.response?.status;
      toast({
        title: "Error",
        description:
          status === 400
            ? "Response ID required"
            : status === 401
            ? "Authentication failed"
            : status === 404
            ? "Response not found"
            : status === 500
            ? "Internal server error"
            : "Failed to delete response",
        variant: "destructive",
      });
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const validateResponseText = (text: string) => {
    if (!text.trim()) return "Response is required";
    if (text.length > 2000) return "Response must be 1-2000 characters";
    return null;
  };

  const handleRespond = async (reviewId: string) => {
    const validationError = validateResponseText(responseText);
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setActionLoading((prev) => ({
      ...prev,
      respond: { ...prev.respond, [reviewId]: true },
    }));

    try {
      const response = await axiosInstance.post(
        "/adminRespondToReview",
        { response: responseText },
        {
          params: { reviewId },
        }
      );

      // Update the specific review in state immediately
      if (response.data.success) {
        const newResponse = response.data.data;
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  hasResponse: true,
                  response: newResponse,
                }
              : review
          )
        );

        // Update statistics - increment response rate
        setStatistics((prevStats) => {
          if (!prevStats) return prevStats;
          const newResponseRate = Math.round(
            (((prevStats.totalReviews * prevStats.responseRate) / 100 + 1) /
              prevStats.totalReviews) *
              100
          );
          return {
            ...prevStats,
            responseRate: newResponseRate,
          };
        });
      }

      toast({
        title: "Success",
        description: "Response added successfully",
      });
      setRespondingTo(null);
      setResponseText("");
    } catch (error: any) {
      const status = error.response?.status;
      toast({
        title: "Error",
        description:
          status === 400
            ? "Validation error or Review ID required"
            : status === 401
            ? "Authentication failed"
            : status === 404
            ? "Review not found"
            : status === 409
            ? "Response already exists for this review"
            : status === 500
            ? "Internal server error"
            : "Failed to add response",
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        respond: { ...prev.respond, [reviewId]: false },
      }));
    }
  };

  const handleUpdateResponse = async (responseId: string, reviewId: string) => {
    const validationError = validateResponseText(responseText);
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setActionLoading((prev) => ({
      ...prev,
      updateResponse: { ...prev.updateResponse, [reviewId]: true },
    }));

    try {
      const response = await axiosInstance.put(
        "/adminUpdateResponse",
        { response: responseText },
        {
          params: { responseId },
        }
      );

      // Update the specific response in state immediately
      if (response.data.success) {
        const updatedResponse = response.data.data;
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId && review.response
              ? {
                  ...review,
                  response: {
                    ...review.response,
                    response: updatedResponse.response,
                    updatedAt: updatedResponse.updatedAt,
                  },
                }
              : review
          )
        );
      }

      toast({
        title: "Success",
        description: "Response updated successfully",
      });
      setEditingResponse(null);
      setResponseText("");
    } catch (error: any) {
      const status = error.response?.status;
      toast({
        title: "Error",
        description:
          status === 400
            ? "Validation error or Response ID required"
            : status === 401
            ? "Authentication failed"
            : status === 404
            ? "Response not found"
            : status === 500
            ? "Internal server error"
            : "Failed to update response",
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        updateResponse: { ...prev.updateResponse, [reviewId]: false },
      }));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const parseTimestamp = (
    timestamp: { _seconds: number; _nanoseconds: number } | string
  ) => {
    if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleDateString();
    }
    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
    );
    return date.toLocaleDateString();
  };

  const handleDeleteDialogConfirm = () => {
    if (deleteDialog.type === "review") {
      handleDeleteReview();
    } else {
      handleDeleteResponse();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Static Header - Never shows loading */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">
            Customer feedback and ratings for your services
          </p>
        </div>

        {/* Review Stats - All cards in single row */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statisticsLoading ? (
                <>
                  <Skeleton className="h-8 w-16" />
                  <div className="flex items-center mt-1 space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4 rounded-full" />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {statistics?.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(Math.round(statistics?.averageRating || 0))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statisticsLoading ? (
                <>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {statistics?.totalReviews}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statistics?.changeFromLastMonth}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                5-Star Reviews
              </CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statisticsLoading ? (
                <>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {statistics?.fiveStarReviews}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statistics?.fiveStarPercentage}% of total
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statisticsLoading ? (
                <>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32 mt-2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {statistics?.responseRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reviews responded to
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rating Distribution
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statisticsLoading ? (
                <div className="space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-2 w-4" />
                      <Skeleton className="h-2 flex-1" />
                      <Skeleton className="h-2 w-4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      statistics?.ratingDistribution[
                        rating.toString() as "1" | "2" | "3" | "4" | "5"
                      ] || 0;
                    const percentage = statistics?.totalReviews
                      ? Math.round((count / statistics.totalReviews) * 100)
                      : 0;
                    return (
                      <div
                        key={rating}
                        className="flex items-center space-x-1 text-xs"
                      >
                        <span className="w-4 text-xs">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              rating === 5
                                ? "bg-green-500"
                                : rating === 4
                                ? "bg-green-400"
                                : rating === 3
                                ? "bg-yellow-500"
                                : rating === 2
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-4 text-xs text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>
                  Latest customer feedback and ratings
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1); // Reset to first page when changing limit
                  }}
                  className="px-3 py-1 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={reviewsLoading}
                >
                  <option value={5}>5 reviews</option>
                  <option value={10}>10 reviews</option>
                  <option value={15}>15 reviews</option>
                  <option value={20}>20 reviews</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {reviewsLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Skeleton
                              key={j}
                              className="h-4 w-4 rounded-full"
                            />
                          ))}
                        </div>
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {review.customerInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">
                              <Link
                                to={`../customer-details/${review.userId}`}
                                state={{ from: "reviews" }}
                              >
                                {review.customerName}
                              </Link>
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>
                                <Link
                                  to={`../order-details/${review.orderId}`}
                                  state={{ from: "reviews" }}
                                >
                                  Order: {review.readableOrderId}
                                </Link>
                              </span>
                              <span>•</span>
                              <span>{review.serviceNames.join(", ")}</span>
                              <span>•</span>
                              <span>{parseTimestamp(review.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{review.rating} ⭐</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                openDeleteDialog("review", review.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm">{review.comment}</p>

                        {review.response ? (
                          <div className="mt-4 p-4 bg-muted rounded-md">
                            <div className="flex justify-between items-center">
                              <h5 className="font-semibold">
                                {review.response.adminName} responded:
                              </h5>
                              <div className="space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingResponse(review.response!.id);
                                    setResponseText(review.response!.response);
                                  }}
                                  disabled={
                                    actionLoading.updateResponse[review.id]
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    openDeleteDialog(
                                      "response",
                                      review.response!.id,
                                      review.id
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm">
                              {review.response.response}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {parseTimestamp(
                                review.response.updatedAt ||
                                  review.response.createdAt
                              )}
                            </p>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => setRespondingTo(review.id)}
                            disabled={actionLoading.respond[review.id]}
                          >
                            Respond
                          </Button>
                        )}

                        {(respondingTo === review.id ||
                          editingResponse === review.response?.id) && (
                          <div className="mt-4 space-y-2">
                            <Input
                              placeholder="Enter your response..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              maxLength={2000}
                              disabled={
                                actionLoading.respond[review.id] ||
                                actionLoading.updateResponse[review.id]
                              }
                            />
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() =>
                                    editingResponse
                                      ? handleUpdateResponse(
                                          editingResponse,
                                          review.id
                                        )
                                      : handleRespond(review.id)
                                  }
                                  disabled={
                                    actionLoading.respond[review.id] ||
                                    actionLoading.updateResponse[review.id]
                                  }
                                >
                                  {actionLoading.respond[review.id] ||
                                  actionLoading.updateResponse[review.id] ? (
                                    "Saving..."
                                  ) : (
                                    <>
                                      Save <Save className="ml-2 h-4 w-4" />
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setRespondingTo(null);
                                    setEditingResponse(null);
                                    setResponseText("");
                                  }}
                                  disabled={
                                    actionLoading.respond[review.id] ||
                                    actionLoading.updateResponse[review.id]
                                  }
                                >
                                  Cancel <X className="ml-2 h-4 w-4" />
                                </Button>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {responseText.length}/2000 characters
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination - Always show when there are multiple pages */}
        {!reviewsLoading && pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
              reviews
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={`cursor-pointer ${
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-accent"
                    }`}
                  />
                </PaginationItem>

                {/* Show first page */}
                {pagination.totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(1);
                      }}
                      isActive={page === 1}
                      className="cursor-pointer hover:bg-accent"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Show ellipsis if needed */}
                {page > 3 && pagination.totalPages > 5 && (
                  <PaginationItem>
                    <span className="px-3 py-2 text-sm">...</span>
                  </PaginationItem>
                )}

                {/* Show current page and surrounding pages */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((pageNum) => {
                    if (pagination.totalPages <= 5)
                      return pageNum > 1 && pageNum < pagination.totalPages;
                    if (page <= 3)
                      return (
                        pageNum > 1 &&
                        pageNum <= 4 &&
                        pageNum < pagination.totalPages
                      );
                    if (page >= pagination.totalPages - 2)
                      return (
                        pageNum >= pagination.totalPages - 3 &&
                        pageNum < pagination.totalPages
                      );
                    return pageNum >= page - 1 && pageNum <= page + 1;
                  })
                  .map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNum);
                        }}
                        isActive={page === pageNum}
                        className="cursor-pointer hover:bg-accent"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {/* Show ellipsis if needed */}
                {page < pagination.totalPages - 2 &&
                  pagination.totalPages > 5 && (
                    <PaginationItem>
                      <span className="px-3 py-2 text-sm">...</span>
                    </PaginationItem>
                  )}

                {/* Show last page */}
                {pagination.totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pagination.totalPages);
                      }}
                      isActive={page === pagination.totalPages}
                      className="cursor-pointer hover:bg-accent"
                    >
                      {pagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < pagination.totalPages) setPage(page + 1);
                    }}
                    className={`cursor-pointer ${
                      page === pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-accent"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog((prev) => ({ ...prev, open }))
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{deleteDialog.title}</DialogTitle>
              <DialogDescription>{deleteDialog.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteDialog((prev) => ({ ...prev, open: false }))
                }
                disabled={deleteDialog.isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteDialogConfirm}
                disabled={deleteDialog.isLoading}
              >
                {deleteDialog.isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ReviewsPage;
