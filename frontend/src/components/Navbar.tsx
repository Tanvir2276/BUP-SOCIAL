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
  Home,
  Clock,
  ChevronDown,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ReminderModal } from './ReminderModal';
import { BupGoModal } from './BupGoModal';
import { AnimatedBupLogo } from './AnimatedBupLogo';
import { SecurityShieldModal } from './SecurityShieldModal';
import { NotificationCenterPopover } from './NotificationCenterPopover';
import { CampusSearchModal } from './CampusSearchModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectChat?: (chat: any) => void;
  onViewProfile?: (user: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectChat,
  onViewProfile,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [bupGoModalOpen, setBupGoModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Top Nav Items per reference screenshot: Home, Courses, Clubs, Events, Messages, Notifications
  const navTabs = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'clubs', label: 'Clubs', icon: Users },
    { id: 'routines', label: 'Events', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: BUP Social Brand Logo & Search Bar */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-1 md:flex-initial">
            <div
              onClick={() => setActiveTab('feed')}
              className="cursor-pointer shrink-0 select-none flex items-center"
              title="BUP Social Home"
            >
              <AnimatedBupLogo size="md" />
            </div>

            {/* Pill Search Input matching reference mockup */}
            <div className="relative w-full max-w-xs lg:max-w-sm hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                readOnly
                onClick={() => setSearchModalOpen(true)}
                placeholder="Search for people, courses, clubs, events..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 rounded-full text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none transition-colors cursor-pointer border border-transparent focus:border-blue-500"
              />
            </div>
          </div>

          {/* Center / Right: Desktop Navigation Icons with Labels */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                activeTab === tab.id ||
                (tab.id === 'feed' && activeTab === 'feed') ||
                (tab.id === 'courses' &&
                  (activeTab === 'academics' ||
                    activeTab === 'courses' ||
                    activeTab === 'notices' ||
                    activeTab === 'notes' ||
                    activeTab === 'cgpa')) ||
                (tab.id === 'routines' && (activeTab === 'routines' || activeTab === 'reminders'));

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center px-3.5 xl:px-4 h-14 sm:h-16 transition-colors group cursor-pointer ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={tab.label}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    {tab.badge && (
                      <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                    {tab.label}
                  </span>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Notifications Button with Badge */}
            <div className="relative flex flex-col items-center justify-center px-3 xl:px-3.5 h-14 sm:h-16">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative flex flex-col items-center justify-center transition-colors group ${
                  notificationsOpen
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Notifications"
              >
                <div className="relative">
                  <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black ring-2 ring-white dark:ring-slate-900">
                    3
                  </span>
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                  Notifications
                </span>
                {notificationsOpen && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>

              {/* Notification Popover */}
              <NotificationCenterPopover
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenReminderSettings={() => setReminderModalOpen(true)}
              />
            </div>

            {/* Reminders / Stopwatch Shortcut */}
            <button
              onClick={() => setReminderModalOpen(true)}
              className="flex flex-col items-center justify-center px-2.5 h-14 sm:h-16 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
              title="Class & Exam Reminders"
            >
              <Clock className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
          </nav>

          {/* Right Action Tools & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="md:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Search BUP Campus"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Notifications Button */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="lg:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                3
              </span>
            </button>

            {/* Theme Toggle (Sun/Moon) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark/Light Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User Profile Avatar with Dropdown Arrow */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Account Settings"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs overflow-hidden ring-2 ring-slate-200 dark:ring-slate-700">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-xs animate-in fade-in"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div
                    onClick={() => setActiveTab('profile')}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer border-b border-slate-100 dark:border-slate-800 mb-1"
                  >
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                      {user?.role === 'faculty' ? 'Faculty Member' : `${user?.department || 'FST'} • ${user?.section || 'Section A'}`}
                    </p>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Courses & Sections</span>
                    </button>
                    <button
                      onClick={() => setReminderModalOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                    >
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Reminder Settings</span>
                    </button>
                    <button
                      onClick={() => setBupGoModalOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                    >
                      <Car className="w-4 h-4 text-cyan-600" />
                      <span>BUP-GO RideShare</span>
                    </button>
                    <button
                      onClick={() => setSecurityModalOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      <span>Security & Shield</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reminder Settings Modal */}
      <ReminderModal isOpen={reminderModalOpen} onClose={() => setReminderModalOpen(false)} />

      {/* BUP-GO Connector Modal */}
      <BupGoModal isOpen={bupGoModalOpen} onClose={() => setBupGoModalOpen(false)} />

      {/* 3-Level Security Telemetry Modal */}
      <SecurityShieldModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />

      {/* Global Campus Search Modal */}
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
