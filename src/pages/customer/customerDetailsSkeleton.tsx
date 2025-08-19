import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";

const CustomerDetailsSkeleton = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-9 w-32 bg-gray-200 rounded-md" />
            <div className="h-8 w-40 bg-gray-200 rounded-md" />
          </div>
          <div className="h-7 w-20 bg-gray-200 rounded-full" />
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 bg-gray-200 rounded-full" />
                <div className="space-y-3">
                  <div className="h-5 w-40 bg-gray-200 rounded-md" />
                  <div className="h-4 w-28 bg-gray-200 rounded-md" />
                  <div className="h-4 w-32 bg-gray-200 rounded-md" />
                  <div className="h-4 w-24 bg-gray-200 rounded-md" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 md:mt-0 md:ml-auto w-full max-w-md">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="h-6 w-10 bg-gray-200 rounded-md" />
                    <div className="h-3 w-20 bg-gray-200 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="details" disabled>
              <div className="h-5 w-24 bg-gray-200 rounded-md" />
            </TabsTrigger>
            <TabsTrigger value="orders" disabled>
              <div className="h-5 w-24 bg-gray-200 rounded-md" />
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Skeleton */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-40 bg-gray-200 rounded-md" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 bg-gray-200 rounded-md mt-1" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded-md" />
                      <div className="h-4 w-36 bg-gray-200 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders Skeleton */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-32 bg-gray-200 rounded-md" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="h-4 w-20 bg-gray-200 rounded-md" />
                    <div className="h-4 w-16 bg-gray-200 rounded-md" />
                    <div className="h-4 w-12 bg-gray-200 rounded-md" />
                    <div className="h-4 w-16 bg-gray-200 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDetailsSkeleton;
