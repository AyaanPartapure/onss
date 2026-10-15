import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('onss_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem('onss_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.error('Failed to restore session:', err.message);
        localStorage.removeItem('onss_token');
        localStorage.removeItem('onss_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (emailormobnum, password) => {
    const response = await api.post('/auth/login', { emailormobnum, password });
    if (response.data.success) {
      const newToken = response.data.token;
      const newUser = response.data.user;
      localStorage.setItem('onss_token', newToken);
      localStorage.setItem('onss_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    }
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      const newToken = response.data.token;
      const newUser = response.data.user;
      localStorage.setItem('onss_token', newToken);
      localStorage.setItem('onss_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('onss_token');
    localStorage.removeItem('onss_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('onss_user', JSON.stringify(response.data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
