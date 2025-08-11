// // // import React, { useEffect, useState } from "react";
// // // import { useForm } from "react-hook-form";
// // // import { z } from "zod";
// // // import { zodResolver } from "@hookform/resolvers/zod";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { AppDispatch } from "@/store/index"; // Adjust import path as needed
// // // import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "@/components/ui/card";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // import { User, Shield } from "lucide-react";
// // // import { toast } from "@/components/ui/use-toast";
// // // import {
// // //   fetchProfile,
// // //   updatePhoneNumber,
// // //   updatePassword,
// // //   selectProfile,
// // //   selectProfileLoading,
// // //   selectProfileError,
// // //   clearError,
// // // } from "../store/slices/settingsSlice"; // Adjust import path as needed

// // // const passwordSchema = z
// // //   .object({
// // //     oldPassword: z.string().min(6),
// // //     newPassword: z.string().min(6),
// // //     confirmPassword: z.string().min(6),
// // //   })
// // //   .refine((data) => data.newPassword === data.confirmPassword, {
// // //     message: "New password and confirm password must match",
// // //     path: ["confirmPassword"],
// // //   })
// // //   .refine((data) => data.oldPassword !== data.newPassword, {
// // //     message: "New password must be different from old password",
// // //     path: ["newPassword"],
// // //   });

// // // export default function SettingsPage() {
// // //   const dispatch = useDispatch<AppDispatch>();
// // //   const profile = useSelector(selectProfile);
// // //   const loading = useSelector(selectProfileLoading);
// // //   const error = useSelector(selectProfileError);

// // //   const [mobile, setMobile] = useState("");

// // //   const {
// // //     register,
// // //     handleSubmit,
// // //     formState: { errors },
// // //     reset,
// // //   } = useForm({
// // //     resolver: zodResolver(passwordSchema),
// // //   });

// // //   // Initialize mobile number from profile when profile is loaded
// // //   useEffect(() => {
// // //     if (profile?.phoneNumber) {
// // //       setMobile(profile.phoneNumber.substring(3));
// // //     }
// // //   }, [profile]);

// // //   // Fetch profile on component mount
// // //   useEffect(() => {
// // //     if (!profile) {
// // //       dispatch(fetchProfile());
// // //     }
// // //   }, [dispatch, profile]);

// // //   // Handle errors from Redux state
// // //   useEffect(() => {
// // //     if (error) {
// // //       toast({
// // //         title: "Error",
// // //         description: error,
// // //         variant: "destructive",
// // //       });
// // //       dispatch(clearError());
// // //     }
// // //   }, [error, dispatch]);

// // //   const handlePasswordUpdate = async (data: any) => {
// // //     try {
// // //       const result = await dispatch(
// // //         updatePassword({
// // //           oldPassword: data.oldPassword,
// // //           newPassword: data.newPassword,
// // //         })
// // //       ).unwrap();
      
// // //       toast({ title: "Password updated successfully!" });
// // //       reset();
// // //     } catch (err: any) {
// // //       // Error is already handled by the useEffect above
// // //       // This catch block ensures the form doesn't break if there's an error
// // //     }
// // //   };

// // //   const handlePhoneUpdate = async () => {
// // //     // Only update if the mobile number has actually changed
// // //     const changeMobile=`+91${mobile}`
// // //     if (changeMobile === profile?.phoneNumber) {
// // //       toast({
// // //         title: "No changes",
// // //         description: "Phone number is the same as current number",
// // //         variant: "default",
// // //       });
// // //       return;
// // //     }

// // //     try {
// // //       await dispatch(updatePhoneNumber(changeMobile)).unwrap();
// // //       toast({ title: "Phone number updated successfully!" });
// // //     } catch (err: any) {
// // //       // Error is already handled by the useEffect above
// // //       // Reset mobile to original value if update failed
// // //       setMobile(profile?.phoneNumber || "");
// // //     }
// // //   };

// // //   if (loading && !profile) {
// // //     return (
// // //       <DashboardLayout>
// // //         <div className="flex items-center justify-center h-96">
// // //           <div className="text-center">
// // //             <p>Loading profile...</p>
// // //           </div>
// // //         </div>
// // //       </DashboardLayout>
// // //     );
// // //   }

// // //   return (
// // //     <DashboardLayout>
// // //       <div className="space-y-6">
// // //         <div>
// // //           <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
// // //           <p className="text-muted-foreground">
// // //             Manage your account settings and preferences
// // //           </p>
// // //         </div>

