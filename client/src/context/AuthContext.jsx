import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('civic_token');
    const savedUser = localStorage.getItem('civic_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify with server
        api.getMe()
          .then((res) => {
            if (res.user) {
              setUser(res.user);
              localStorage.setItem('civic_user', JSON.stringify(res.user));
            }
          })
          .catch(() => {
            // Token might be invalid or expired
          })
          .finally(() => setLoading(false));
      } catch (e) {
        setUser(null);
        setLoading(false);
      }
    } else {
      // Default to demo citizen for seamless hackathon walkthrough experience!
      loginAsDemo('citizen').finally(() => setLoading(false));
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('civic_token', res.token);
    localStorage.setItem('civic_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const register = async (data) => {
    const res = await api.register(data);
    localStorage.setItem('civic_token', res.token);
    localStorage.setItem('civic_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('civic_token');
    localStorage.removeItem('civic_user');
    setUser(null);
  };

  const loginAsDemo = async (role = 'citizen') => {
    try {
      const email = role === 'authority' || role === 'admin' 
        ? 'admin@civiclens.ai' 
        : 'citizen@civiclens.ai';
      return await login(email, 'password123');
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('civic_user', JSON.stringify(res.user));
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginAsDemo, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
