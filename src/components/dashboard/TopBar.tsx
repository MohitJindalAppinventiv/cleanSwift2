// import { useState } from "react";
// import { Bell, User, Search, LogOut, Settings } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useAppSelector, useAppDispatch } from "@/hooks/redux";
// import { logoutUser } from "@/store/slices/authSlice";
// import { useNavigate } from "react-router-dom";
// import { toast } from "@/components/ui/sonner";
// import { clearProfile } from "@/store/slices/settingsSlice";

// export function TopBar() {
//   const isMobile = useIsMobile();
//   const [searchQuery, setSearchQuery] = useState("");
//   const dispatch = useAppDispatch();
//   const { user } = useAppSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const handleLogout = async() => {
//     await dispatch(logoutUser());
//     const response =  dispatch(clearProfile());
//     // console.log("clear profile response",response);
//     navigate("/login");
//     toast("Logged out successfully", {
//       description: "You have been logged out of your account.",
//     });
//     console.log("navigating");
//   };

//   return (
//     <div className="flex items-center justify-between h-16 px-4 border-b bg-white">
//       {!isMobile && (
//         <div className="relative max-w-md flex-1 mr-4">
//           {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search orders, customers..."
//             className="pl-8"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           /> */}
//         </div>
//       )}

//       <div className="flex items-center gap-2 ml-auto">
//         {/* <Button variant="ghost" size="icon" className="relative">
//           <Bell size={20} />
//           <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
//         </Button> */}

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
//                 <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
//               </Avatar>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56" align="end" forceMount>
//             {/* <DropdownMenuLabel className="font-normal">
//               <div className="flex flex-col space-y-1">
//                 <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
//                 <p className="text-xs leading-none text-muted-foreground">
//                   {user?.email || "user@example.com"}
//                 </p>
//               </div>
//             </DropdownMenuLabel> */}
//             {/* <DropdownMenuSeparator /> */}
//             {/* <DropdownMenuItem>
//               <User className="mr-2 h-4 w-4" />
//               <span>Profile</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Settings className="mr-2 h-4 w-4" />
//               <span>Settings</span>
//             </DropdownMenuItem> */}
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout}>
//               <LogOut className="mr-2 h-4 w-4" />
//               <span>Log out</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   );
// }

import React from "react";   

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-3">
        {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">CS</span>
        </div> */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CleanSwift</h1>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
