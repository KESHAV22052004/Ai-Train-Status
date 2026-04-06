"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type AlertRule } from "@/services/api";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const checkAuth = async () => {
      try {
        const guestState = localStorage.getItem("aitrain_guest");
        if (guestState === "true") {
          setIsGuest(true);
        }

        const token = localStorage.getItem("token");
        if (token) {
          // Verify token by calling /api/auth/me
          const res = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.removeItem("aitrain_guest");
    setUser(userData);
    setIsAuthenticated(true);
    setIsGuest(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(true); // Default back to guest mode or prompt login
  };

  const continueAsGuest = () => {
    localStorage.setItem("aitrain_guest", "true");
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isGuest,
        user,
        isLoading,
        login,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
