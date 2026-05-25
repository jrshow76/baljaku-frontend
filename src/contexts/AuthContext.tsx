'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (req: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (req: RegisterRequest) => Promise<void>;
  updateProfile: (data: { username: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getStoredUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (req: LoginRequest) => {
    const u = await authService.login(req);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const register = useCallback(async (req: RegisterRequest) => {
    const u = await authService.register(req);
    setUser(u);
  }, []);

  const updateProfile = useCallback(async (data: { username: string }) => {
    const u = await authService.updateProfile(data);
    setUser(u);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await authService.changePassword(currentPassword, newPassword);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
