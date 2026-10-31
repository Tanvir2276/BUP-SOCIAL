import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  Car,
  User as UserIcon,
  BookOpen,
  Calendar,
  MessageSquare,
  Users,
  Search,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ReminderModal } from './ReminderModal';
import { BupGoModal } from './BupGoModal';
import { AnimatedBupLogo } from './AnimatedBupLogo';
import { SecurityShieldModal } from './SecurityShieldModal';
import { NotificationCenterPopover } from './NotificationCenterPopover';
import { CampusSearchModal } from './CampusSearchModal';
import { ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectChat?: (chat: any) => void;
  onViewProfile?: (user: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onSelectChat, onViewProfile }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [bupGoModalOpen, setBupGoModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isFaculty = user?.role === 'faculty';
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('feed')}
            className="cursor-pointer shrink-0 select-none max-w-[55%] sm:max-w-none"
          >
            <AnimatedBupLogo size="md" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
            {[
              { id: 'feed', label: 'Community Feed' },
              { id: 'academics', label: 'Academics & Notices' },
              { id: 'routines', label: 'Routine Hub' },
              { id: 'clubs', label: 'Clubs & Events' },
              { id: 'lostfound', label: 'Lost & Found' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'btn-bup-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Campus Global Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/80 hover:border-bup-500 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
              title="Search students, faculty, pages, groups..."
            >
              <Search className="w-3.5 h-3.5 text-bup-600 dark:text-bup-400" />
              <span>Search BUP Campus...</span>
            </button>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="sm:hidden p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Search BUP Campus"
            >
              <Search className="w-4 h-4 text-bup-600" />
            </button>

            {/* Campus Notification Center Popover (Classes, Exams, Notes) */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-1.5 sm:p-2 rounded-xl transition-colors relative ${
                  notificationsOpen
                    ? 'btn-bup-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-bup-700 dark:hover:text-bup-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Campus Notifications (Classes, Exams, Notes)"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              </button>

              <NotificationCenterPopover
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenReminderSettings={() => setReminderModalOpen(true)}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Messenger Direct Shortcut to DM */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`p-1.5 sm:p-2 rounded-xl transition-colors relative ${
                activeTab === 'messages'
                  ? 'btn-bup-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-bup-700 dark:hover:text-bup-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Open DM (Direct Messages)"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 sm:p-1.5 sm:pl-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-bup-700 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[110px]">
                    {user?.name?.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">
                    {user?.role === 'faculty' ? 'Faculty' : user?.studentId || 'Student'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xs:block" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-xs animate-in fade-in"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="mt-1.5 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-bup-100 dark:bg-bup-900/40 text-bup-800 dark:text-bup-300">
                      {user?.role} • {user?.section || 'Section A'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-bup-600" />
                      <span>Preferences & Reminders</span>
                    </button>
                    <button
                      onClick={() => setReminderModalOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-500" />
                      <span>Reminder Settings</span>
                    </button>
                    <button
                      onClick={() => setBupGoModalOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Car className="w-3.5 h-3.5 text-emerald-500" />
                      <span>BUP-GO Launcher</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reminder Modal */}
      <ReminderModal isOpen={reminderModalOpen} onClose={() => setReminderModalOpen(false)} />

      {/* BUP-GO Connector Modal */}
      <BupGoModal isOpen={bupGoModalOpen} onClose={() => setBupGoModalOpen(false)} />

      {/* 3-Level Security Telemetry Modal */}
      <SecurityShieldModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />

      {/* Global Campus Search Modal (Students, Faculty, Pages, Groups) */}
      <CampusSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectUser={(u) => {
          if (onViewProfile) onViewProfile(u);
          else setActiveTab('profile');
        }}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </>
  );
};