// // //         <Tabs defaultValue="profile" className="space-y-4">
// // //           <TabsList>
// // //             <TabsTrigger value="profile" className="flex items-center gap-2">
// // //               <User className="h-4 w-4" />
// // //               Profile
// // //             </TabsTrigger>
// // //             <TabsTrigger value="security" className="flex items-center gap-2">
// // //               <Shield className="h-4 w-4" />
// // //               Security
// // //             </TabsTrigger>
// // //           </TabsList>

// // //           <TabsContent value="profile">
// // //             <Card>
// // //               <CardHeader>
// // //                 <CardTitle>Profile Information</CardTitle>
// // //                 <CardDescription>Your details and contact info</CardDescription>
// // //               </CardHeader>
// // //               <CardContent className="space-y-4">
// // //                 <div className="grid grid-cols-2 gap-4">
// // //                   <div>
// // //                     <Label>ID</Label>
// // //                     <p className="text-muted-foreground">
// // //                       {profile?.uid || "-"}
// // //                     </p>
// // //                   </div>
// // //                   <div>
// // //                     <Label>Full Name</Label>
// // //                     <p className="text-muted-foreground">
// // //                       {profile?.displayName || "-"}
// // //                     </p>
// // //                   </div>
// // //                   <div>
// // //                     <Label>Email</Label>
// // //                     <p className="text-muted-foreground">
// // //                       {profile?.email || "-"}
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 <div>
// // //                   <Label>Phone Number</Label>
// // //                   <p className="text-muted-foreground">
// // //                     {profile?.phoneNumber || "-"}
// // //                   </p>
// // //                 </div>
// // //                 <div>
// // //                   <Label>Role</Label>
// // //                   <p className="text-muted-foreground">
// // //                     {profile?.role || "-"}
// // //                   </p>
// // //                 </div>
// // //                 <div>
// // //                   <Label>Email Verified</Label>
// // //                   <p className="text-muted-foreground">
// // //                     {profile?.emailVerified ? "Yes" : "No"}
// // //                   </p>
// // //                 </div>
// // //                 <div>
// // //                   <Label>Last Logged In</Label>
// // //                   <p className="text-muted-foreground">
// // //                     {profile?.lastSignInTime || "-"}
// // //                   </p>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </TabsContent>

// // //           <TabsContent value="security">
// // //             <Card>
// // //               <CardHeader>
// // //                 <CardTitle>Security Settings</CardTitle>
// // //                 <CardDescription>
// // //                   Change phone number or password
// // //                 </CardDescription>
// // //               </CardHeader>
// // //               <CardContent className="space-y-6">
// // //                 {/* Update Phone Number */}
// // //                 <div className="space-y-2">
// // //                   <Label>Phone Number</Label>
// // //                   <div className="flex gap-2">
// // //                     <Input
// // //                       type="tel"
// // //                       value={mobile}
// // //                       onChange={(e) => setMobile(`${e.target.value}`)}
// // //                       disabled={loading}
// // //                     />
// // //                     <Button 
// // //                       type="button" 
// // //                       onClick={handlePhoneUpdate}
// // //                       disabled={loading || mobile === profile?.phoneNumber}
// // //                     >
// // //                       {loading ? "Updating..." : "Update"}
// // //                     </Button>
// // //                   </div>
// // //                   {mobile !== profile?.phoneNumber && (
// // //                     <p className="text-sm text-muted-foreground">
// // //                       Phone number will be updated from "{profile?.phoneNumber || 'Not set'}" to "{mobile}"
// // //                     </p>
// // //                   )}
// // //                 </div>

// // //                 {/* Update Password */}
// // //                 <form
// // //                   onSubmit={handleSubmit(handlePasswordUpdate)}
// // //                   className="space-y-4"
// // //                 >
// // //                   <h4 className="text-sm font-medium">Change Password</h4>

