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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnimatedBupLogo } from '../components/AnimatedBupLogo';

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
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
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

        {/* 6 Demo Fast-Login Accounts */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" /> 1-Click Demo Accounts (Dean, Faculty & Student CRs):
            </p>
            <span className="text-[10px] text-slate-400 font-mono">BUP FST Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            {/* Account 1: Dean FST */}
            <button
              type="button"
              onClick={() => handleQuickDemo('dean.fst@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 hover:bg-purple-100/80 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60 text-left transition-all col-span-1 sm:col-span-2"
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

            {/* Account 2: Dr. Sabir Hossain */}
            <button
              type="button"
              onClick={() => handleQuickDemo('sabir@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 hover:border-amber-300 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 dark:text-amber-100">Dr. Md. Sabir Hossain</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  Dept Chairman
                </span>
              </div>
              <span className="text-amber-800/80 dark:text-amber-400 block mt-0.5">Chairman, Dept of CSE (FST)</span>
              <span className="text-[9px] font-mono text-amber-700 dark:text-amber-300">sabir@bup.edu.bd • faculty123</span>
            </button>

            {/* Account 3: Asst. Prof. Nazneen */}
            <button
              type="button"
              onClick={() => handleQuickDemo('nazneen@bup.edu.bd', 'faculty123', 'faculty')}
              className="btn-motion p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 hover:border-amber-300 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 dark:text-amber-100">Asst. Prof. Nazneen</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  Supervisor
                </span>
              </div>
              <span className="text-amber-800/80 dark:text-amber-400 block mt-0.5">Dept of ICT Coordinator</span>
              <span className="text-[9px] font-mono text-amber-700 dark:text-amber-300">nazneen@bup.edu.bd • faculty123</span>
            </button>

            {/* Account 4: Rafi */}
            <button
              type="button"
              onClick={() => handleQuickDemo('rafi@bup.edu.bd', 'bup123', 'student')}
              className="btn-motion p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white">Safaytul Islam Rafi</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  Student CR
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 block mt-0.5">B.Sc. in ICT • Section A</span>
              <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400">rafi@bup.edu.bd • bup123</span>
            </button>

            {/* Account 5: Tanvir */}
            <button
              type="button"
              onClick={() => handleQuickDemo('tanvir@bup.edu.bd', 'bup123', 'student')}
              className="btn-motion p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white">Munshi Tanvir Hossain</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  Section B Lead
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 block mt-0.5">B.Sc. in ICT • Section B</span>
              <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400">tanvir@bup.edu.bd • bup123</span>
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
    </div>
  );
};
