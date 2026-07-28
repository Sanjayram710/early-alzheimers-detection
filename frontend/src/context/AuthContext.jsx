import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 1,
  email: 'admin@alzheimers.ai',
  full_name: 'System Administrator',
  role: 'admin',
  is_active: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('alzheimers_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('alzheimers_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('alzheimers_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Failed to fetch user context:', err);
          setUser(DEFAULT_USER);
        }
      } else {
        setUser(DEFAULT_USER);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const { access_token, user: userData } = res.data;
    localStorage.setItem('alzheimers_token', access_token);
    localStorage.setItem('alzheimers_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (fullName, email, password, role = 'user') => {
    const res = await api.post('/auth/register', {
      full_name: fullName,
      email,
      password,
      role,
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('alzheimers_token');
    localStorage.removeItem('alzheimers_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
