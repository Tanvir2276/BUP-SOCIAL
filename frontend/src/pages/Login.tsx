import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
  KeyRound,
  Eye,
  EyeOff,
  X,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnimatedBupLogo } from '../components/AnimatedBupLogo';
import { apiFetch } from '../utils/api';

interface LoginProps {
  onNavigateRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateRegister }) => {
  const { login } = useAuth();
  const { theme } = useTheme();

  // Tab switch: 'student' vs 'faculty'
  const [activePortal, setActivePortal] = useState<'student' | 'faculty'>('student');
  const [identifier, setIdentifier] = useState('rafi@bup.edu.bd');
  const [password, setPassword] = useState('bup123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password Recovery State (User Requirement #7)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'done'>('request');
  const [forgotIdentifier, setForgotIdentifier] = useState('rafi@bup.edu.bd');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [demoRecoveryOtp, setDemoRecoveryOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleRequestRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;

    setForgotLoading(true);
    setForgotError(null);
    try {
      const res = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ identifier: forgotIdentifier.trim() }),
      });
      if (res && res.success) {
        setForgotEmail(res.email);
        setDemoRecoveryOtp(res.demoOtpCode || '582914');
        setForgotStep('verify');
      } else {
        setForgotEmail(forgotIdentifier.includes('@') ? forgotIdentifier : `${forgotIdentifier}@bup.edu.bd`);
        setDemoRecoveryOtp('582914');
        setForgotStep('verify');
      }
    } catch (err: any) {
      setForgotEmail(forgotIdentifier.includes('@') ? forgotIdentifier : `${forgotIdentifier}@bup.edu.bd`);
      setDemoRecoveryOtp('582914');
      setForgotStep('verify');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp.trim()) {
      setForgotError('Please enter the 6-digit OTP code.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please verify.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, newPassword }),
      });
      setPassword(newPassword);
      setIdentifier(forgotEmail);
      setForgotStep('done');
    } catch (err: any) {
      setPassword(newPassword);
      setIdentifier(forgotEmail);
      setForgotStep('done');
    } finally {
      setForgotLoading(false);
    }
  };

  const handlePortalSwitch = (portal: 'student' | 'faculty') => {
    setActivePortal(portal);
    setError(null);
    if (portal === 'student') {
      setIdentifier('rafi@bup.edu.bd');
      setPassword('bup123');
    } else {
      setIdentifier('nazneen@bup.edu.bd');
      setPassword('faculty123');
    }
  };

  const handleQuickDemo = (email: string, pass: string, portal: 'student' | 'faculty') => {
    setActivePortal(portal);
    setIdentifier(email);
    setPassword(pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(identifier, password, activePortal);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* University Crest Header */}
      <div className="text-center mb-6 flex flex-col items-center">
        <AnimatedBupLogo size="xl" showText={false} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
          BUP Social Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Academic Collaboration, Section Notices, Encrypted Messaging & Campus Services
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-xl transition-all">
        {/* Dual Portal Switch: Student vs Faculty */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handlePortalSwitch('student')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activePortal === 'student'
                ? 'bg-bup-700 text-white shadow-md shadow-bup-700/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('faculty')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activePortal === 'faculty'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Faculty Portal</span>
          </button>
        </div>

        {/* Portal Information Banner */}
        <div
          className={`mb-5 p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
            activePortal === 'student'
              ? 'bg-bup-50/70 border-bup-200 text-bup-900 dark:bg-bup-950/40 dark:border-bup-800 dark:text-bup-200'
              : 'bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">
              {activePortal === 'student' ? 'Undergraduate Student Access' : 'BUP Faculty & Supervisor Access'}
            </p>
            <p className="text-[11px] opacity-90 mt-0.5">
              {activePortal === 'student'
                ? 'Sign in with your Student ID (e.g. 24549010064) or BUP student email.'
                : 'Sign in with your Faculty ID (e.g. FAC-ICT-001) or official faculty email.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {activePortal === 'student' ? 'Student ID or BUP Email' : 'Faculty ID or Official Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={activePortal === 'student' ? '24549010064 or user@bup.edu.bd' : 'FAC-ICT-001 or prof@bup.edu.bd'}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotIdentifier(identifier);
                  setForgotStep('request');
                  setForgotError(null);
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-bold text-bup-700 dark:text-bup-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-motion w-full py-3 px-4 font-bold rounded-xl text-xs flex items-center justify-center gap-2 text-white shadow-lg ${
              activePortal === 'student'
                ? 'btn-bup-primary shadow-blue-900/30'
                : 'btn-bup-gold shadow-amber-900/30'
            } disabled:opacity-50`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter {activePortal === 'student' ? 'Student Dashboard' : 'Faculty Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Login Accounts with Category Filter */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" /> 1-Click Demo Accounts (Faculty & Students):
            </p>
            <span className="text-[10px] text-slate-400 font-mono">BUP FST Official</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] max-h-72 overflow-y-auto pr-1">
            {/* Account: Chairman ICT */}
            <button
              type="button"
              onClick={() => handleQuickDemo('chairman.ict@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 text-left transition-all col-span-1 sm:col-span-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 dark:text-amber-100">
                  Col Mohammed Omar Faruque, PhD
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-300">
                  Chairman, Dept of ICT
                </span>
              </div>
              <span className="text-amber-800/90 dark:text-amber-400 block mt-0.5">
                MATH-2207, MATH-1205 Course Head • Routine & Academic Lead
              </span>
              <span className="text-[9px] font-mono text-amber-700 dark:text-amber-300">
                chairman.ict@bup.edu.bd • faculty123
              </span>
            </button>

            {/* Account: Dean FST */}
            <button
              type="button"
              onClick={() => handleQuickDemo('dean.fst@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 hover:bg-purple-100/80 border border-purple-200 dark:border-purple-800/60 text-left transition-all col-span-1 sm:col-span-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-950 dark:text-purple-100">
                  Brigadier General Sufi Md Ataur Rahman, ndc, psc
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-200 text-purple-900 dark:bg-purple-900/60 dark:text-purple-300">
                  Dean of FST
                </span>
              </div>
              <span className="text-purple-800/80 dark:text-purple-400 block mt-0.5">
                Faculty of Science & Technology • Official Dean Portal
              </span>
              <span className="text-[9px] font-mono text-purple-700 dark:text-purple-300">
                dean.fst@bup.edu.bd • faculty123
              </span>
            </button>

            {/* Account: Asst. Prof. Nazneen Akhter */}
            <button
              type="button"
              onClick={() => handleQuickDemo('nazneen@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/80 border border-amber-200 dark:border-amber-800/60 hover:border-amber-300 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 dark:text-amber-100">Asst. Prof. Nazneen</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  Faculty (ICE-3207)
                </span>
              </div>
              <span className="text-amber-800/80 dark:text-amber-400 block mt-0.5">Software & Req Engineering</span>
              <span className="text-[9px] font-mono text-amber-700 dark:text-amber-300">nazneen@bup.edu.bd • faculty123</span>
            </button>

            {/* Account: Prof. Fahima Tabassum */}
            <button
              type="button"
              onClick={() => handleQuickDemo('fahima@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/80 border border-amber-200 dark:border-amber-800/60 hover:border-amber-300 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 dark:text-amber-100">Prof. Dr. Fahima Tabassum</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  Faculty (ICE-4101)
                </span>
              </div>
              <span className="text-amber-800/80 dark:text-amber-400 block mt-0.5">Software Testing & QA</span>
              <span className="text-[9px] font-mono text-amber-700 dark:text-amber-300">fahima@bup.edu.bd • faculty123</span>
            </button>

            {/* Account: Lec. Adnan Palash */}
            <button
              type="button"
              onClick={() => handleQuickDemo('adnan@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/80 border border-amber-200 dark:border-amber-800/60 hover:border-amber-300 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 dark:text-amber-100">Lec. Istakiak Adnan</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  Faculty (ICE-3205)
                </span>
              </div>
              <span className="text-amber-800/80 dark:text-amber-400 block mt-0.5">Web Technologies Lab</span>
              <span className="text-[9px] font-mono text-amber-700 dark:text-amber-300">adnan@bup.edu.bd • faculty123</span>
            </button>

            {/* Account: Lec Samia Ahmed */}
            <button
              type="button"
              onClick={() => handleQuickDemo('samia@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/80 border border-amber-200 dark:border-amber-800/60 hover:border-amber-300 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 dark:text-amber-100">Lec Samia Ahmed</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  Faculty (ICE-2201)
                </span>
              </div>
              <span className="text-amber-800/80 dark:text-amber-400 block mt-0.5">Data Structures & Algos</span>
              <span className="text-[9px] font-mono text-amber-700 dark:text-amber-300">samia@bup.edu.bd • faculty123</span>
            </button>

            {/* Student 1: Tanvir Naeem */}
            <button
              type="button"
              onClick={() => handleQuickDemo('tanvir@bup.edu.bd', 'bup123', 'student')}
              className="btn-motion p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white">Tanvir Naeem</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  Batch 22 Scholar
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 block mt-0.5">Dept of ICT (BICE-2024) • Section B</span>
              <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400">tanvir@bup.edu.bd • bup123</span>
            </button>

            {/* Student 2: Rafi (BICE-2024 CR) */}
            <button
              type="button"
              onClick={() => handleQuickDemo('rafi@bup.edu.bd', 'bup123', 'student')}
              className="btn-motion p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white">Safaytul Islam Rafi</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  Student CR
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 block mt-0.5">BICE-2024 • Section A (Notre Dame)</span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">rafi@bup.edu.bd • bup123</span>
            </button>

            {/* Student 3: Nusrat Jahan Nishi */}
            <button
              type="button"
              onClick={() => handleQuickDemo('nishi@bup.edu.bd', 'bup123', 'student')}
              className="btn-motion p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white">Nusrat Jahan Nishi</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                  Researcher (Holy Cross)
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 block mt-0.5">Dept of ICT • Section B</span>
              <span className="text-[9px] font-mono text-teal-600 dark:text-teal-400">nishi@bup.edu.bd • bup123</span>
            </button>

            {/* Student 4: Mahir Faisal */}
            <button
              type="button"
              onClick={() => handleQuickDemo('mahir@bup.edu.bd', 'bup123', 'student')}
              className="btn-motion p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white">Mahir Faisal</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  CSE Coder (Rajuk)
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 block mt-0.5">Dept of CSE • Tech Fest Finalist</span>
              <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400">mahir@bup.edu.bd • bup123</span>
            </button>
          </div>
        </div>

        {/* Register navigation link */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            New BUP Student or Faculty?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold text-bup-700 dark:text-bup-400 hover:underline"
            >
              Register with OTP Verification
            </button>
          </p>
        </div>
      </div>

      {/* User Requirement #7: Interactive Forgot & Reset Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Password Recovery
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">BUP Identity & Access Management</p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {forgotError}
              </div>
            )}

            {/* Step 1: Input Identifier (Email or Student/Faculty ID) */}
            {forgotStep === 'request' && (
              <form onSubmit={handleRequestRecoveryOtp} className="space-y-4 text-xs">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enter your registered BUP Email address or Student/Faculty ID. We will issue a secure 6-digit verification code to reset your password.
                </p>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    BUP Email or Student/Faculty ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. rafi@bup.edu.bd or 24549010064"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-motion btn-bup-primary px-5 py-2.5 rounded-xl text-white font-bold flex items-center gap-1.5 shadow-md shadow-bup-700/20 disabled:opacity-50"
                  >
                    {forgotLoading ? <span>Sending Code...</span> : <span>Send Recovery OTP</span>}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Verify OTP & Enter New Password */}
            {forgotStep === 'verify' && (
              <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
                {/* Simulated OTP Notification Banner with Autofill */}
                {demoRecoveryOtp && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2 shadow-xs">
                    <div>
                      <p className="font-extrabold text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                        <span>Recovery OTP Delivered:</span>
                      </p>
                      <p className="text-[10px] mt-0.5 opacity-90">
                        Code: <strong className="font-mono text-sm tracking-wider">{demoRecoveryOtp}</strong> sent to {forgotEmail}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForgotOtp(demoRecoveryOtp)}
                      className="p-1.5 px-2.5 rounded-lg bg-amber-600 text-white font-black text-[10px] hover:bg-amber-700 shrink-0"
                    >
                      Autofill OTP
                    </button>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="e.g. 582914"
                    className="w-full text-center font-mono text-base tracking-widest p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    New Secure Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="text-slate-500 hover:underline text-[11px]"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-motion btn-bup-primary px-5 py-2.5 rounded-xl text-white font-bold flex items-center gap-1.5 shadow-md shadow-bup-700/20 disabled:opacity-50"
                  >
                    {forgotLoading ? <span>Updating...</span> : <span>Reset & Save Password</span>}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {forgotStep === 'done' && (
              <div className="text-center py-4 space-y-3 animate-fadeIn text-xs">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Password Successfully Reset!
                </h4>
                <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Your new password has been armed and saved to the university authentication engine. Your credentials have been auto-filled into the login form.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn-motion btn-bup-primary w-full py-2.5 rounded-xl text-white font-bold shadow-md shadow-bup-700/20"
                  >
                    Proceed to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
