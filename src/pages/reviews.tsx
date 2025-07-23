import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react";

const mockReviews = [
  {
    id: "REV-001",
    customer: "Emma Johnson",
    orderId: "ORD-001",
    rating: 5,
    comment: "Excellent service! My clothes came back perfectly clean and fresh.",
    date: "2023-05-20",
    service: "Wash & Fold",
  },
  {
    id: "REV-002",
    customer: "John Davis",
    orderId: "ORD-002",
    rating: 4,
    comment: "Good quality dry cleaning. Will use again.",
    date: "2023-05-19",
    service: "Dry Clean",
  },
  {
    id: "REV-003",
    customer: "Sarah Wilson",
    orderId: "ORD-003",
    rating: 5,
    comment: "Fast and reliable service. Highly recommended!",
    date: "2023-05-18",
    service: "Express",
  },
];

const ReviewsPage = () => {
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  const totalReviews = mockReviews.length;
  const fiveStarReviews = mockReviews.filter(r => r.rating === 5).length;

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">
            Customer feedback and ratings for your services
          </p>
        </div>

        {/* Review Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex items-center mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fiveStarReviews}</div>
              <p className="text-xs text-muted-foreground">
                {((fiveStarReviews / totalReviews) * 100).toFixed(0)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">
                Reviews responded to
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>
              Latest customer feedback and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {review.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{review.customer}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>Order: {review.orderId}</span>
                            <span>•</span>
                            <span>{review.service}</span>
                            <span>•</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {review.rating} ⭐
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
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

export default ReviewsPage;