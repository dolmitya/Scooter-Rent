import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: { numberPhone?: string; username?: string }) => Promise<void>;
  addBalance: (amount: number) => Promise<void>;
  loadUserData: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const loadUserData = async (token: string) => {
    try {
      const { username, balance, roles } = await api.getInfo(token);
  
      setUser({
        login: username,
        balance,
        roles,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      logout();
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      loadUserData(savedToken);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { token: newToken } = await api.login(username, password);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    await loadUserData(newToken);
  };

  const register = async (username: string, password: string) => {
    await api.register(username, password);
    await login(username, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = async (updates: { numberPhone?: string; username?: string }) => {
    if (!token) return;
    await api.updateUserInfo(token, updates);
    await loadUserData(token);
  };

  const addBalance = async (amount: number) => {
    if (!token) return;
    await api.addBalance(token, amount);
    await loadUserData(token);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      isAuthenticated: !!user,
      isAdmin: user?.roles.includes('ROLE_ADMIN') || false,
      login, 
      register, 
      logout,
      updateUser,
      addBalance,
      loadUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
