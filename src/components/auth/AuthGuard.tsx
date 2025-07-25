
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { checkAuthStatus } from "@/store/slices/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  if (isLoading) {
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
