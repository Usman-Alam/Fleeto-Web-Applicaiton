"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut } from "next-auth/react";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

// Define the user type
export interface User {
  id: string;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  image?: string;
  role?: 'user' | 'admin' | 'restaurant';
  // Add any other user fields you need
}

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUserData: Partial<User>) => Promise<void>; // Add this line
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage or session for existing user data
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  // Login function
  const login = async (userData: User) => {
    try {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // New updateUser function
  const updateUser = async (updatedUserData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Merge current user data with updates
      const updatedUser = {
        ...user,
        ...updatedUserData
      };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  // Value to be provided by context
  const value = {
    user: session?.user
      ? {
          id: session.user.id || "",
          username: session.user.name || "",
          email: session.user.email || "",
          role: (["user", "admin", "restaurant"].includes(session.user.role || "") 
            ? session.user.role 
            : undefined) as 'user' | 'admin' | 'restaurant' | undefined,
        }
      : user,
    isAuthenticated: !!session?.user || isAuthenticated,
    login,
    logout,
    updateUser // Add the new function to context
  };

  if (isLoading) {
    // Return loading state or null
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}