// // //                   <div>
// // //                     <Label>Current Password</Label>
// // //                     <Input 
// // //                       type="password" 
// // //                       {...register("oldPassword")} 
// // //                       disabled={loading}
// // //                     />
// // //                     {errors.oldPassword && (
// // //                       <p className="text-sm text-red-500">
// // //                         {errors.oldPassword.message}
// // //                       </p>
// // //                     )}
// // //                   </div>
// // //                   <div>
// // //                     <Label>New Password</Label>
// // //                     <Input 
// // //                       type="password" 
// // //                       {...register("newPassword")} 
// // //                       disabled={loading}
// // //                     />
// // //                     {errors.newPassword && (
// // //                       <p className="text-sm text-red-500">
// // //                         {errors.newPassword.message}
// // //                       </p>
// // //                     )}
// // //                   </div>
// // //                   <div>
// // //                     <Label>Confirm New Password</Label>
// // //                     <Input 
// // //                       type="password" 
// // //                       {...register("confirmPassword")} 
// // //                       disabled={loading}
// // //                     />
// // //                     {errors.confirmPassword && (
// // //                       <p className="text-sm text-red-500">
// // //                         {errors.confirmPassword.message}
// // //                       </p>
// // //                     )}
// // //                   </div>
// // //                   <Button type="submit" disabled={loading}>
// // //                     {loading ? "Updating..." : "Update Password"}
// // //                   </Button>
// // //                 </form>
// // //               </CardContent>
// // //             </Card>
// // //           </TabsContent>
// // //         </Tabs>
// // //       </div>
// // //     </DashboardLayout>
// // //   );
// // // }


// // import React, { useEffect, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useDispatch, useSelector } from "react-redux";
// // import { AppDispatch } from "@/store/index";
// // import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // import { User, Shield } from "lucide-react";
// // import { toast } from "@/components/ui/use-toast";
// // import {
// //   fetchProfile,
// //   updatePhoneNumber,
// //   updatePassword,
// //   selectProfile,
// //   selectProfileLoading,
// //   selectProfileError,
// //   clearError,
// // } from "../store/slices/settingsSlice";

// // const passwordSchema = z
// //   .object({
// //     oldPassword: z.string().min(6),
// //     newPassword: z.string().min(6),
// //     confirmPassword: z.string().min(6),
// //   })
// //   .refine((data) => data.newPassword === data.confirmPassword, {
// //     message: "New password and confirm password must match",
// //     path: ["confirmPassword"],
// //   })
// //   .refine((data) => data.oldPassword !== data.newPassword, {
// //     message: "New password must be different from old password",
// //     path: ["newPassword"],
// //   });

// // const Skeleton = () => (
// //   <div className="animate-pulse space-y-4">
// //     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
// //     <div className="h-4 bg-gray-200 rounded w-1/2"></div>
// //     <div className="h-4 bg-gray-200 rounded w-2/3"></div>
// //   </div>
// // );

// // const InputSkeleton = () => (
// //   <div className="animate-pulse">
// //     <div className="h-10 bg-gray-200 rounded w-full"></div>
// //   </div>
// // );

// // export default function SettingsPage() {
// //   const dispatch = useDispatch<AppDispatch>();
// //   const profile = useSelector(selectProfile);
// //   const loading = useSelector(selectProfileLoading);
// //   const error = useSelector(selectProfileError);

// //   const [mobile, setMobile] = useState("");

// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //     reset,
// //   } = useForm({
// //     resolver: zodResolver(passwordSchema),
// //   });

// //   useEffect(() => {
// //     if (profile?.phoneNumber) {
// //       setMobile(profile.phoneNumber.substring(3));
// //     }
// //   }, [profile]);

// //   useEffect(() => {
// //     if (!profile) {
// //       dispatch(fetchProfile());
// //     }
// //   }, [dispatch, profile]);

// //   useEffect(() => {
// //     if (error) {
// //       toast({
// //         title: "Error",
// //         description: error,
// //         variant: "destructive",
// //       });
// //       dispatch(clearError());
// //     }
// //   }, [error, dispatch]);

// //   const handlePasswordUpdate = async (data: any) => {
// //     try {
// //       await dispatch(
// //         updatePassword({
// //           oldPassword: data.oldPassword,
// //           newPassword: data.newPassword,
// //         })
// //       ).unwrap();
// //       toast({ title: "Password updated successfully!" });
// //       reset();
// //     } catch (err: any) {
// //       // Error handled by useEffect
// //     }
// //   };

// //   const handlePhoneUpdate = async () => {
// //     const changeMobile = `+91${mobile}`;
// //     if (changeMobile === profile?.phoneNumber) {
// //       toast({
// //         title: "No changes",
// //         description: "Phone number is the same as current number",
// //         variant: "default",
// //       });
// //       return;
// //     }

