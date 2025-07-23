
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};
