
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { checkAuthStatus } from "@/store/slices/authSlice";

interface PublicGuardProps {
  children: React.ReactNode;
}

export const PublicGuard= ({ children }: PublicGuardProps) => {
  // const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  

  if (isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }
  




  
  // Render children if authenticated
  return <>{children}</>;
};
