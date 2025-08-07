import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/index"; // Adjust import path as needed
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  fetchProfile,
  updatePhoneNumber,
  updatePassword,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  clearError,
} from "../store/slices/settingsSlice"; // Adjust import path as needed

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

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  const [mobile, setMobile] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Initialize mobile number from profile when profile is loaded
  useEffect(() => {
    if (profile?.phoneNumber) {
      setMobile(profile.phoneNumber.substring(3));
    }
  }, [profile]);

  // Fetch profile on component mount
  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  // Handle errors from Redux state
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
      const result = await dispatch(
        updatePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        })
      ).unwrap();
      
      toast({ title: "Password updated successfully!" });
      reset();
    } catch (err: any) {
      // Error is already handled by the useEffect above
      // This catch block ensures the form doesn't break if there's an error
    }
  };

  const handlePhoneUpdate = async () => {
    // Only update if the mobile number has actually changed
    const changeMobile=`+91${mobile}`
    if (changeMobile === profile?.phoneNumber) {
      toast({
        title: "No changes",
        description: "Phone number is the same as current number",
        variant: "default",
      });
      return;
    }

    try {
      await dispatch(updatePhoneNumber(changeMobile)).unwrap();
      toast({ title: "Phone number updated successfully!" });
    } catch (err: any) {
      // Error is already handled by the useEffect above
      // Reset mobile to original value if update failed
      setMobile(profile?.phoneNumber || "");
    }
  };

  if (loading && !profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p>Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your details and contact info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID</Label>
                    <p className="text-muted-foreground">
                      {profile?.uid || "-"}
                    </p>
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-muted-foreground">
                      {profile?.displayName || "-"}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-muted-foreground">
                      {profile?.email || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <p className="text-muted-foreground">
                    {profile?.phoneNumber || "-"}
                  </p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p className="text-muted-foreground">
                    {profile?.role || "-"}
                  </p>
                </div>
                <div>
                  <Label>Email Verified</Label>
                  <p className="text-muted-foreground">
                    {profile?.emailVerified ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <Label>Last Logged In</Label>
                  <p className="text-muted-foreground">
                    {profile?.lastSignInTime || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Change phone number or password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Update Phone Number */}
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(`${e.target.value}`)}
                      disabled={loading}
                    />
                    <Button 
                      type="button" 
                      onClick={handlePhoneUpdate}
                      disabled={loading || mobile === profile?.phoneNumber}
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                  </div>
                  {mobile !== profile?.phoneNumber && (
                    <p className="text-sm text-muted-foreground">
                      Phone number will be updated from "{profile?.phoneNumber || 'Not set'}" to "{mobile}"
                    </p>
                  )}
                </div>

                {/* Update Password */}
                <form
                  onSubmit={handleSubmit(handlePasswordUpdate)}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-medium">Change Password</h4>

                  <div>
                    <Label>Current Password</Label>
                    <Input 
                      type="password" 
                      {...register("oldPassword")} 
                      disabled={loading}
                    />
                    {errors.oldPassword && (
                      <p className="text-sm text-red-500">
                        {errors.oldPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input 
                      type="password" 
                      {...register("newPassword")} 
                      disabled={loading}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input 
                      type="password" 
                      {...register("confirmPassword")} 
                      disabled={loading}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}