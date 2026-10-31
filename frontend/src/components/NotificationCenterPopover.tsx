import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  Trash2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Sliders,
  X,
} from 'lucide-react';

export interface CampusNotification {
  id: string;
  category: 'Classes' | 'Exams' | 'Notes';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  actionLabel?: string;
  actionTab?: string;
  linkUrl?: string;
}

interface NotificationCenterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenReminderSettings: () => void;
}

const DEFAULT_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'n-cls-1',
    category: 'Classes',
    title: 'Upcoming Lab: ICE-3205 Web Technologies',
    description: 'Scheduled for 10:15 AM in ICT Software Lab 1 (ST-504). Reminder alarm active.',
    time: '15m ago',
    unread: true,
    actionLabel: 'View Timetable',
    actionTab: 'routines',
  },
  {
    id: 'n-exm-1',
    category: 'Exams',
    title: 'Online Quiz Active: Data Structures (20 Marks)',
    description: 'Published by Asst. Prof. Nazneen Akter for BICE-2024 Section A & B. 15 minutes duration.',
    time: '45m ago',
    unread: true,
    actionLabel: 'Start Quiz Now',
    actionTab: 'routines',
  },
  {
    id: 'n-not-1',
    category: 'Notes',
    title: 'New Study Material: Software SRS Specification Guide',
    description: 'ICE-3207 agile breakdown and diagram templates uploaded to Study Notes Hub.',
    time: '2h ago',
    unread: true,
    actionLabel: 'Download Handout',
    actionTab: 'routines',
  },
  {
    id: 'n-cls-2',
    category: 'Classes',
    title: 'Routine Reschedule: MATH-2207 Complex Analysis',
    description: 'Notice posted by Col Mohammed Omar Faruque: Lecture relocated to Room ST-504.',
    time: 'Yesterday',
    unread: false,
    actionLabel: 'Check Room',
    actionTab: 'routines',
  },
  {
    id: 'n-exm-2',
    category: 'Exams',
    title: 'Midterm Examination Schedule Approved',
    description: 'Dean Office, FST announced final Midterm examination dates for July-Dec 2026.',
    time: '2 days ago',
    unread: false,
    actionLabel: 'View Notice',
    actionTab: 'academics',
  },
  {
    id: 'n-not-2',
    category: 'Notes',
    title: 'Full-Stack Web Architecture Lab Exercises (PDF)',
    description: 'Session 4 Database Connection Pooling and JWT notes ready for download.',
    time: '3 days ago',
    unread: false,
    actionLabel: 'Open Material',
    actionTab: 'routines',
  },
];

export const NotificationCenterPopover: React.FC<NotificationCenterPopoverProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenReminderSettings,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Classes' | 'Exams' | 'Notes'>('All');
  const [notifications, setNotifications] = useState<CampusNotification[]>(DEFAULT_NOTIFICATIONS);

  // Load from localStorage or sync defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bupsoc_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge unique stored with defaults
          const ids = new Set(parsed.map((p) => p.id));
          const merged = [...parsed, ...DEFAULT_NOTIFICATIONS.filter((d) => !ids.has(d.id))];
          setNotifications(merged);
          return;
        }
      }
    } catch (e) {}
    setNotifications(DEFAULT_NOTIFICATIONS);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    localStorage.setItem('bupsoc_notifications', JSON.stringify(updated));
  };

  const handleDismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('bupsoc_notifications', JSON.stringify(updated));
  };

  const handleActionClick = (n: CampusNotification) => {
    // Mark item read
    const updated = notifications.map((item) => (item.id === n.id ? { ...item, unread: false } : item));
    setNotifications(updated);
    localStorage.setItem('bupsoc_notifications', JSON.stringify(updated));

    onClose();
    if (n.actionTab) {
      onNavigateTab(n.actionTab);
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeCategory === 'All') return true;
    return n.category === activeCategory;
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
                <Bell className="w-4 h-4 fill-amber-500" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-bup-700 dark:text-bup-400 hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Tabs: All, Classes, Exams, Notes (User Requirement #4) */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            {(['All', 'Classes', 'Exams', 'Notes'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 rounded-lg text-[11px] transition-all ${
                  activeCategory === cat
                    ? 'btn-bup-primary text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Stream */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/70" />
              <p className="font-bold text-slate-700 dark:text-slate-300">All caught up!</p>
              <p className="text-[11px] mt-0.5 text-slate-500">No {activeCategory.toLowerCase()} alerts at the moment.</p>
            </div>
          ) : (
            filtered.map((n) => {
              const isClass = n.category === 'Classes';
              const isExam = n.category === 'Exams';

              return (
                <div
                  key={n.id}
                  onClick={() => handleActionClick(n)}
                  className={`pt-2 p-2.5 rounded-2xl cursor-pointer transition-colors relative flex items-start gap-3 ${
                    n.unread
                      ? 'bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {/* Category Indicator Icon */}
                  <div
                    className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center ${
                      isClass
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                        : isExam
                        ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                    }`}
                  >
                    {isClass ? (
                      <Calendar className="w-4 h-4" />
                    ) : isExam ? (
                      <Award className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {n.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-tight">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {n.description}
                    </p>

                    {n.actionLabel && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-bup-700 dark:text-emerald-400 hover:underline">
                        <span>{n.actionLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Actions & Unread Indicator */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDismissNotification(n.id, e)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 opacity-60 hover:opacity-100 transition-opacity"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Device Reminder Settings Shortcut */}
        <div className="p-2.5 px-3.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReminderSettings();
            }}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-bup-700 dark:hover:text-emerald-400 font-bold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Device Alarm & Reminder Setup</span>
          </button>
          <span className="text-[10px] text-slate-400 font-mono">BUP SoCo</span>
        </div>
      </div>
    </>
  );
};
