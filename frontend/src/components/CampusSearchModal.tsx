import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  User,
  Users,
  Flag,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  School,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { ALL_100_BANGALDESHI_STUDENTS } from '../data/bangladeshiStudents';
import { INITIAL_CAMPUS_PAGES, INITIAL_CAMPUS_GROUPS } from '../data/campusPagesGroups';

interface CampusSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: any) => void;
  onNavigateTab: (tab: string) => void;
}

export const CampusSearchModal: React.FC<CampusSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'STUDENTS' | 'PAGES' | 'GROUPS'>('ALL');

  // Search results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default top suggestions
      return {
        students: ALL_100_BANGALDESHI_STUDENTS.slice(0, 6),
        pages: INITIAL_CAMPUS_PAGES.slice(0, 3),
        groups: INITIAL_CAMPUS_GROUPS.slice(0, 3),
      };
    }

    const students = ALL_100_BANGALDESHI_STUDENTS.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.departmentCode.toLowerCase().includes(q) ||
        s.college.toLowerCase().includes(q) ||
        s.hometown.toLowerCase().includes(q) ||
        s.batch.toLowerCase().includes(q)
      );
    });

    const pages = INITIAL_CAMPUS_PAGES.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q)
      );
    });

    const groups = INITIAL_CAMPUS_GROUPS.filter((g) => {
      return (
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      );
    });

    return { students, pages, groups };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-bup-50 dark:bg-slate-800 text-bup-700 dark:text-bup-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, student ID, pages, groups..."
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800"
          >
            Esc
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterType === 'ALL'
                ? 'bg-bup-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Results
          </button>

          <button
            onClick={() => setFilterType('STUDENTS')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              filterType === 'STUDENTS'
                ? 'bg-bup-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Students & Faculty ({results.students.length})</span>
          </button>

          <button
            onClick={() => setFilterType('PAGES')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              filterType === 'PAGES'
                ? 'bg-bup-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Campus Pages ({results.pages.length})</span>
          </button>

          <button
            onClick={() => setFilterType('GROUPS')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              filterType === 'GROUPS'
                ? 'bg-bup-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Groups ({results.groups.length})</span>
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 1. Students & Profiles */}
          {(filterType === 'ALL' || filterType === 'STUDENTS') && results.students.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-bup-600" />
                  <span>BUP Students & Scholars ({results.students.length})</span>
                </span>
                <span className="text-[10px] text-emerald-600">MySQL Synced</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.students.slice(0, 8).map((stu) => (
                  <div
                    key={stu.id}
                    onClick={() => {
                      onSelectUser(stu);
                      onClose();
                    }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-bup-500 hover:bg-bup-50/40 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-bup-700 overflow-hidden shrink-0 shadow-xs">
                      <img src={stu.avatar} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {stu.name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        ID: <span className="font-mono font-bold text-bup-700 dark:text-bup-400">{stu.studentId}</span> • {stu.departmentCode} ({stu.batch})
                      </p>
                      <p className="text-[9px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <School className="w-2.5 h-2.5 shrink-0" />
                        <span>{stu.college}</span>
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-bup-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Campus Pages */}
          {(filterType === 'ALL' || filterType === 'PAGES') && results.pages.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Official Campus Pages & Clubs</span>
                </span>
                <span className="text-[10px] text-amber-600">Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.pages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => {
                      onNavigateTab('pages');
                      onClose();
                    }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-amber-500 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <img src={page.avatar} alt="" className="w-11 h-11 rounded-2xl object-cover shrink-0 shadow-xs" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {page.name}
                      </h4>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                        {page.category}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        {page.likesCount.toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Campus Groups */}
          {(filterType === 'ALL' || filterType === 'GROUPS') && results.groups.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Campus Groups & Cohorts</span>
                </span>
                <span className="text-[10px] text-emerald-600">Active</span>
              </div>

              <div className="space-y-2">
                {results.groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      onNavigateTab('pages');
                      onClose();
                    }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={group.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-xs" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {group.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {group.privacy} • <span className="font-semibold text-emerald-600">{group.membersCount.toLocaleString()} members</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                      View Group
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.students.length === 0 && results.pages.length === 0 && results.groups.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by student name, ID like "2454901", department "ICT", or "Robotics"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
