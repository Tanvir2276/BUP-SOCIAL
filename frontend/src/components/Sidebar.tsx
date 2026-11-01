import React from 'react';
import {
  Megaphone,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Flag,
  BookOpen,
  FileText,
  Calculator,
  GraduationCap,
  Car,
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

  // Left sidebar items per user request:
  // Elevated CGPA Calculator, Admission Circulars, Research & Publications, Academic Notes Hub
  const navItems = [
    { id: 'notices', label: 'Faculty Notices', icon: Megaphone, badge: 'New' },
    { id: 'cgpa', label: 'CGPA Calculator', icon: Calculator, badge: 'OBE' },
    { id: 'admissions', label: 'Admission Circulars', icon: GraduationCap, badge: '2026' },
    { id: 'research', label: 'Research & Publications', icon: FileText },
    { id: 'notes', label: 'Academic Notes Hub', icon: BookOpen, badge: '3.1 & 3.2' },
    { id: 'reminders', label: 'Custom Reminders', icon: Clock },
    { id: 'pages', label: 'Campus Pages & Groups', icon: Flag, badge: 'Hub' },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-all duration-300 z-30 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] ${
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

      {/* BUP GO Fast Link (Campus RideShare Partner) */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <a
            href="https://bup-go-project-8njl.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 group border border-emerald-400/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-200 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-white" />
                <span>BUP GO RideShare</span>
              </span>
              <span className="flex items-center gap-1 text-[9px] text-white/90 bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
                <span>Live</span>
                <ExternalLink className="w-2.5 h-2.5 text-white" />
              </span>
            </div>
            <p className="text-[11px] leading-tight font-medium opacity-90 text-emerald-50 mt-1">
              BUPian Verified Commute & Smart Campus Ride Sharing.
            </p>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-300 mt-2 group-hover:underline">
              <span>Open BUP GO</span>
              <ExternalLink className="w-3 h-3 text-amber-300" />
            </div>
          </a>
        </div>
      )}
    </aside>
  );
};
