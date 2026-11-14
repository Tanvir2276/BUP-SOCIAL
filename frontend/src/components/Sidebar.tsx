import React from 'react';
import {
  Home,
  User as UserIcon,
  Users,
  BookOpen,
  Megaphone,
  Calendar,
  Flag,
  Car,
  Package,
  Bookmark,
  Bell,
  Settings,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  const { user } = useAuth();
  const isFaculty = user?.role === 'faculty';

  // Navigation Items matching the reference screenshot in exact sequence:
  // 1. News Feed, 2. My Profile, 3. Academic Communities, 4. Courses & Sections,
  // 5. Faculty Notices, 6. Routine Hub, 7. Clubs & Events, 8. RideShare,
  // 9. Travel Partners, 10. Lost & Found, 11. Saved Posts, 12. Reminders, 13. Settings
  const navItems = [
    { id: 'feed', label: 'News Feed', icon: Home },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'communities', label: 'Academic Communities', icon: Users },
    { id: 'courses', label: 'Courses & Sections', icon: BookOpen },
    { id: 'notices', label: 'Faculty Notices', icon: Megaphone },
    { id: 'routines', label: 'Routine Hub', icon: Calendar },
    { id: 'clubs', label: 'Clubs & Events', icon: Flag },
    { id: 'rides', label: 'RideShare', icon: Car, isPartner: true },
    { id: 'travel', label: 'Travel Partners', icon: Users },
    { id: 'lostfound', label: 'Lost & Found', icon: Package },
    { id: 'saved', label: 'Saved Posts', icon: Bookmark },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all duration-300 z-30 shrink-0 sticky top-14 sm:top-16 self-start h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* User Profile Card Header */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 cursor-pointer p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-1 min-w-0 group"
          title="View Profile"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black flex items-center justify-center shrink-0 shadow-sm overflow-hidden ring-2 ring-blue-500/30">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                {user?.name || 'Tanjim Rahman'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {isFaculty
                  ? `${user?.designation || 'Faculty'} • BUP`
                  : `${user?.department?.split(' ')[0] || 'CSE'} • BUP`}
              </p>
            </div>
          )}

          {!collapsed && (
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Vertical Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'courses' && activeTab === 'academics') ||
            (item.id === 'settings' && activeTab === 'profile' && false);

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'rides') {
                  setActiveTab('rides');
                } else if (item.id === 'settings') {
                  setActiveTab('profile');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {!collapsed && item.isPartner && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Live
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* BUP GO Fast Card at bottom of sidebar */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <a
            href="https://bup-go-project-8njl.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                <span>BUP GO RideShare</span>
              </span>
              <ExternalLink className="w-3 h-3 opacity-80 group-hover:opacity-100" />
            </div>
            <p className="text-[10px] text-emerald-100 mt-0.5 leading-tight">
              Instant Verified Commute for BUPians
            </p>
          </a>
        </div>
      )}
    </aside>
  );
};
