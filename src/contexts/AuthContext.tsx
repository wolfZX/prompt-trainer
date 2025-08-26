'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, UserType, GuestUser } from '@/types';
import { AuthService } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const existingUser = AuthService.getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
    } else {
      // Check for guest user
      const guestUser = AuthService.getGuestUser();
      if (guestUser) {
        setUser(guestUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await AuthService.login(username, password);
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const result = await AuthService.signup(username, email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const startGuestSession = () => {
    const guestUser = AuthService.createGuestUser();
    setUser(guestUser);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AuthService.updateUser(updatedUser);
  };

  const updateGuestUser = (updatedGuestUser: GuestUser) => {
    setUser(updatedGuestUser);
    AuthService.updateGuestUser(updatedGuestUser);
  };

  const isAuthenticated = user !== null && !('isGuest' in user);
  const isGuest = user !== null && 'isGuest' in user;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated,
        isGuest,
        startGuestSession,
        updateUser,
        updateGuestUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Extend the AuthContextType to include additional methods
declare module '@/types' {
  interface AuthContextType {
    startGuestSession: () => void;
    updateUser: (user: User) => void;
    updateGuestUser: (guestUser: GuestUser) => void;
  }
}