// //     try {
// //       await dispatch(updatePhoneNumber(changeMobile)).unwrap();
// //       toast({ title: "Phone number updated successfully!" });
// //     } catch (err: any) {
// //       setMobile(profile?.phoneNumber?.substring(3) || "");
// //     }
// //   };

// //   if (loading && !profile) {
// //     return (
// //       <DashboardLayout>
// //         <div className="max-w-4xl mx-auto py-8">
// //           <div className="space-y-6">
// //             <div className="space-y-2">
// //               <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
// //               <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
// //             </div>
// //             <Skeleton />
// //           </div>
// //           </div>
// //         </DashboardLayout>
// //       );
// //   }

// //   return (
// //     <DashboardLayout>
// //       <div className="max-w-4xl mx-auto py-8 space-y-8">
// //         <div className="space-y-2">
// //           <h2 className="text-3xl font-bold tracking-tight text-gray-900">
// //             Settings
// //           </h2>
// //           <p className="text-gray-500 text-sm">
// //             Manage your account settings and preferences
// //           </p>
// //         </div>

// //         <Tabs defaultValue="profile" className="space-y-6">
// //           <TabsList className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
// //             <TabsTrigger
// //               value="profile"
// //               className="flex items-center gap-2 rounded-md py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
// //             >
// //               <User className="h-4 w-4" />
// //               Profile
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="security"
// //               className="flex items-center gap-2 rounded-md py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
// //             >
// //               <Shield className="h-4 w-4" />
// //               Security
// //             </TabsTrigger>
// //           </TabsList>

// //           <TabsContent value="profile">
// //             <Card className="border-0 shadow-lg rounded-xl">
// //               <CardHeader className="border-b border-gray-100">
// //                 <CardTitle className="text-xl">Profile Information</CardTitle>
// //                 <CardDescription className="text-gray-500">
// //                   Your details and contact info
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardContent className="pt-6 space-y-6">
// //                 {loading ? (
// //                   <Skeleton />
// //                 ) : (
// //                   <>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">ID</Label>
// //                         <p className="text-gray-500">{profile?.uid || "-"}</p>
// //                       </div>
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">Full Name</Label>
// //                         <p className="text-gray-500">{profile?.displayName || "-"}</p>
// //                       </div>
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">Email</Label>
// //                         <p className="text-gray-500">{profile?.email || "-"}</p>
// //                       </div>
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
// //                         <p className="text-gray-500">{profile?.phoneNumber || "-"}</p>
// //                       </div>
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">Role</Label>
// //                         <p className="text-gray-500">{profile?.role || "-"}</p>
// //                       </div>
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">Email Verified</Label>
// //                         <p className="text-gray-500">{profile?.emailVerified ? "Yes" : "No"}</p>
// //                       </div>
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">Last Logged In</Label>
// //                         <p className="text-gray-500">{profile?.lastSignInTime || "-"}</p>
// //                       </div>
// //                     </div>
// //                   </>
// //                 )}
// //               </CardContent>
// //             </Card>
// //           </TabsContent>

