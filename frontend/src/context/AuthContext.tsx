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

// Standalone Verified Profiles for seamless cloud demo fallback
export const DEMO_USERS_MAP: Record<string, User> = {
  'dean.fst@bup.edu.bd': {
    id: 'dean-fst-001',
    name: 'Brigadier General Sufi Md Ataur Rahman, ndc, psc',
    email: 'dean.fst@bup.edu.bd',
    role: 'faculty',
    facultyId: 'DEAN-FST-001',
    designation: 'Dean, Faculty of Science & Technology (FST)',
    department: 'Faculty of Science & Technology',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    bio: 'Dean, Faculty of Science and Technology (FST), Bangladesh University of Professionals.',
    isVerified: true,
  },
  'sabir@bup.edu.bd': {
    id: 'fac-cse-001',
    name: 'Associate Professor Dr. Md. Sabir Hossain',
    email: 'sabir@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-CSE-001',
    designation: 'Chairman, Dept of CSE',
    department: 'Department of CSE',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
    isVerified: true,
  },
  'nazneen@bup.edu.bd': {
    id: 'fac-ict-001',
    name: 'Assistant Professor Nazneen Akhter',
    email: 'nazneen@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-001',
    designation: 'Coordinator & Supervisor',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    isVerified: true,
  },
  'rafi@bup.edu.bd': {
    id: 'student-24549010064',
    name: 'Safaytul Islam Rafi',
    email: 'rafi@bup.edu.bd',
    role: 'student',
    studentId: '24549010064',
    designation: 'Student CR',
    department: 'Department of ICT',
    program: 'B.Sc. in ICT',
    batch: 'ICT-2024',
    section: 'Section A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    isVerified: true,
    coursePreferences: ['ICT-1101', 'ICT-2201', 'ICT-2202', 'ICT-2203', 'CSE-3101'],
    favoriteClubs: ['BUP InfoTech Club (BUPITC)', 'BUP Robotics Club (BUPRC)'],
  },
  'tanvir@bup.edu.bd': {
    id: 'student-22549010076',
    name: 'Munshi Tanvir Hossain',
    email: 'tanvir@bup.edu.bd',
    role: 'student',
    studentId: '22549010076',
    designation: 'Section B Lead',
    department: 'Department of ICT',
    program: 'B.Sc. in ICT',
    batch: 'ICT-2024',
    section: 'Section B',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    isVerified: true,
    coursePreferences: ['ICT-2201', 'ICT-2202', 'ICT-3101', 'ICT-4103'],
    favoriteClubs: ['BUP Robotics Club (BUPRC)', 'BUP IEEE Student Branch'],
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    // Check demo user in localStorage first for instant cloud preview
    const cachedUser = localStorage.getItem('bupsoc_active_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        setLoading(false);
        return;
      } catch (e) {}
    }

    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('bupsoc_active_user', JSON.stringify(res.user));
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
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password, roleHint }),
      });

      if (res.success && res.token) {
        setAuthToken(res.token);
        setUser(res.user);
        localStorage.setItem('bupsoc_active_user', JSON.stringify(res.user));
        return res.user;
      }
    } catch (err: any) {
      console.warn('API login call failed, executing graceful demo fallback:', err.message);
      
      // Fallback for Vercel Static Hosting (where POST /api/auth/login returns 405 or network is offline)
      const cleanKey = identifier.toLowerCase().trim();
      const matchedUser = DEMO_USERS_MAP[cleanKey];

      if (matchedUser) {
        setAuthToken('token_bup_social_' + cleanKey);
        setUser(matchedUser);
        localStorage.setItem('bupsoc_active_user', JSON.stringify(matchedUser));
        return matchedUser;
      }

      // If user typed custom student ID or email
      const isFaculty = roleHint === 'faculty' || identifier.includes('prof') || identifier.includes('faculty');
      const customUser: User = {
        id: 'user-' + Date.now(),
        name: identifier.includes('@') ? identifier.split('@')[0].toUpperCase() : `Student ${identifier}`,
        email: identifier.includes('@') ? identifier : `${identifier}@bup.edu.bd`,
        role: isFaculty ? 'faculty' : 'student',
        studentId: isFaculty ? undefined : identifier,
        designation: isFaculty ? 'Faculty Member' : 'Student',
        department: 'Department of ICT',
        section: 'Section A',
        isVerified: true,
      };

      setAuthToken('token_bup_social_custom');
      setUser(customUser);
      localStorage.setItem('bupsoc_active_user', JSON.stringify(customUser));
      return customUser;
    }

    throw new Error('Login failed');
  };

  const register = async (formData: any) => {
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success) {
        if (res.token) {
          setAuthToken(res.token);
          setUser(res.user);
          localStorage.setItem('bupsoc_active_user', JSON.stringify(res.user));
        }
        return res;
      }
    } catch (err: any) {
      console.warn('Register API failed, simulating OTP challenge on client:', err.message);
      return {
        requiresOtp: true,
        demoOtpCode: '245064',
        user: {
          id: 'temp-' + Date.now(),
          name: formData.name,
          email: formData.email,
          role: formData.role,
        },
      };
    }
    return { requiresOtp: false };
  };

  const verifyOtp = async (email: string, otp: string): Promise<User> => {
    try {
      const res = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      if (res.success && res.token) {
        setAuthToken(res.token);
        setUser(res.user);
        localStorage.setItem('bupsoc_active_user', JSON.stringify(res.user));
        return res.user;
      }
    } catch (err) {
      console.warn('Verify OTP fallback');
    }

    const verifiedUser: User = {
      id: 'verified-' + Date.now(),
      name: email.split('@')[0],
      email,
      role: 'student',
      isVerified: true,
    };
    setUser(verifiedUser);
    localStorage.setItem('bupsoc_active_user', JSON.stringify(verifiedUser));
    return verifiedUser;
  };

  const updatePreferences = async (updates: any) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('bupsoc_active_user', JSON.stringify(updated));

    try {
      await apiFetch('/auth/preferences', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (err) {}
  };

  const logout = () => {
    clearAuthToken();
    localStorage.removeItem('bupsoc_active_user');
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
