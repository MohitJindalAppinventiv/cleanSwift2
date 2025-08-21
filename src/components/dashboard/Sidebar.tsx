// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { cn } from "@/lib/utils";
// import {
//   Home,
//   Package,
//   Users,
//   Settings,
//   CreditCard,
//   Star,
//   Bell,
//   Menu,
//   X,
//   Server,
//   Smartphone,
//   MessageSquare,
//   Flag,
//   Cloud,
//   MapPin,
//   Tags,
//   ShoppingBag,
//   Ticket,
//   BookTemplate,
//   Eye,
//   AlarmCheck,
// } from "lucide-react";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { Button } from "@/components/ui/button";

// type SidebarItem = {
//   title: string;
//   icon: React.ElementType;
//   href: string;
//   subItems?: SidebarSubItem[];
// };

// type SidebarSubItem = {
//   title: string;
//   icon: React.ElementType;
//   href: string;
// };

// const sidebarItems: SidebarItem[] = [
//   { title: "Dashboard", icon: Home, href: "/" },
//   { title: "Orders", icon: Package, href: "/orders" },
//   { title: "Customers", icon: Users, href: "/customers" },
//   { title: "Payments", icon: CreditCard, href: "/payments" },
//   { title: "Reviews", icon: Star, href: "/reviews" },
//   { title: "Notifications", icon: Bell, href: "/notifications" },
//   {
//     title: "Config Management",
//     icon: Settings,
//     href: "/config",
//     subItems: [
//       { title: "Services", icon: Server, href: "/config/services" },
//       { title: "App Banner", icon: Flag, href: "/config/app-banner" },
//       { title: "FCM Config", icon: Cloud, href: "/config/fcm" },
//       { title: "Area Config", icon: MapPin, href: "/config/area" },
//       { title: "Categories", icon: Tags, href: "/config/categories" },
//       { title: "Products", icon: ShoppingBag, href: "/config/products" },
//       { title: "Coupons", icon: Ticket, href: "/config/coupons" },
//       {title:"Temp",icon:Eye,href:"/temp"},
//       {title:"Slots Config",icon:AlarmCheck,href:"/config/slots"}
//     ]
//   },
//   { title: "Settings", icon: Settings, href: "/settings" },
// ];

// export function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const isMobile = useIsMobile();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [expandedItems, setExpandedItems] = useState<string[]>([]);

//   const toggleSidebar = () => {
//     setCollapsed(!collapsed);
//   };

//   const toggleSubMenu = (title: string) => {
//     setExpandedItems(prev =>
//       prev.includes(title)
//         ? prev.filter(item => item !== title)
//         : [...prev, title]
//     );
//   };

//   if (isMobile) {
//     return (
//       <>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="fixed top-4 left-4 z-50"
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         >
//           <Menu size={24} />
//         </Button>

//         {mobileMenuOpen && (
//           <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
//             <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
//               <div className="flex items-center justify-between p-4 border-b">
//                 <div className="flex items-center">
//                   <span className="text-xl font-bold text-primary">CleanSwift</span>
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
//                   <X size={20} />
//                 </Button>
//               </div>
//               <nav className="p-2">
//                 {sidebarItems.map((item) => (
//                   <div key={item.title} className="mb-1">
//                     {item.subItems ? (
//                       <>
//                         <div
//                           className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground cursor-pointer"
//                           onClick={() => toggleSubMenu(item.title)}
//                         >
//                           <div className="flex items-center gap-3">
//                             <item.icon size={20} />
//                             <span>{item.title}</span>
//                           </div>
//                           <span>{expandedItems.includes(item.title) ? '−' : '+'}</span>
//                         </div>
//                         {expandedItems.includes(item.title) && (
//                           <div className="ml-8 mt-1 space-y-1">
//                             {item.subItems.map((subItem) => (
//                               <Link
//                                 key={subItem.title}
//                                 to={subItem.href}
//                                 className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground"
//                                 onClick={() => setMobileMenuOpen(false)}
//                               >
//                                 <subItem.icon size={16} />
//                                 <span>{subItem.title}</span>
//                               </Link>
//                             ))}
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <Link
//                         to={item.href}
//                         className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground"
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         <item.icon size={20} />
//                         <span>{item.title}</span>
//                       </Link>
//                     )}
//                   </div>
//                 ))}
//               </nav>
//             </div>
//           </div>
//         )}
//       </>
//     );
//   }

