import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/index";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Shield,
  Phone,
  Mail,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Calendar,
  UserCheck,
  Hash,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  fetchProfile,
  updatePhoneNumber,
  updatePassword,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  clearError,
} from "../../store/slices/settingsSlice";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });

// Clean Skeleton Components
const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded-md w-full animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const InputSkeleton = () => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
    <div className="h-10 bg-gray-100 rounded-md w-full animate-pulse"></div>
  </div>
);

const SecuritySkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-gray-100 rounded-md animate-pulse"></div>
        <div className="w-20 h-10 bg-gray-100 rounded-md animate-pulse"></div>
      </div>
    </div>
    <div className="h-px bg-gray-200 animate-pulse"></div>
    <div className="space-y-4">
      <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
        </div>
      ))}
      <div className="w-32 h-10 bg-gray-100 rounded-md animate-pulse"></div>
    </div>
  </div>
);

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  const [mobile, setMobile] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    if (profile?.phoneNumber) {
      setMobile(profile.phoneNumber.substring(3));
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handlePasswordUpdate = async (data: any) => {
    try {
      await dispatch(
        updatePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        })
      ).unwrap();
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      reset();
    } catch (err: any) {
      // Error handled by useEffect
    }
  };

  const handlePhoneUpdate = async () => {
    const changeMobile = `+91${mobile}`;
    if (changeMobile === profile?.phoneNumber) {
      toast({
        title: "No Changes",
        description: "Phone number is the same as current number",
        variant: "default",
      });
      return;
    }

    try {
      await dispatch(updatePhoneNumber(changeMobile)).unwrap();
      toast({
        title: "Success",
        description: "Phone number updated successfully",
      });
    } catch (err: any) {
      setMobile(profile?.phoneNumber?.substring(3) || "");
    }
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isPhoneChanged = mobile !== profile?.phoneNumber?.substring(3);
  const hasPasswordValues =
    watchedValues.oldPassword ||
    watchedValues.newPassword ||
    watchedValues.confirmPassword;

  if (loading && !profile) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>

          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>

          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <ProfileSkeleton />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Clean Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          {/* Simple Tab Navigation */}
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your personal details and account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ProfileSkeleton />
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* User ID */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-400" />
                          User ID
                        </Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <code className="text-sm text-gray-700 break-all">
                            {profile?.uid || "-"}
                          </code>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-gray-400" />
                          Full Name
                        </Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <p className="text-sm text-gray-700">
                            {profile?.displayName || "Not set"}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          Email Address
                        </Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <p className="text-sm text-gray-700">
                            {profile?.email || "Not set"}
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          Phone Number
                        </Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <p className="text-sm text-gray-700">
                            {profile?.phoneNumber || "Not set"}
                          </p>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          Role
                        </Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <Badge variant="secondary">
                            {profile?.role || "User"}
                          </Badge>
                        </div>
                      </div>

                      {/* Email Verification */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          Email Status
                        </Label>
                        <div className="p-3 bg-gray-50 border rounded-md">
                          <div className="flex items-center gap-2">
                            {profile?.emailVerified ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <Badge
                                  variant="outline"
                                  className="text-green-700 border-green-200"
                                >
                                  Verified
                                </Badge>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <Badge
                                  variant="outline"
                                  className="text-red-700 border-red-200"
                                >
                                  Not Verified
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Last Login - Full Width */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Last Login
                      </Label>
                      <div className="p-3 bg-gray-50 border rounded-md">
                        <p className="text-sm text-gray-700">
                          {formatDate(profile?.lastSignInTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your phone number and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SecuritySkeleton />
                ) : (
                  <div className="space-y-8">
                    {/* Phone Number Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <h3 className="text-lg font-medium">Phone Number</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-500">
                            Current: {profile?.phoneNumber || "Not set"}
                          </Label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm">+91</span>
                            </div>
                            <Input
                              type="tel"
                              value={mobile}
                              onChange={(e) =>
                                setMobile(e.target.value.replace(/\D/g, ""))
                              }
                              disabled={loading}
                              className="pl-12"
                              placeholder="Enter phone number"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handlePhoneUpdate}
                            disabled={loading || !isPhoneChanged}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Update"
                            )}
                          </Button>
                        </div>

                        {isPhoneChanged && !loading && (
                          <div className="text-xs text-gray-500 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            Phone number will be updated to:{" "}
                            <strong>+91{mobile}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Password Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-gray-400" />
                        <h3 className="text-lg font-medium">Change Password</h3>
                      </div>

                      <form
                        onSubmit={handleSubmit(handlePasswordUpdate)}
                        className="space-y-4"
                      >
                        {/* Current Password */}
                        <div className="space-y-2">
                          <Label htmlFor="oldPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="oldPassword"
                              type={showPasswords.old ? "text" : "password"}
                              {...register("oldPassword")}
                              disabled={loading || isSubmitting}
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => togglePasswordVisibility("old")}
                            >
                              {showPasswords.old ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          {errors.oldPassword && (
                            <p className="text-sm text-red-500">
                              {errors.oldPassword.message}
                            </p>
                          )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              {...register("newPassword")}
                              disabled={loading || isSubmitting}
                              placeholder="Enter new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => togglePasswordVisibility("new")}
                            >
                              {showPasswords.new ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          {errors.newPassword && (
                            <p className="text-sm text-red-500">
                              {errors.newPassword.message}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              {...register("confirmPassword")}
                              disabled={loading || isSubmitting}
                              placeholder="Confirm new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                togglePasswordVisibility("confirm")
                              }
                            >
                              {showPasswords.confirm ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                              {errors.confirmPassword.message}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={
                            loading || isSubmitting || !hasPasswordValues
                          }
                          className="w-full sm:w-auto"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating Password...
                            </>
                          ) : (
                            <>
                              <Key className="mr-2 h-4 w-4" />
                              Update Password
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