// //           <TabsContent value="security">
// //             <Card className="border-0 shadow-lg rounded-xl">
// //               <CardHeader className="border-b border-gray-100">
// //                 <CardTitle className="text-xl">Security Settings</CardTitle>
// //                 <CardDescription className="text-gray-500">
// //                   Change phone number or password
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardContent className="pt-6 space-y-8">
// //                 <div className="space-y-4">
// //                   <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
// //                   {loading ? (
// //                     <InputSkeleton />
// //                   ) : (
// //                     <div className="flex flex-col sm:flex-row gap-3">
// //                       <Input
// //                         type="tel"
// //                         value={mobile}
// //                         onChange={(e) => setMobile(`${e.target.value}`)}
// //                         disabled={loading}
// //                         className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500"
// //                         placeholder="Enter phone number"
// //                       />
// //                       <Button
// //                         type="button"
// //                         onClick={handlePhoneUpdate}
// //                         disabled={loading || mobile === profile?.phoneNumber?.substring(3)}
// //                         className="h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
// //                       >
// //                         {loading ? "Updating..." : "Update"}
// //                       </Button>
// //                     </div>
// //                   )}
// //                   {mobile !== profile?.phoneNumber?.substring(3) && !loading && (
// //                     <p className="text-sm text-gray-500">
// //                       Phone number will be updated from "{profile?.phoneNumber || 'Not set'}" to "+91{mobile}"
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div className="space-y-4">
// //                   <h4 className="text-sm font-medium text-gray-700">Change Password</h4>
// //                   {loading ? (
// //                     <Skeleton />
// //                   ) : (
// //                     <div className="space-y-4">
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">Current Password</Label>
// //                         {loading ? (
// //                           <InputSkeleton />
// //                         ) : (
// //                           <Input
// //                             type="password"
// //                             {...register("oldPassword")}
// //                             disabled={loading}
// //                             className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500"
// //                           />
// //                         )}
// //                         {errors.oldPassword && (
// //                           <p className="text-sm text-red-500">{errors.oldPassword.message}</p>
// //                         )}
// //                       </div>
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">New Password</Label>
// //                         {loading ? (
// //                           <InputSkeleton />
// //                         ) : (
// //                           <Input
// //                             type="password"
// //                             {...register("newPassword")}
// //                             disabled={loading}
// //                             className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500"
// //                           />
// //                         )}
// //                         {errors.newPassword && (
// //                           <p className="text-sm text-red-500">{errors.newPassword.message}</p>
// //                         )}
// //                       </div>
// //                       <div className="space-y-1">
// //                         <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
// //                         {loading ? (
// //                           <InputSkeleton />
// //                         ) : (
// //                           <Input
// //                             type="password"
// //                             {...register("confirmPassword")}
// //                             disabled={loading}
// //                             className="h-10 rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500"
// //                           />
// //                         )}
// //                         {errors.confirmPassword && (
// //                           <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
// //                         )}
// //                       </div>
// //                       <Button
// //                         type="button"
// //                         onClick={handleSubmit(handlePasswordUpdate)}
// //                         disabled={loading}
// //                         className="h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
// //                       >
// //                         {loading ? "Updating..." : "Update Password"}
// //                       </Button>
// //                     </div>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </TabsContent>
// //         </Tabs>
// //       </div>
// //     </DashboardLayout>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/store/index";
// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { 
//   User, 
//   Shield, 
//   Phone, 
//   Mail, 
//   Key, 
//   Eye, 
//   EyeOff,
//   CheckCircle,
//   XCircle,
//   Calendar,
//   UserCheck,
//   Hash
// } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
// import {
//   fetchProfile,
//   updatePhoneNumber,
//   updatePassword,
//   selectProfile,
//   selectProfileLoading,
//   selectProfileError,
//   clearError,
// } from "../store/slices/settingsSlice";

// const passwordSchema = z
//   .object({
//     oldPassword: z.string().min(6),
//     newPassword: z.string().min(6),
//     confirmPassword: z.string().min(6),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: "New password and confirm password must match",
//     path: ["confirmPassword"],
//   })
//   .refine((data) => data.oldPassword !== data.newPassword, {
//     message: "New password must be different from old password",
//     path: ["newPassword"],
//   });

// // Enhanced Skeleton Components
// const ProfileSkeleton = () => (
//   <div className="space-y-6">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {Array.from({ length: 6 }).map((_, i) => (
//         <div key={i} className="space-y-2">
//           <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
//           <div className="h-5 bg-gray-100 rounded-md w-full animate-pulse"></div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const InputSkeleton = () => (
//   <div className="space-y-2">
//     <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
//     <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse"></div>
//   </div>
// );

// const SecuritySkeleton = () => (
//   <div className="space-y-8">
//     <div className="space-y-4">
//       <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
//       <div className="flex gap-3">
//         <div className="flex-1 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
//         <div className="w-24 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
//       </div>
//     </div>
//     <Separator />
//     <div className="space-y-4">
//       <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
//       {Array.from({ length: 3 }).map((_, i) => (
//         <div key={i} className="space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
//           <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
//         </div>
//       ))}
//       <div className="w-32 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
//     </div>
//   </div>
// );

// export default function SettingsPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const profile = useSelector(selectProfile);
//   const loading = useSelector(selectProfileLoading);
//   const error = useSelector(selectProfileError);

//   const [mobile, setMobile] = useState("");
//   const [showPasswords, setShowPasswords] = useState({
//     old: false,
//     new: false,
//     confirm: false,
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     watch,
//   } = useForm({
//     resolver: zodResolver(passwordSchema),
//   });

//   const watchedValues = watch();