//   return (
//     <div
//       className={cn(
//         "h-screen flex flex-col border-r transition-all duration-300",
//         collapsed ? "w-16" : "w-64"
//       )}
//     >
//       <div className="flex items-center justify-between h-16 px-4 border-b">
//         {!collapsed && (
//           <span className="text-xl font-bold text-primary">CleanSwift</span>
//         )}
//         <Button
//           variant="ghost"
//           size="icon"
//           className={cn("ml-auto", collapsed && "mx-auto")}
//           onClick={toggleSidebar}
//         >
//           <Menu size={20} />
//         </Button>
//       </div>
//       <nav className="flex-1 p-2 overflow-y-auto scrollbar-hide">
//         {sidebarItems.map((item) => (
//           <div key={item.title} className="mb-1">
//             {item.subItems ? (
//               <>
//                 <div
//                   className={cn(
//                     "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground cursor-pointer",
//                     collapsed && "justify-center"
//                   )}
//                   onClick={() => !collapsed && toggleSubMenu(item.title)}
//                 >
//                   <item.icon size={20} />
//                   {!collapsed && (
//                     <>
//                       <span className="flex-1">{item.title}</span>
//                       <span>{expandedItems.includes(item.title) ? '−' : '+'}</span>
//                     </>
//                   )}
//                 </div>
//                 {!collapsed && expandedItems.includes(item.title) && (
//                   <div className="ml-8 mt-1 space-y-1">
//                     {item.subItems.map((subItem) => (
//                       <Link
//                         key={subItem.title}
//                         to={subItem.href}
//                         className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground"
//                       >
//                         <subItem.icon size={16} />
//                         <span>{subItem.title}</span>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Link
//                 to={item.href}
//                 className={cn(
//                   "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground",
//                   collapsed && "justify-center"
//                 )}
//               >
//                 <item.icon size={20} />
//                 {!collapsed && <span>{item.title}</span>}
//               </Link>
//             )}
//           </div>
//         ))}
//       </nav>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  Users,
  Settings,
  CreditCard,
  Star,
  Bell,
  Menu,
  X,
  Server,
  NotebookPen,
  Smartphone,
  MessageSquare,
  Flag,
  Cloud,
  MapPin,
  Tags,
  ShoppingBag,
  Ticket,
  BookTemplate,
  Eye,
  AlarmCheck,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/redux";
import { logoutUser } from "@/store/slices/authSlice";
import { clearProfile } from "@/store/slices/settingsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  subItems?: SidebarSubItem[];
};

type SidebarSubItem = {
  title: string;
  icon: React.ElementType;
  href: string;
};

const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", icon: Home, href: "/" },
  { title: "Orders", icon: Package, href: "/orders" },
  { title: "Customers", icon: Users, href: "/customers" },
  { title: "Payments", icon: CreditCard, href: "/payments" },
  { title: "Reviews", icon: Star, href: "/reviews" },
  { title: "Notifications", icon: Bell, href: "/notifications" },
  {
    title: "Config Management",
    icon: Settings,
    href: "/config",
    subItems: [
      { title: "Services", icon: Server, href: "/config/services" },
      { title: "App Banner", icon: Flag, href: "/config/app-banner" },
      { title: "FCM Config", icon: Cloud, href: "/config/fcm" },
      { title: "Area Config", icon: MapPin, href: "/config/area" },
      { title: "Categories", icon: Tags, href: "/config/categories" },
      { title: "Products", icon: ShoppingBag, href: "/config/products" },
      { title: "Coupons", icon: Ticket, href: "/config/coupons" },
      { title: "Content Manager", icon: NotebookPen, href: "/config/content" },
      { title: "Complaints", icon: MessageCircle, href: "/config/complaints" },
      { title: "Slots Config", icon: AlarmCheck, href: "/config/slots" },
    ],
  },
  { title: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSubMenu = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = async () => {
    setLoading(true); // Start loading
    try {
      const res = await dispatch(logoutUser());
      if (res.payload?.success) {
        await dispatch(clearProfile());
        navigate("/login");
        toast("Logged out successfully", {
          description: "You have been logged out of your account.",
        });
        console.log("navigating");
      } else {
        toast("Logout failed", {
          description: "An error occurred while logging out.",
        });
      }
    } catch (error) {
      toast("Logout failed", {
        description: "An unexpected error occurred.",
      });
      console.error("Logout error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={24} />
        </Button>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <span className="text-xl font-bold text-primary">
                    CleanSwift
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              <nav className="flex-1 p-2 overflow-y-auto">
                {sidebarItems.map((item) => (
                  <div key={item.title} className="mb-1">
                    {item.subItems ? (
                      <>
                        <div
                          className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground cursor-pointer"
                          onClick={() => toggleSubMenu(item.title)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={20} />
                            <span>{item.title}</span>
                          </div>
                          <span>
                            {expandedItems.includes(item.title) ? "−" : "+"}
                          </span>
                        </div>
                        {expandedItems.includes(item.title) && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.title}
                                to={subItem.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <subItem.icon size={16} />
                                <span>{subItem.title}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Logout Button for Mobile */}
              <div className="p-2 border-t">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600" />
                  ) : (
                    <LogOut size={20} />
                  )}
                  <span>{loading ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={cn(
        "h-screen flex flex-col border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-[85px] px-4 border-b">
        {!collapsed && (
          <span className="text-xl font-bold text-primary">CleanSwift</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto scrollbar-hide">
        {sidebarItems.map((item) => (
          <div key={item.title} className="mb-1">
            {item.subItems ? (
              <>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground cursor-pointer",
                    collapsed && "justify-center"
                  )}
                  onClick={() => !collapsed && toggleSubMenu(item.title)}
                >
                  <item.icon size={20} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      <span>
                        {expandedItems.includes(item.title) ? "−" : "+"}
                      </span>
                    </>
                  )}
                </div>
                {!collapsed && expandedItems.includes(item.title) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground"
                      >
                        <subItem.icon size={16} />
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground hover:text-foreground",
                  collapsed && "justify-center"
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button for Desktop */}
      <div className="p-2 border-t">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md w-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors",
            collapsed && "justify-center"
          )}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600" />
          ) : (
            <LogOut size={20} />
          )}
          {!collapsed && <span>{loading ? "Logging out..." : "Logout"}</span>}
        </button>
      </div>
    </div>
  );
}
