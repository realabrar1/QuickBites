import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getUserData } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserData());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, phoneNumber, password, role) => {
    setLoading(true);
    try {
      return await authService.register(fullName, email, phoneNumber, password, role);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
