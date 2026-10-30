import React from 'react';
import {
  Home,
  Users,
  BookOpen,
  Megaphone,
  Calendar,
  Clock,
  Bell,
  MessageSquare,
  Car,
  Compass,
  HelpCircle,
  Bookmark,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
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

  const navItems = [
    { id: 'feed', label: 'News Feed', icon: Home, badge: 'Live' },
    { id: 'academics', label: 'Courses & Sections', icon: BookOpen },
    { id: 'notices', label: 'Faculty Notices', icon: Megaphone, badge: 'New' },
    { id: 'communities', label: 'Academic Communities', icon: Users },
    { id: 'routines', label: 'Routine Hub', icon: Calendar },
    { id: 'reminders', label: 'Custom Reminders', icon: Clock },
    { id: 'clubs', label: 'Clubs & Events', icon: Users },
    { id: 'rides', label: 'RideShare & Travel', icon: Car, linkBupGo: true },
    { id: 'messages', label: 'Chatbox', icon: MessageSquare, badge: 'Live' },
    { id: 'lostfound', label: 'Lost & Found', icon: HelpCircle },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-all duration-300 z-30 shrink-0 sticky top-16 h-[calc(100vh-4rem)] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* User Quick Info */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-1"
        >
          <div className="w-9 h-9 rounded-xl bg-bup-700 text-white font-black flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 capitalize truncate">
                {isFaculty ? `${user?.designation || 'Faculty'}` : `${user?.section || 'Section A'}`}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-bup-700 text-white shadow-md shadow-bup-700/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-bup-100 group-hover:text-bup-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-bup-100 text-bup-800 dark:bg-bup-900/50 dark:text-bup-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* BUP-GO Live Bridge Quick Launcher at bottom of sidebar */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-90">BUP-GO Ride System</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            </div>
            <p className="text-[11px] leading-tight font-medium opacity-90">
              Direct access to live BUP-GO campus rides!
            </p>
            <a
              href="https://bup-go-project-8njl.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-950 bg-white hover:bg-emerald-50 px-2.5 py-1 rounded-xl transition-colors mt-1"
            >
              <span>Launch BUP-GO</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </aside>
  );
};
