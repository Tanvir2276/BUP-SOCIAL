import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, setAuthToken, clearAuthToken, getAuthToken } from '../utils/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'club_admin' | 'moderator' | 'admin';
  studentId?: string;
  facultyId?: string;
  department?: string;
  program?: string;
  batch?: string;
  section?: string;
  designation?: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  reminderSettings?: {
    leadTimeMinutes: number;
    deviceType: string;
    soundEnabled: boolean;
    classReminders: boolean;
    examReminders: boolean;
    noticeAlerts: boolean;
  };
  favoriteClubs?: string[];
  coursePreferences?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string, roleHint?: string) => Promise<User>;
  register: (formData: any) => Promise<{ requiresOtp: boolean; demoOtpCode?: string; user?: User }>;
  verifyOtp: (email: string, otp: string) => Promise<User>;
  updatePreferences: (updates: {
    reminderSettings?: any;
    favoriteClubs?: string[];
    coursePreferences?: string[];
    bio?: string;
    section?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        clearAuthToken();
      }
    } catch (err) {
      clearAuthToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (identifier: string, password: string, roleHint?: string): Promise<User> => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, roleHint }),
    });

    if (res.success && res.token) {
      setAuthToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData: any) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.success) {
      if (res.token) {
        setAuthToken(res.token);
      }
      if (res.user && !res.requiresOtp) {
        setUser(res.user);
      }
      return {
        requiresOtp: !!res.requiresOtp,
        demoOtpCode: res.demoOtpCode,
        user: res.user,
      };
    }
    throw new Error(res.message || 'Registration failed');
  };

  const verifyOtp = async (email: string, otp: string): Promise<User> => {
    const res = await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });

    if (res.success && res.token) {
      setAuthToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'OTP verification failed');
  };

  const updatePreferences = async (updates: any) => {
    const res = await apiFetch('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (res.success && res.user) {
      setUser((prev) => (prev ? { ...prev, ...res.user } : res.user));
    } else {
      throw new Error(res.message || 'Failed to update preferences');
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyOtp,
        updatePreferences,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
