'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name: string) {
    document.cookie = name+'=; Max-Age=-99999999; path=/;';
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCookie('auth_token');
    const storedUser = localStorage.getItem('storysynth_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Clear session if user data is corrupt
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, email: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      joinedAt: new Date().toISOString(),
    };
    const token = btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() }));
    
    localStorage.setItem('storysynth_user', JSON.stringify(newUser));
    setCookie('auth_token', token, 7);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('storysynth_user');
    eraseCookie('auth_token');
    setUser(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
