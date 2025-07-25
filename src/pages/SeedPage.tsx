// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import { toast } from "@/components/ui/sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { LogIn } from "lucide-react";
// import { useAppDispatch, useAppSelector } from "@/hooks/redux";
// import { loginUser, clearError } from "@/store/slices/authSlice";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Updated schema with new fields
// const loginSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   role: z.string().min(1, "Role is required"),
//   displayName: z.string().min(2, "Display name must be at least 2 characters"),
//   phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
//   secretKey: z.string().min(8, "Secret key must be at least 8 characters"),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const { toast: uiToast } = useToast();
//   const dispatch = useAppDispatch();
//   const { isLoading, error } = useAppSelector((state) => state.auth);
  
//   const form = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       role: "",
//       displayName: "",
//       phoneNumber: "",
//       secretKey: "",
//     },
//   });

//   useEffect(() => {
//     if (error) {
//       uiToast({
//         variant: "destructive",
//         title: "Login Failed",
//         description: error,
//       });
//       dispatch(clearError());
//     }
//   }, [error, uiToast, dispatch]);

// const onSubmit = async (data: LoginFormValues) => {
//   try {
//     // Just show the submitted data in console and display success message
//     console.log("User created:", data);
    
//     toast("User Created", {
//       description: "User credentials have been successfully created.",
//     });
    
//     // Optionally reset the form after submission
//     form.reset();
    
//   } catch (error) {
//     console.error("Error:", error);
//     toast("Error", {
//       description: "Failed to create user.",
//       variant: "destructive",
//     });
//   }
// };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
//           <CardDescription className="text-center">
//             Enter your credentials to access your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               {/* Email Field */}
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="email@example.com" 
//                         {...field} 
//                         disabled={isLoading}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Password Field */}
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="password" 
//                         placeholder="••••••••" 
//                         {...field} 
//                         disabled={isLoading}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Role Field (Select Dropdown) */}
//               <FormField
//                 control={form.control}
//                 name="role"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Role</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select your role" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="admin">Admin</SelectItem>
//                         <SelectItem value="user">User</SelectItem>
//                         <SelectItem value="moderator">Moderator</SelectItem>
//                         <SelectItem value="guest">Guest</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Display Name Field */}
//               <FormField
//                 control={form.control}
//                 name="displayName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Display Name</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="Your display name" 
//                         {...field} 
//                         disabled={isLoading}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Phone Number Field */}
//               <FormField
//                 control={form.control}
//                 name="phoneNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone Number</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="tel" 
//                         placeholder="123-456-7890" 
//                         {...field} 
//                         disabled={isLoading}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Secret Key Field */}
//               <FormField
//                 control={form.control}
//                 name="secretKey"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Secret Key</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="password" 
//                         placeholder="Your secret key" 
//                         {...field} 
//                         disabled={isLoading}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button 
//                 type="submit" 
//                 className="w-full" 
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="flex items-center gap-2">
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
//                     Logging in...
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-2">
//                     <LogIn className="h-4 w-4" />
//                     Login 
//                   </span>
//                 )}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = "https://us-central1-laundry-app-dee6a.cloudfunctions.net/seedAdmin";

const adminSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  secret: z.string().min(8, "Secret key must be at least 8 characters"),
});

type AdminFormValues = z.infer<typeof adminSchema>;

export default function AdminCreationPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "admin", // Default to admin since we're creating admin
      displayName: "",
      phoneNumber: "",
      secret: "",
    },
  });

  const onSubmit = async (data: AdminFormValues) => {
    try {
      setIsLoading(true);
      console.log("Data in form: ", data);
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role:data.role,
          displayName: data.displayName,
          phoneNumber: data.phoneNumber,
          secret: data.secret,
        }),
      });
      console.log("response",response);

      const result = await response.json();
    console.log(result);
      if (!response.ok) {
        throw new Error(result.message || "Failed to create admin user");
      }

    //   toast("Admin Created", {
    //     description: "Admin account has been successfully created.",
    //   });
      
      form.reset();
    } catch (error) {
      console.error("Error:", error);
    //   toast("Error", {
    //     description: error instanceof Error ? error.message : "Failed to create admin user",
    //     variant: "destructive",
    //   });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Admin Account</CardTitle>
          <CardDescription className="text-center">
            Enter admin details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@example.com" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled // Role is fixed as admin
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select 
        onValueChange={field.onChange} 
        value={field.value}
        disabled
      >
        <FormControl>
          <SelectTrigger>
            {/* Only show placeholder if no value is set */}
            <SelectValue placeholder={field.value ? undefined : "Select role"} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Admin Name" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="123-456-7890" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Your secret key" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Creating Admin...
                  </span>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}