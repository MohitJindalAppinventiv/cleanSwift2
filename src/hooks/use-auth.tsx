
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);
  
  // In a real application, this would connect to your authentication backend
  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    setIsLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo credentials (in real app would verify with backend)
        if (email === "admin@cleanswift.com" && password === "password") {
          const userData = {
            id: "1",
            email: email,
            name: "Admin",
          };
          
          // Save user data
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
