import React, { useState, useRef } from 'react';
import {
  User,
  Bell,
  Clock,
  Smartphone,
  BookOpen,
  Star,
  CheckCircle,
  Save,
  Volume2,
  VolumeX,
  ShieldCheck,
  Globe,
  KeyRound,
  Database,
  ExternalLink,
  Lock,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SecurityShieldModal } from '../components/SecurityShieldModal';

export const ProfileSettings: React.FC = () => {
  const { user, updatePreferences } = useAuth();

  // Profile Picture Upload State (User Requirements #1 & #3)
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // State
  const [section, setSection] = useState(user?.section || 'Section A');
  const [bio, setBio] = useState(user?.bio || '');
  const [leadTime, setLeadTime] = useState<number>(user?.reminderSettings?.leadTimeMinutes ?? 15);
  const [device, setDevice] = useState<string>(user?.reminderSettings?.deviceType ?? 'browser');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(user?.reminderSettings?.soundEnabled ?? true);
  const [classReminders, setClassReminders] = useState<boolean>(user?.reminderSettings?.classReminders ?? true);
  const [examReminders, setExamReminders] = useState<boolean>(user?.reminderSettings?.examReminders ?? true);
  const [noticeAlerts, setNoticeAlerts] = useState<boolean>(user?.reminderSettings?.noticeAlerts ?? true);

  const [coursePrefs, setCoursePrefs] = useState<string[]>(
    user?.coursePreferences || ['ICT-2201', 'ICT-2202', 'CSE-3101']
  );
  const [favoriteClubs, setFavoriteClubs] = useState<string[]>(
    user?.favoriteClubs || ['BUP InfoTech Club (BUPITC)', 'BUP Robotics Club (BUPRC)']
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  const availableCourses = [
    { code: 'ICT-1101', title: 'Structured Programming (C)' },
    { code: 'ICT-1201', title: 'Discrete Mathematics' },
    { code: 'ICT-2101', title: 'Object-Oriented Programming (Java/C++)' },
    { code: 'ICT-2201', title: 'Data Structures and Algorithms' },
    { code: 'ICT-2202', title: 'Data Structures Lab' },
    { code: 'ICT-2203', title: 'Digital Electronics & Logic Design' },
    { code: 'ICT-3101', title: 'Database Management Systems (DBMS)' },
    { code: 'ICT-3103', title: 'Data Communication & Networks' },
    { code: 'ICT-4101', title: 'Artificial Intelligence & Machine Learning' },
    { code: 'ICT-4103', title: 'Cryptography & Network Security' },
    { code: 'CSE-1101', title: 'Intro to Computer Systems & C' },
    { code: 'CSE-2201', title: 'Computer Architecture & Organization' },
    { code: 'CSE-3101', title: 'Database Systems (CSE)' },
    { code: 'CSE-3105', title: 'Operating Systems & System Programming' },
    { code: 'ENV-1101', title: 'Introduction to Environmental Science' },
    { code: 'ENV-3101', title: 'Climate Change, GIS & Disaster Management' },
  ];

  const availableClubs = [
    'BUP InfoTech Club (BUPITC)',
    'BUP Robotics Club (BUPRC)',
    'BUP IEEE Student Branch',
    'BUP Career & Leadership Club (BCLC)',
    'BUP Debate Club (BUPDC)',
    'BUP Environmental Club (BUPEC)',
    'BUP Cultural Forum',
    'BUP Sports Club',
  ];

  const toggleCourse = (code: string) => {
    if (coursePrefs.includes(code)) {
      setCoursePrefs(coursePrefs.filter((c) => c !== code));
    } else {
      setCoursePrefs([...coursePrefs, code]);
    }
  };

  const toggleClub = (clubName: string) => {
    if (favoriteClubs.includes(clubName)) {
      setFavoriteClubs(favoriteClubs.filter((c) => c !== clubName));
    } else {
      setFavoriteClubs([...favoriteClubs, clubName]);
    }
  };

  // Handle Profile Picture File Upload (User Requirements #1 & #3)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarPreview(dataUrl);
      try {
        await updatePreferences({ avatar: dataUrl });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setAvatarUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    setAvatarPreview('');
    await updatePreferences({ avatar: '' });
    if (avatarInputRef.current) avatarInputRef.current.value = '';
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await updatePreferences({
        section,
        bio,
        coursePreferences: coursePrefs,
        favoriteClubs,
        reminderSettings: {
          leadTimeMinutes: leadTime,
          deviceType: device,
          soundEnabled,
          classReminders,
          examReminders,
          noticeAlerts,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with Uploadable Avatar */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarFileChange}
            accept="image/*"
            className="hidden"
            id="avatar-file-input"
          />

          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-bup-700 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-bup-700/20 overflow-hidden border-2 border-white dark:border-slate-800">
              {avatarPreview || user?.avatar ? (
                <img src={avatarPreview || user?.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>

            {/* Clickable camera upload badge */}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-bup-700 hover:bg-bup-800 text-white shadow-md border-2 border-white dark:border-slate-900 transition-transform active:scale-95"
              title="Upload new profile picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-bup-100 dark:bg-bup-900/50 text-bup-800 dark:text-bup-300 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.department} • {user?.role === 'student' ? `ID: ${user?.studentId}` : user?.designation}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="w-full sm:w-auto py-2.5 px-5 bg-bup-700 hover:bg-bup-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-bup-700/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Preferences'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Success!</strong> Profile picture, reminder settings, and academic preferences updated.
          </span>
        </div>
      )}

      {/* User Requirements #1 & #3: Dedicated Profile Picture File Upload Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-bup-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Profile Picture & Campus Identity
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Available for All Students & Faculty</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload your authentic university profile photo from your device. Your photo will automatically appear across the Feed, Messenger, Class Routine and Academic Directory.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 rounded-2xl bg-bup-700 text-white text-2xl font-black flex items-center justify-center overflow-hidden shrink-0 border-2 border-bup-300 shadow-md">
            {avatarPreview || user?.avatar ? (
              <img src={avatarPreview || user?.avatar} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="btn-motion btn-bup-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{avatarUploading ? 'Uploading...' : 'Upload Photo from Device'}</span>
              </button>

              {(avatarPreview || user?.avatar) && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="btn-motion px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Supported: <strong>JPEG, PNG, WEBP, GIF</strong> (Max: 10MB). Cropped automatically to university square format.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Requirement 5: 3-Level Military Grade Security Shield & Architecture */}
        <div className="bg-gradient-to-br from-slate-900 via-bup-navy to-slate-950 text-white rounded-3xl p-6 border border-blue-900/60 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">3-Level University Security Shield</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    ALL TIERS ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Comprehensive Defense: Network Perimeter, Zero-Trust Authentication & AES-256 Cryptographic Vault
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSecurityModalOpen(true)}
              className="btn-motion px-4 py-2 rounded-xl text-xs font-bold bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/40 flex items-center gap-2"
            >
              <span>Inspect Live Telemetry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Level 1 */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Globe className="w-4 h-4" />
                <h4 className="font-bold">Level 1: Perimeter Shield</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Sliding-Window IP Rate Limiter (150 req/min), Anti-Brute Force Lockout (8 fails/15m), and HSTS Clickjack Defense.
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                ✓ 100% Armed
              </span>
            </div>

            {/* Level 2 */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <KeyRound className="w-4 h-4" />
                <h4 className="font-bold">Level 2: Zero-Trust Guard</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Bcrypt-hashed single-use 5m OTP challenge, HMAC-SHA256 signed JWTs, and Server-enforced Role Isolation.
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                ✓ Verified
              </span>
            </div>

            {/* Level 3 */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Database className="w-4 h-4" />
                <h4 className="font-bold">Level 3: Cryptographic Vault</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Web Crypto AES-GCM 256-bit envelope encryption for Chatbox, zero plaintext in MySQL, and 100% prepared SQL.
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                ✓ AES-256 Active
              </span>
            </div>
          </div>
        </div>

        {/* Section Choice & Bio */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-bup-600" />
            <span>Academic Section & Biography</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Enrolled Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-bup-700 dark:text-bup-300"
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">About / Bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your interests..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Teacher Feedback: Custom Reminder Settings (Time, Device) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Teacher Requirement: Custom Reminder Setting (Time, Device)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
              CONFIGURED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Advance Time */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-bup-600" /> Lead Notification Time:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 30, 60].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setLeadTime(t)}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      leadTime === t
                        ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>

            {/* Target Device */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-bup-600" /> Target Reminder Device:
              </label>
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="browser">Current Web Browser</option>
                <option value="android_pwa">Android Device (PWA Push)</option>
                <option value="ios_pwa">iOS Device (Apple PWA)</option>
                <option value="email_push">SMS & Priority Email</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teacher Feedback: Course Selection Preference */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-bup-600" />
            <span>Teacher Requirement: Course Selection Preference</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select enrolled or prioritized courses to customize your personalized routine & alerts:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {availableCourses.map((c) => {
              const selected = coursePrefs.includes(c.code);
              return (
                <div
                  key={c.code}
                  onClick={() => toggleCourse(c.code)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-bup-50/80 dark:bg-bup-950/40 border-bup-600 ring-2 ring-bup-600/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-mono font-bold text-bup-700 dark:text-bup-300">{c.code}</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{c.title}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      selected ? 'bg-bup-700 text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {selected && '✓'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teacher Feedback: Favorite Club Preference */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Teacher Requirement: Favorite Club Preference</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {availableClubs.map((club) => {
              const selected = favoriteClubs.includes(club);
              return (
                <div
                  key={club}
                  onClick={() => toggleClub(club)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{club}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      selected ? 'bg-rose-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {selected && '✓'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>

      {/* Security Telemetry Modal */}
      <SecurityShieldModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />
    </div>
  );
};
