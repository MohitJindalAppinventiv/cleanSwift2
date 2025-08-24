
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";

interface AuthGuardProps {
  children: React.ReactNode;
}

// export const AuthGuard = ({ children }: AuthGuardProps) => {
//   // const dispatch = useAppDispatch();
//   const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }
  
//   if (!isAuthenticated) {
//     // Redirect to login if not authenticated
//     return <Navigate to="/login" replace />;
//   }
  
//   // Render children if authenticated
//   return <>{children}</>;
// };


export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );
  const { data: profileData, isLoading: profileLoading } = useAppSelector(
    (state) => state.profileStatus
  );

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (profileData && !profileData.isComplete) {
    const configs = profileData.configurations;

    if (configs.banner?.isConfigured === false) {
      return <Navigate to="/AppBanner" replace />;
    } else if (configs.area?.isConfigured === false) {
      return <Navigate to="/area-config" replace />;
    } else if (configs.service?.isConfigured === false) {
      return <Navigate to="/Serv" replace />;
    }
  }

  return <>{children}</>;
};

