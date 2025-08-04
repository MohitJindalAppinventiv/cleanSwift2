import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { axiosInstance } from "@/api/axios/axiosInstance";
import { toast } from "@/components/ui/use-toast";
import API from "@/api/endpoints/endpoint";
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
  const [profile, setProfile] = useState<any>(null);
  const [mobile, setMobile] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`${API.GET_PROFILE()}`);
        if (res.data.success) {
          setProfile(res.data.profile);
          setMobile(res.data.profile.phoneNumber || "");
        }
        console.log("response", res);
      } catch (err) {
        toast({ title: "Failed to load profile", variant: "destructive" });
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordUpdate = async (data: any) => {
    console.log(data)
    try {
      await axiosInstance.post(`${API.UPDATE_PASSWORD()}`, {oldPassword:data.oldPassword,newPassword:data.newPassword});
      toast({ title: "Password updated successfully!" });
      reset();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handlePhoneUpdate = async () => {
    try {
      console.log("running",mobile)
      const res = await axiosInstance.post(`${API.UPDATE_PHONE_NUMBER()}`, { newPhoneNumber: mobile });
      console.log(res);
      toast({ title: "Phone number updated" });
    } catch (err: any) {
      toast({
        title: "Failed to update phone",
        description: err.response?.data?.message || "Try again.",
        variant: "destructive",
      });
    }
  };

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
                      {profile?.uid}
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
                    {profile?.lastSignInTime}
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
                      onChange={(e) => setMobile(e.target.value)}
                    />
                    <Button type="button" onClick={handlePhoneUpdate}>
                      Update
                    </Button>
                  </div>
                </div>

                {/* Update Password */}
                <form
                  onSubmit={handleSubmit(handlePasswordUpdate)}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-medium">Change Password</h4>

                  <div>
                    <Label>Current Password</Label>
                    <Input type="password" {...register("oldPassword")} />
                    {errors.oldPassword && (
                      <p className="text-sm text-red-500">
                        {errors.oldPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input type="password" {...register("newPassword")} />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input type="password" {...register("confirmPassword")} />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