//   useEffect(() => {
//     if (profile?.phoneNumber) {
//       setMobile(profile.phoneNumber.substring(3));
//     }
//   }, [profile]);

//   useEffect(() => {
//     if (!profile) {
//       dispatch(fetchProfile());
//     }
//   }, [dispatch, profile]);

//   useEffect(() => {
//     if (error) {
//       toast({
//         title: "Error",
//         description: error,
//         variant: "destructive",
//       });
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const handlePasswordUpdate = async (data: any) => {
//     try {
//       await dispatch(
//         updatePassword({
//           oldPassword: data.oldPassword,
//           newPassword: data.newPassword,
//         })
//       ).unwrap();
//       toast({ 
//         title: "Success!",
//         description: "Password updated successfully",
//       });
//       reset();
//     } catch (err: any) {
//       // Error handled by useEffect
//     }
//   };

//   const handlePhoneUpdate = async () => {
//     const changeMobile = `+91${mobile}`;
//     if (changeMobile === profile?.phoneNumber) {
//       toast({
//         title: "No Changes",
//         description: "Phone number is the same as current number",
//         variant: "default",
//       });
//       return;
//     }

//     try {
//       await dispatch(updatePhoneNumber(changeMobile)).unwrap();
//       toast({ 
//         title: "Success!",
//         description: "Phone number updated successfully",
//       });
//     } catch (err: any) {
//       setMobile(profile?.phoneNumber?.substring(3) || "");
//     }
//   };

//   const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
//     setShowPasswords(prev => ({
//       ...prev,
//       [field]: !prev[field]
//     }));
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "-";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const isPhoneChanged = mobile !== profile?.phoneNumber?.substring(3);
//   const hasPasswordValues = watchedValues.oldPassword || watchedValues.newPassword || watchedValues.confirmPassword;

//   if (loading && !profile) {
//     return (
//       <DashboardLayout>
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//           <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//             <div className="space-y-8">
//               {/* Header Skeleton */}
//               <div className="space-y-4">
//                 <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4 animate-pulse"></div>
//                 <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
//               </div>
              
//               {/* Tabs Skeleton */}
//               <div className="h-12 bg-white rounded-xl shadow-sm animate-pulse"></div>
              
//               {/* Card Skeleton */}
//               <div className="bg-white rounded-2xl shadow-lg border-0 p-8">
//                 <ProfileSkeleton />
//               </div>
//             </div>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//         <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//           <div className="space-y-8">
//             {/* Enhanced Header */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//                   <User className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                     Settings
//                   </h1>
//                   <p className="text-gray-600 mt-1">
//                     Manage your account settings and security preferences
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <Tabs defaultValue="profile" className="space-y-8">
//               {/* Enhanced Tab Navigation */}
//               <TabsList className="grid w-full max-w-md grid-cols-2 h-14 bg-white rounded-xl shadow-lg border-0 p-2">
//                 <TabsTrigger
//                   value="profile"
//                   className="flex items-center gap-3 rounded-lg py-3 px-4 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
//                 >
//                   <User className="h-4 w-4" />
//                   Profile
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="security"
//                   className="flex items-center gap-3 rounded-lg py-3 px-4 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
//                 >
//                   <Shield className="h-4 w-4" />
//                   Security
//                 </TabsTrigger>
//               </TabsList>

//               {/* Profile Tab */}
//               <TabsContent value="profile" className="space-y-6">
//                 <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
//                   <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-100 rounded-lg">
//                         <User className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <CardTitle className="text-xl text-gray-900">Profile Information</CardTitle>
//                         <CardDescription className="text-gray-600">
//                           Your personal details and account information
//                         </CardDescription>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="pt-8 pb-8 px-8">
//                     {loading ? (
//                       <ProfileSkeleton />
//                     ) : (
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         {/* User ID */}
//                         <div className="group space-y-3">
//                           <div className="flex items-center gap-2">
//                             <Hash className="h-4 w-4 text-gray-400" />
//                             <Label className="text-sm font-semibold text-gray-700">User ID</Label>
//                           </div>
//                           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
//                             <p className="text-gray-700 font-mono text-sm break-all">{profile?.uid || "-"}</p>
//                           </div>
//                         </div>

//                         {/* Full Name */}
//                         <div className="group space-y-3">
//                           <div className="flex items-center gap-2">
//                             <UserCheck className="h-4 w-4 text-gray-400" />
//                             <Label className="text-sm font-semibold text-gray-700">Full Name</Label>
//                           </div>
//                           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
//                             <p className="text-gray-700 font-medium">{profile?.displayName || "Not set"}</p>
//                           </div>
//                         </div>

//                         {/* Email */}
//                         <div className="group space-y-3">
//                           <div className="flex items-center gap-2">
//                             <Mail className="h-4 w-4 text-gray-400" />
//                             <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
//                           </div>
//                           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
//                             <p className="text-gray-700">{profile?.email || "Not set"}</p>
//                           </div>
//                         </div>

//                         {/* Phone */}
//                         <div className="group space-y-3">
//                           <div className="flex items-center gap-2">
//                             <Phone className="h-4 w-4 text-gray-400" />
//                             <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
//                           </div>
//                           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
//                             <p className="text-gray-700">{profile?.phoneNumber || "Not set"}</p>
//                           </div>
//                         </div>

//                         {/* Role */}
//                         <div className="group space-y-3">
//                           <div className="flex items-center gap-2">
//                             <Shield className="h-4 w-4 text-gray-400" />
//                             <Label className="text-sm font-semibold text-gray-700">Role</Label>
//                           </div>
//                           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
//                             <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
//                               {profile?.role || "User"}
//                             </Badge>
//                           </div>
//                         </div>

//                         {/* Email Verification */}
//                         <div className="group space-y-3">
//                           <div className="flex items-center gap-2">
//                             <Mail className="h-4 w-4 text-gray-400" />
//                             <Label className="text-sm font-semibold text-gray-700">Email Status</Label>
//                           </div>
//                           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
//                             <div className="flex items-center gap-2">
//                               {profile?.emailVerified ? (
//                                 <>
//                                   <CheckCircle className="h-4 w-4 text-green-500" />
//                                   <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
//                                     Verified
//                                   </Badge>
//                                 </>
//                               ) : (
//                                 <>
//                                   <XCircle className="h-4 w-4 text-red-500" />
//                                   <Badge variant="destructive" className="bg-red-100 text-red-800">
//                                     Not Verified
//                                   </Badge>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Last Login */}
//                         <div className="group space-y-3 lg:col-span-2">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="h-4 w-4 text-gray-400" />
//                             <Label className="text-sm font-semibold text-gray-700">Last Login</Label>
//                           </div>
//                           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
//                             <p className="text-gray-700">{formatDate(profile?.lastSignInTime)}</p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Security Tab */}
//               <TabsContent value="security" className="space-y-6">
//                 <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
//                   <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-2xl">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-orange-100 rounded-lg">
//                         <Shield className="h-5 w-5 text-orange-600" />
//                       </div>
//                       <div>
//                         <CardTitle className="text-xl text-gray-900">Security Settings</CardTitle>
//                         <CardDescription className="text-gray-600">
//                           Manage your phone number and password
//                         </CardDescription>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="pt-8 pb-8 px-8">
//                     {loading ? (
//                       <SecuritySkeleton />
//                     ) : (
//                       <div className="space-y-10">
//                         {/* Phone Number Section */}
//                         <div className="space-y-6">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-blue-100 rounded-lg">
//                               <Phone className="h-4 w-4 text-blue-600" />
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-900">Phone Number</h3>
//                           </div>
                          
//                           <div className="bg-gray-50 rounded-xl p-6 space-y-4">
//                             <Label className="text-sm font-medium text-gray-700">
//                               Current: {profile?.phoneNumber || "Not set"}
//                             </Label>
                            
//                             <div className="flex flex-col sm:flex-row gap-3">
//                               <div className="relative flex-1">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                   <span className="text-gray-500 text-sm">+91</span>
//                                 </div>
//                                 <Input
//                                   type="tel"
//                                   value={mobile}
//                                   onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
//                                   disabled={loading}
//                                   className="pl-12 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                   placeholder="Enter phone number"
//                                 />
//                               </div>
//                               <Button
//                                 type="button"
//                                 onClick={handlePhoneUpdate}
//                                 disabled={loading || !isPhoneChanged}
//                                 className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                               >
//                                 {loading ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     Updating...
//                                   </div>
//                                 ) : (
//                                   "Update"
//                                 )}
//                               </Button>
//                             </div>
                            
//                             {isPhoneChanged && !loading && (
//                               <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                 <p className="text-sm text-blue-800">
//                                   Phone number will be updated to: <span className="font-medium">+91{mobile}</span>
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         <Separator className="bg-gray-200" />

//                         {/* Password Section */}
//                         <div className="space-y-6">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-red-100 rounded-lg">
//                               <Key className="h-4 w-4 text-red-600" />
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
//                           </div>

//                           <div className="bg-gray-50 rounded-xl p-6">
//                             <form onSubmit={handleSubmit(handlePasswordUpdate)} className="space-y-6">
//                               {/* Current Password */}
//                               <div className="space-y-2">
//                                 <Label className="text-sm font-medium text-gray-700">Current Password</Label>
//                                 <div className="relative">
//                                   <Input
//                                     type={showPasswords.old ? "text" : "password"}
//                                     {...register("oldPassword")}
//                                     disabled={loading || isSubmitting}
//                                     className="pr-12 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                                     placeholder="Enter current password"
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={() => togglePasswordVisibility('old')}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                   >
//                                     {showPasswords.old ? (
//                                       <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     ) : (
//                                       <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     )}
//                                   </button>
//                                 </div>
//                                 {errors.oldPassword && (
//                                   <p className="text-sm text-red-500 flex items-center gap-1">
//                                     <XCircle className="h-4 w-4" />
//                                     {errors.oldPassword.message}
//                                   </p>
//                                 )}
//                               </div>

//                               {/* New Password */}
//                               <div className="space-y-2">
//                                 <Label className="text-sm font-medium text-gray-700">New Password</Label>
//                                 <div className="relative">
//                                   <Input
//                                     type={showPasswords.new ? "text" : "password"}
//                                     {...register("newPassword")}
//                                     disabled={loading || isSubmitting}
//                                     className="pr-12 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                                     placeholder="Enter new password"
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={() => togglePasswordVisibility('new')}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                   >
//                                     {showPasswords.new ? (
//                                       <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     ) : (
//                                       <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     )}
//                                   </button>
//                                 </div>
//                                 {errors.newPassword && (
//                                   <p className="text-sm text-red-500 flex items-center gap-1">
//                                     <XCircle className="h-4 w-4" />
//                                     {errors.newPassword.message}
//                                   </p>
//                                 )}
//                               </div>

//                               {/* Confirm Password */}
//                               <div className="space-y-2">
//                                 <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
//                                 <div className="relative">
//                                   <Input
//                                     type={showPasswords.confirm ? "text" : "password"}
//                                     {...register("confirmPassword")}
//                                     disabled={loading || isSubmitting}
//                                     className="pr-12 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                                     placeholder="Confirm new password"
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={() => togglePasswordVisibility('confirm')}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                   >
//                                     {showPasswords.confirm ? (
//                                       <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     ) : (
//                                       <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     )}
//                                   </button>
//                                 </div>
//                                 {errors.confirmPassword && (
//                                   <p className="text-sm text-red-500 flex items-center gap-1">
//                                     <XCircle className="h-4 w-4" />
//                                     {errors.confirmPassword.message}
//                                   </p>
//                                 )}
//                               </div>

//                               <Button
//                                 type="submit"
//                                 disabled={loading || isSubmitting || !hasPasswordValues}
//                                 className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                               >
//                                 {isSubmitting ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     Updating Password...
//                                   </div>
//                                 ) : (
//                                   <div className="flex items-center gap-2">
//                                     <Key className="h-4 w-4" />
//                                     Update Password
//                                   </div>
//                                 )}
//                               </Button>
//                             </form>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }


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
  Loader2
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
} from "../store/slices/settingsSlice";

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

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPhoneChanged = mobile !== profile?.phoneNumber?.substring(3);
  const hasPasswordValues = watchedValues.oldPassword || watchedValues.newPassword || watchedValues.confirmPassword;

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
                                <Badge variant="outline" className="text-green-700 border-green-200">
                                  Verified
                                </Badge>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <Badge variant="outline" className="text-red-700 border-red-200">
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
                              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
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
                            Phone number will be updated to: <strong>+91{mobile}</strong>
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

                      <form onSubmit={handleSubmit(handlePasswordUpdate)} className="space-y-4">
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
                              onClick={() => togglePasswordVisibility('old')}
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
                              onClick={() => togglePasswordVisibility('new')}
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
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                              onClick={() => togglePasswordVisibility('confirm')}
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
                          disabled={loading || isSubmitting || !hasPasswordValues}
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