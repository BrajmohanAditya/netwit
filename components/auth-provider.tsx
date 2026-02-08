"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const convex = useConvex();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await convex.query(api.auth.validateUser, { email, password });
      
      if (!userData) {
        return false;
      }

      const sessionId = crypto.randomUUID();
      await convex.mutation(api.auth.createSession, {
        sessionId,
        userId: String(userData.id),
        email: userData.email,
        name: userData.name,
        role: userData.role,
      });

      localStorage.setItem("sessionId", sessionId);
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      });
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        await convex.mutation(api.auth.deleteSession, { sessionId });
        localStorage.removeItem("sessionId");
      }
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        const session = await convex.query(api.auth.getSession, { sessionId });
        if (session) {
          setUser({
            id: session.userId,
            email: session.email,
            name: session.name,
            role: session.role,
          });
        } else {
          localStorage.removeItem("sessionId");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
