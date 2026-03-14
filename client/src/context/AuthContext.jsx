import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize JWT auth state on load
  useEffect(() => {
    if (token) {
      // In a full app, we would verify token with the backend first
      // For now, we decode basic info from the stored response if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, [token]);

  const loginAdmin = (username, password) => {
    // Hardcoded credentials for the requested "o dhola" admin account
    if (username.toLowerCase() === 'o dhola' && password === 'admin') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // --- Standard User Authentication ---

  const registerUser = async (userData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      handleAuthSuccess(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const loginUser = async (credentials) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      handleAuthSuccess(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const handleAuthSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    if (data.user.isAdmin) setIsAdmin(true); // If genuine DB admin signs in
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAdmin, 
      loginAdmin, 
      logoutAdmin,
      user,
      token,
      loading,
      loginUser,
      registerUser,
      logoutUser 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
