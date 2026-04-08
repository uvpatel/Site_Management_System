/**
 * Authentication Context
 * Manages authentication state with real backend API
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return 'Site_Engineer';
  return role.trim().replace(/\s+/g, '_');
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('siteos_token');
    const storedUser = localStorage.getItem('siteos_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, role: normalizeRole(parsedUser.role) });
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('siteos_token');
        localStorage.removeItem('siteos_user');
      }
    }
    setLoading(false);
  }, []);

  // Sign up
  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      if (data.success) {
        return data;
      } else {
        setError(data.message);
        return data;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred during signup';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify email (kept for UI compatibility but auto-verified on backend)
  const verifyEmail = useCallback(async (email, code) => {
    return { success: true, message: 'Email verified successfully' };
  }, []);

  // Resend verification code
  const resendVerificationCode = useCallback(async (email) => {
    return { success: true, message: 'Verification code sent', verificationCode: '123456' };
  }, []);

  // Login with role
  const login = useCallback(async (email, password, rememberMe = false, role = 'Site_Engineer') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password, role: normalizeRole(role) });
      if (data.success) {
        const userWithRole = { ...data.user, role: normalizeRole(role) };
        setUser(userWithRole);
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('siteos_token', data.token);
        localStorage.setItem('siteos_user', JSON.stringify(userWithRole));
        return { ...data, user: userWithRole };
      } else {
        setError(data.message);
        return data;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred during login';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('siteos_token');
    localStorage.removeItem('siteos_user');
    return { success: true, message: 'Logged out successfully' };
  }, []);

  // Request password reset (stub — for demo)
  const requestPasswordReset = useCallback(async (email) => {
    return { success: true, message: 'If email exists, reset link will be sent', resetToken: 'demo-token' };
  }, []);

  // Reset password (stub)
  const resetPassword = useCallback(async (resetToken, newPassword) => {
    return { success: true, message: 'Password reset successfully' };
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put('/auth/profile', updates);
      if (data.success) {
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        localStorage.setItem('siteos_user', JSON.stringify(updatedUser));
        return data;
      } else {
        setError(data.message);
        return data;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred during profile update';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (data.success) {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('siteos_token', data.token);
        }
        return data;
      } else {
        setError(data.message);
        return data;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred during password change';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete account (stub)
  const deleteAccount = useCallback(async (password) => {
    await logout();
    return { success: true, message: 'Account deleted successfully' };
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    signup,
    verifyEmail,
    resendVerificationCode,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
