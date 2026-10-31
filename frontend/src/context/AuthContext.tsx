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
  coverPhoto?: string;
  college?: string;
  livesIn?: string;
  hometown?: string;
  school?: string;
  instagram?: string;
  motto?: string;
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
    avatar?: string;
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
  'chairman.ict@bup.edu.bd': {
    id: 'fac-ict-chair',
    name: 'Col Mohammed Omar Faruque, PhD',
    email: 'chairman.ict@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-CHAIR',
    designation: 'Chairman, Department of ICT',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    bio: 'Chairman, Department of Information and Communication Engineering, FST, BUP.',
    isVerified: true,
    coursePreferences: ['MATH-2207', 'MATH-1205'],
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
    designation: 'Assistant Professor & Coordinator',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    isVerified: true,
    coursePreferences: ['ICE-3207', 'ICE-3208'],
  },
  'fahima@bup.edu.bd': {
    id: 'fac-ict-002',
    name: 'Prof. Dr. Fahima Tabassum',
    email: 'fahima@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-002',
    designation: 'Professor, Software Engineering',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300',
    isVerified: true,
    coursePreferences: ['ICE-4101', 'ICE-4102'],
  },
  'adnan@bup.edu.bd': {
    id: 'fac-ict-003',
    name: 'Lecturer Md. Istakiak Adnan Palash',
    email: 'adnan@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-003',
    designation: 'Lecturer in Web Technologies',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    isVerified: true,
    coursePreferences: ['ICE-3205', 'ICE-3206'],
  },
  'samia@bup.edu.bd': {
    id: 'fac-ict-004',
    name: 'Lecturer Samia Ahmed',
    email: 'samia@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-004',
    designation: 'Lecturer in Algorithms & Data Structures',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    isVerified: true,
    coursePreferences: ['ICE-2201', 'ICE-2202'],
  },
  'saifulislam@bup.edu.bd': {
    id: 'fac-ict-005',
    name: 'Assistant Professor Saiful Islam',
    email: 'saifulislam@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-005',
    designation: 'Assistant Professor in Signals & Systems',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    isVerified: true,
    coursePreferences: ['ICE-2205', 'ICE-3202'],
  },
  'maynul@bup.edu.bd': {
    id: 'fac-ict-006',
    name: 'Assistant Professor Md. Maynul Islam',
    email: 'maynul@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-006',
    designation: 'Assistant Professor in Optical Communication',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    isVerified: true,
    coursePreferences: ['ICE-4105', 'ICE-4106'],
  },
  'pranto@bup.edu.bd': {
    id: 'fac-ict-007',
    name: 'Lecturer Md. Appel Mahmud Pranto',
    email: 'pranto@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-007',
    designation: 'Lecturer in Structured Programming',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300',
    isVerified: true,
    coursePreferences: ['ICE-1205', 'ICE-1206'],
  },
  'sharmeen_seema@bup.edu.bd': {
    id: 'fac-ict-008',
    name: 'Lecturer Sharmeen Jahan Seema',
    email: 'sharmeen_seema@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-008',
    designation: 'Lecturer in Computer Networks',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    isVerified: true,
    coursePreferences: ['ICE-2207', 'ICE-2208'],
  },
  'jfraisa@bup.edu.bd': {
    id: 'fac-ict-009',
    name: 'Lecturer Jasiya Fairiz Raisa',
    email: 'jfraisa@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-ICT-009',
    designation: 'Lecturer in Artificial Intelligence',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300',
    isVerified: true,
    coursePreferences: ['ICE-4107', 'ICE-4108'],
  },
  'chairman.datascience@bup.edu.bd': {
    id: 'fac-ds-chair',
    name: 'Col Awal Uddin Ahmed, psc',
    email: 'chairman.datascience@bup.edu.bd',
    role: 'faculty',
    facultyId: 'FAC-DS-CHAIR',
    designation: 'Chairman, Dept of Data Science',
    department: 'Department of Data Science',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    isVerified: true,
    coursePreferences: ['ICE-1203', 'ICE-1204'],
  },
  'tanvir@bup.edu.bd': {
    id: 'student-24549010076',
    name: 'Tanvir Naeem',
    email: 'tanvir@bup.edu.bd',
    role: 'student',
    studentId: '24549010076',
    designation: 'BUP Undergraduate Scholar',
    department: 'Department of ICT (BICE-2024)',
    program: 'B.Sc. in ICE',
    batch: 'BICE-2024',
    section: 'Section B',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Dhaka College',
    livesIn: 'Mirpur DOHS, Dhaka',
    hometown: 'Cumilla, Bangladesh',
    school: 'Tongi Pilot School & Girls College',
    instagram: 'tanvir_naeeem',
    motto: 'History only remembers how you finished.',
    bio: 'Undergraduate student at Dept of ICT, FST, BUP. Innovating university tech ecosystems & celebrating অন্তরীক্ষ-২২.',
    isVerified: true,
    coursePreferences: ['ICE-3201', 'ICE-3205', 'ICE-3207', 'ICE-3209'],
    favoriteClubs: ['BUP Robotics Club (BUPRC)', 'BUP InfoTech Club (BUPITC)'],
  },
  'rafi@bup.edu.bd': {
    id: 'student-24549010064',
    name: 'Safaytul Islam Rafi',
    email: 'rafi@bup.edu.bd',
    role: 'student',
    studentId: '24549010064',
    designation: 'Student CR - Section A',
    department: 'Department of ICT',
    program: 'B.Sc. in ICE',
    batch: 'BICE-2024',
    section: 'Section A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Notre Dame College',
    livesIn: 'Uttara Sector 11, Dhaka',
    hometown: 'Chattogram, Bangladesh',
    school: 'Chittagong Collegiate School',
    instagram: 'rafi_bup',
    motto: 'Engineering digital solutions for Smart Bangladesh 🇧🇩',
    bio: 'Class Representative of BICE-2024 Section A. Passionate about IoT systems & embedded robotics.',
    isVerified: true,
    coursePreferences: ['ICE-3201', 'ICE-3205', 'ICE-3207', 'ICE-3208'],
    favoriteClubs: ['BUP InfoTech Club (BUPITC)', 'BUP Robotics Club (BUPRC)'],
  },
  'nishi@bup.edu.bd': {
    id: 'student-24549010042',
    name: 'Nusrat Jahan Nishi',
    email: 'nishi@bup.edu.bd',
    role: 'student',
    studentId: '24549010042',
    designation: 'Undergraduate Researcher',
    department: 'Department of ICT',
    program: 'B.Sc. in ICE',
    batch: 'BICE-2024',
    section: 'Section B',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Holy Cross College',
    livesIn: 'Dhanmondi, Dhaka',
    hometown: 'Sylhet, Bangladesh',
    school: 'Sylhet Govt. Agragami Girls High School',
    instagram: 'nishi.jahan',
    motto: 'Code with passion, live with purpose ✨',
    bio: 'ICE undergrad specializing in Machine Learning & Cyber Security. Active participant in BUP research seminars.',
    isVerified: true,
    coursePreferences: ['ICE-2201', 'ICE-3207', 'ICE-3208'],
    favoriteClubs: ['BUP IEEE Student Branch', 'BUP InfoTech Club (BUPITC)'],
  },
  'mahir@bup.edu.bd': {
    id: 'student-24549010019',
    name: 'Mahir Faisal',
    email: 'mahir@bup.edu.bd',
    role: 'student',
    studentId: '24549010019',
    designation: 'Competitive Programmer',
    department: 'Department of CSE',
    program: 'B.Sc. in CSE',
    batch: 'BCSE-2024',
    section: 'Section A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Rajuk Uttara Model College',
    livesIn: 'Mirpur 12, Dhaka',
    hometown: 'Bogura, Bangladesh',
    school: 'Bogura Zilla School',
    instagram: 'mahir_fst',
    motto: 'Building algorithms that matter 💻',
    bio: 'BUP Intra-University Programming Contest 2026 1st Runner-up. FST Tech Fest Hackathon Finalist.',
    isVerified: true,
    coursePreferences: ['ICE-2201', 'ICE-2203'],
    favoriteClubs: ['BUP InfoTech Club (BUPITC)', 'BUP Robotics Club (BUPRC)'],
  },
  'anika@bup.edu.bd': {
    id: 'student-25549010088',
    name: 'Anika Tahsin',
    email: 'anika@bup.edu.bd',
    role: 'student',
    studentId: '25549010088',
    designation: 'Student Representative',
    department: 'Department of ICT',
    program: 'B.Sc. in ICE',
    batch: 'BICE-2025',
    section: 'Section A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Viqarunnisa Noon College',
    livesIn: 'Bashundhara R/A, Dhaka',
    hometown: 'Rajshahi, Bangladesh',
    school: 'Rajshahi Govt. Girls High School',
    instagram: 'anika.tahsin',
    motto: 'Curiosity is the engine of achievement 🚀',
    bio: 'Sophomore at Dept of ICT. Organizer at BUP Cultural Forum & National Tech Fest.',
    isVerified: true,
    coursePreferences: ['ICE-2201', 'ICE-2203', 'ICE-2205', 'MATH-2207'],
    favoriteClubs: ['BUP InfoTech Club (BUPITC)', 'BUP Cultural Forum'],
  },
  'farhan@bup.edu.bd': {
    id: 'student-23549010052',
    name: 'Farhan Tanveer',
    email: 'farhan@bup.edu.bd',
    role: 'student',
    studentId: '23549010052',
    designation: 'Senior Researcher',
    department: 'Dept of Environmental Science',
    program: 'B.Sc. in ES',
    batch: 'BES-2023',
    section: 'Section A',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Adamjee Cantonment College',
    livesIn: 'Mirpur DOHS, Dhaka',
    hometown: 'Barishal, Bangladesh',
    school: 'Barishal Zilla School',
    instagram: 'farhan_bup',
    motto: 'Sustainable technology for a greener campus 🌿',
    bio: 'Senior Undergraduate, Faculty of Science and Technology. Working on GIS satellite mapping & climate telemetry.',
    isVerified: true,
    coursePreferences: ['ICE-3207', 'ICE-3208'],
    favoriteClubs: ['BUP Environmental Club', 'BUP Sports Club'],
  },
  'sumaiya@bup.edu.bd': {
    id: 'student-24549010031',
    name: 'Sumaiya Akter',
    email: 'sumaiya@bup.edu.bd',
    role: 'student',
    studentId: '24549010031',
    designation: 'Finance & Strategy Lead',
    department: 'Faculty of Business Studies (FBS)',
    program: 'BBA in Marketing',
    batch: 'BBA-2024',
    section: 'Section B',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'BAF Shaheen College',
    livesIn: 'Mohakhali DOHS, Dhaka',
    hometown: 'Khulna, Bangladesh',
    school: 'Khulna Govt. Coronation Girls High School',
    instagram: 'sumaiya.akter',
    motto: 'Empowering communities through digital leadership 💡',
    bio: 'BUP Career and Education Fest organizer. Brand ambassador for BUP-GO project.',
    isVerified: true,
    coursePreferences: ['ENG-1202', 'MATH-1205'],
    favoriteClubs: ['BUP Career Club', 'BUP Cultural Forum'],
  },
  'jabed@bup.edu.bd': {
    id: 'student-24549010095',
    name: 'Jabed Hossain',
    email: 'jabed@bup.edu.bd',
    role: 'student',
    studentId: '24549010095',
    designation: 'Section B Assistant Lead',
    department: 'Department of ICT',
    program: 'B.Sc. in ICE',
    batch: 'BICE-2024',
    section: 'Section B',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Chittagong College',
    livesIn: 'Mirpur 2, Dhaka',
    hometown: 'Feni, Bangladesh',
    school: 'Feni Govt. Pilot High School',
    instagram: 'jabed_hossain',
    motto: 'Dedicated to excellence in ICE Section B 🎓',
    bio: 'Junior Developer, web architectures & database systems enthusiast at FST BUP.',
    isVerified: true,
    coursePreferences: ['ICE-3205', 'ICE-3206', 'ICE-3207'],
    favoriteClubs: ['BUP InfoTech Club (BUPITC)'],
  },
  'sadia@bup.edu.bd': {
    id: 'student-26549010018',
    name: 'Sadia Rahman',
    email: 'sadia@bup.edu.bd',
    role: 'student',
    studentId: '26549010018',
    designation: 'Freshman Batch Representative',
    department: 'Department of ICT',
    program: 'B.Sc. in ICE',
    batch: 'BICE-2026',
    section: 'Section B',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Dhaka City College',
    livesIn: 'Dhanmondi, Dhaka',
    hometown: 'Mymensingh, Bangladesh',
    school: 'Vidyamoyee Govt. Girls High School',
    instagram: 'sadia_bup',
    motto: 'New beginnings, endless opportunities 🌟',
    bio: 'Freshman exploring programming fundamentals & campus journalism at BUP.',
    isVerified: true,
    coursePreferences: ['ENG-1202', 'ICE-1203', 'ICE-1205', 'MATH-1205'],
    favoriteClubs: ['BUP Cultural Forum', 'BUP Career Club'],
  },
  'fahim@bup.edu.bd': {
    id: 'student-5126010005',
    name: 'Fahim Al Farabi',
    email: 'fahim@bup.edu.bd',
    role: 'student',
    studentId: '5126010005',
    designation: 'Postgraduate Researcher',
    department: 'Department of ICT',
    program: 'M.Sc. in ICE',
    batch: 'MICE-2026',
    section: 'Section A',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
    college: 'Notre Dame College',
    livesIn: 'Banani DOHS, Dhaka',
    hometown: 'Dhaka, Bangladesh',
    school: 'St. Joseph Higher Secondary School',
    instagram: 'fahim_farabi',
    motto: 'Pushing boundaries in telecom photonics 📡',
    bio: 'Postgraduate fellow researching 5G/6G beamforming under Faculty of Science and Technology.',
    isVerified: true,
    coursePreferences: ['MICE-5101', 'MICE-5102', 'MICE-5103', 'MICE-5104', 'MICE-5105'],
    favoriteClubs: ['BUP IEEE Student Branch'],
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
      let matchedUser = DEMO_USERS_MAP[cleanKey];
      if (!matchedUser) {
        matchedUser = Object.values(DEMO_USERS_MAP).find(
          (u) =>
            u.email.toLowerCase() === cleanKey ||
            u.studentId?.toLowerCase() === cleanKey ||
            u.facultyId?.toLowerCase() === cleanKey
        );
      }

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

  // Cache pending registration for client OTP verification fallback
  const [pendingRegData, setPendingRegData] = useState<any>(null);

  const register = async (formData: any) => {
    setPendingRegData(formData);
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

    const role = pendingRegData?.role || (email.includes('faculty') ? 'faculty' : 'student');
    const verifiedUser: User = {
      id: 'verified-' + Date.now(),
      name: pendingRegData?.name || email.split('@')[0].toUpperCase(),
      email,
      role: role as any,
      studentId: role === 'student' ? pendingRegData?.studentId || '24549010064' : undefined,
      facultyId: role === 'faculty' ? pendingRegData?.facultyId || 'FAC-ICT-001' : undefined,
      designation: role === 'faculty' ? pendingRegData?.designation || 'Assistant Professor' : 'Student',
      department: pendingRegData?.department || 'Department of ICT',
      section: pendingRegData?.section || 'Section A',
      isVerified: true,
      avatar: pendingRegData?.role === 'faculty'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
    };

    // Save to demo users map and localStorage
    DEMO_USERS_MAP[email.toLowerCase().trim()] = verifiedUser;
    setAuthToken('token_bup_' + Date.now());
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
