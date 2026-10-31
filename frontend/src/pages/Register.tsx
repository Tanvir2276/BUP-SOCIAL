import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OtpModal } from '../components/OtpModal';
import { AnimatedBupLogo } from '../components/AnimatedBupLogo';

interface RegisterProps {
  onNavigateLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigateLogin }) => {
  const { register, verifyOtp } = useAuth();

  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('01769021800');
  const [otpChannel, setOtpChannel] = useState<'email' | 'phone'>('email');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [department, setDepartment] = useState('Department of ICT');
  const [section, setSection] = useState('Section A');
  const [designation, setDesignation] = useState('Assistant Professor');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Modal state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [demoCode, setDemoCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || (otpChannel === 'phone' && !phone)) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await register({
        name,
        email,
        phone,
        otpChannel,
        password,
        role,
        studentId: role === 'student' ? studentId || '24549010064' : undefined,
        facultyId: role === 'faculty' ? facultyId || 'FAC-ICT-001' : undefined,
        department,
        section,
        designation: role === 'faculty' ? designation : 'Student',
        requireOtp: true,
      });

      if (res.requiresOtp) {
        setDemoCode(res.demoOtpCode || '245064');
        setOtpModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    await verifyOtp(email, code);
  };

  const handleResendOtp = async () => {
    const res = await register({
      name,
      email,
      phone,
      otpChannel,
      password,
      role,
      studentId,
      department,
      section,
      requireOtp: true,
    });
    return res.demoOtpCode;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-xl">
        <div className="text-center mb-6 flex flex-col items-center">
          <AnimatedBupLogo size="lg" showText={false} />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">Create BUP Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered accounts require Two-Factor OTP verification.
          </p>
        </div>

        {/* Role Switch */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              role === 'student' ? 'bg-bup-700 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('faculty')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              role === 'faculty' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Faculty Member</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Naeem"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                required
              />
            </div>
          </div>

          {/* OTP Verification Method Selector (User Requirement #2) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select OTP Delivery Channel
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setOtpChannel('email')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  otpChannel === 'email'
                    ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>BUP Email OTP</span>
              </button>

              <button
                type="button"
                onClick={() => setOtpChannel('phone')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  otpChannel === 'phone'
                    ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-base">📱</span>
                <span>Mobile SMS OTP</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">BUP Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bup.edu.bd"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {otpChannel === 'phone' ? 'Mobile Number (SMS)' : 'Contact Number'}
              </label>
              <div className="relative">
                <span className="text-xs text-slate-400 absolute left-3.5 top-3 font-semibold">+880</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="17XXXXXXXX"
                  className="w-full pl-14 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  required={otpChannel === 'phone'}
                />
              </div>
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

          {/* Academic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {role === 'student' ? 'Student ID (Roll)' : 'Faculty ID'}
              </label>
              <input
                type="text"
                value={role === 'student' ? studentId : facultyId}
                onChange={(e) => (role === 'student' ? setStudentId(e.target.value) : setFacultyId(e.target.value))}
                placeholder={role === 'student' ? '24549010064' : 'FAC-ICT-001'}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Department of ICT">Dept of ICT</option>
                <option value="Department of CSE">Dept of CSE</option>
                <option value="Department of Business Administration">Dept of BBA</option>
                <option value="Department of Economics">Dept of Economics</option>
                <option value="Department of International Relations">Dept of IR</option>
              </select>
            </div>
          </div>

          {role === 'student' ? (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-bup-700 dark:text-bup-300"
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Faculty Designation</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-bup-700 hover:bg-bup-800 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-bup-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>Proceed to OTP Verification</span>
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-bup-700 dark:text-bup-400 hover:underline"
            >
              Sign In to BUP Social
            </button>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpModal
        isOpen={otpModalOpen}
        email={email}
        phoneNumber={`+880 ${phone}`}
        deliveryChannel={otpChannel}
        demoOtpCode={demoCode}
        onClose={() => setOtpModalOpen(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </div>
  );
};
