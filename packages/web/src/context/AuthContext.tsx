'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: 'AUDITOR' | 'ARTIST' | 'LABEL' | 'ADMIN';
  referralCode: string;
  token: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('cashplay_token');
    const savedUser = localStorage.getItem('cashplay_user');
    if (savedToken && savedUser) {
      try {
        setUser({ ...JSON.parse(savedUser), token: savedToken });
      } catch (e) {
        localStorage.removeItem('cashplay_token');
        localStorage.removeItem('cashplay_user');
      }
    }
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem('cashplay_token', token);
    localStorage.setItem('cashplay_user', JSON.stringify(userData));
    setUser({ ...userData, token });
  };

  const logout = () => {
    localStorage.removeItem('cashplay_token');
    localStorage.removeItem('cashplay_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
