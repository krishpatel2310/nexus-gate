import React, { createContext, useContext, useState, useEffect } from "react";
import { usersService, getCurrentUserFromStorage } from "@/lib/api";
import type { SignInPayload, RegisterUserPayload, SignInResponse } from "@/lib/api";

interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: SignInPayload) => Promise<SignInResponse>;
  register: (payload: RegisterUserPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUserFromStorage();
    if (storedUser) setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = async (payload: SignInPayload): Promise<SignInResponse> => {
    const response = await usersService.signIn(payload);
    setUser({ userId: response.userId, email: response.email, fullName: response.fullName, role: response.role });
    return response;
  };

  const register = async (payload: RegisterUserPayload) => {
    await usersService.register(payload);
  };

  const logout = () => {
    usersService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
