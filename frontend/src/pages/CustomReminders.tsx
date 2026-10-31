import React, { useState, useEffect } from 'react';
import {
  Clock,
  Bell,
  Plus,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Trash2,
  Volume2,
  Sparkles,
  BookOpen,
  Award,
  Bus,
  Check,
  X,
  Smartphone,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface CustomReminder {
  id: string;
  title: string;
  category: 'Assignment' | 'Exam' | 'Quiz' | 'Project' | 'Bus' | 'Personal';
  dueDate: string;
  dueTime: string;
  leadMinutes: number;
  priority: 'high' | 'medium' | 'low';
  soundEnabled: boolean;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export const CustomReminders: React.FC<{ onNavigateRoutine?: () => void }> = ({ onNavigateRoutine }) => {
  const { user } = useAuth();

  // State for Custom Reminders
  const [reminders, setReminders] = useState<CustomReminder[]>(() => {
    try {
      const saved = localStorage.getItem('bupsoc_custom_reminders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'rem-1',
        title: 'Submit Database Lab Project Phase 1 (Schema & ERD)',
        category: 'Assignment',
        dueDate: '2026-11-04',
        dueTime: '23:59',
        leadMinutes: 60,
        priority: 'high',
        soundEnabled: true,
        notes: 'Upload SQL schema and relational model to FST LMS portal',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rem-2',
        title: 'Data Structures Mid-term Viva Prep (Trees & Graphs)',
        category: 'Exam',
        dueDate: '2026-11-06',
        dueTime: '10:00',
        leadMinutes: 30,
        priority: 'high',
        soundEnabled: true,
        notes: 'ST-605 Academic Block 2. Bring printed laboratory sheets.',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rem-3',
        title: 'BUP Campus Shuttle Bus - Morning Route from Mirpur 10',
        category: 'Bus',
        dueDate: '2026-11-02',
        dueTime: '07:30',
        leadMinutes: 15,
        priority: 'medium',
        soundEnabled: true,
        notes: 'Departure sharp at 07:45 AM from Mirpur-10 roundabout stop.',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // State for synced Routine Hub Alarms
  const [routineAlarms, setRoutineAlarms] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('bupsoc_routine_alarms');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'routine' | 'exams'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [testChimePlaying, setTestChimePlaying] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Assignment' | 'Exam' | 'Quiz' | 'Project' | 'Bus' | 'Personal'>('Assignment');
  const [formDate, setFormDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState('14:00');
  const [formLead, setFormLead] = useState<number>(15);
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [formNotes, setFormNotes] = useState('');

  // Persist custom reminders
  useEffect(() => {
    localStorage.setItem('bupsoc_custom_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Audio Chime synthesizer with Web Audio API
  const playSoundChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      setTestChimePlaying(true);

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.4);
      });

      setTimeout(() => setTestChimePlaying(false), 900);
    } catch (e) {
      console.error(e);
      setTestChimePlaying(false);
    }
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newReminder: CustomReminder = {
      id: 'rem-' + Date.now(),
      title: formTitle.trim(),
      category: formCategory,
      dueDate: formDate,
      dueTime: formTime,
      leadMinutes: formLead,
      priority: formPriority,
      soundEnabled: true,
      notes: formNotes.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setReminders((prev) => [newReminder, ...prev]);

    // Push to bupsoc_notifications center
    try {
      const stored = localStorage.getItem('bupsoc_notifications');
      const notifs = stored ? JSON.parse(stored) : [];
      notifs.unshift({
        id: `custom_rem_${newReminder.id}`,
        category: formCategory === 'Exam' || formCategory === 'Quiz' ? 'Exams' : 'Classes',
        title: `Reminder Created: ${newReminder.title}`,
        description: `Scheduled for ${formDate} at ${formTime}. Lead reminder set ${formLead} min before.`,
        time: 'Just now',
        unread: true,
      });
      localStorage.setItem('bupsoc_notifications', JSON.stringify(notifs.slice(0, 30)));
    } catch (err) {}

    // Reset and close
    setFormTitle('');
    setFormNotes('');
    setModalOpen(false);
    playSoundChime();
  };

  const toggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Toggle routine hub alarm
  const toggleRoutineAlarm = (slotId: string) => {
    const updated = { ...routineAlarms, [slotId]: !routineAlarms[slotId] };
    setRoutineAlarms(updated);
    localStorage.setItem('bupsoc_routine_alarms', JSON.stringify(updated));
  };

  // Active routine alarm counts
  const activeRoutineCount = Object.values(routineAlarms).filter(Boolean).length;
  const pendingCount = reminders.filter((r) => !r.completed).length;
  const completedCount = reminders.filter((r) => r.completed).length;

  const filteredReminders = reminders.filter((r) => {
    if (activeFilter === 'pending') return !r.completed;
    if (activeFilter === 'completed') return r.completed;
    if (activeFilter === 'exams') return r.category === 'Exam' || r.category === 'Quiz';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Header with Stats & Actions */}
      <div className="bg-gradient-to-r from-bup-900 via-slate-900 to-bup-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/50">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Campus Alert & Schedule Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>BUP Custom Reminders</span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Never miss a lab submission, routine class lecture, or bus departure. Set audible alarms and schedule notifications tailored to your academic batch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={playSoundChime}
              className={`p-3 rounded-2xl border backdrop-blur-md transition-all text-xs font-bold flex items-center gap-2 ${
                testChimePlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Test Chime Sound"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Test Chime</span>
            </button>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-motion px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Reminder</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400">Routine Alarms</span>
            <p className="text-xl font-black text-amber-400 mt-0.5">{activeRoutineCount} Active</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pending Tasks</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{pendingCount} Due</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400">Completed</span>
            <p className="text-xl font-black text-slate-300 mt-0.5">{completedCount} Done</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400">Device Sync</span>
            <p className="text-xl font-black text-sky-400 mt-0.5 flex items-center gap-1.5">
              <span>Enabled</span>
              <Smartphone className="w-4 h-4" />
            </p>
          </div>
        </div>
      </div>

      {/* 2. Filter Navigation Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Reminders' },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'exams', label: 'Exams & Quizzes' },
            { id: 'routine', label: `Routine Alarms (${activeRoutineCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeFilter === tab.id
                  ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-bup-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Synced Routine Alarms Section (if active or on 'routine' filter) */}
      {(activeFilter === 'all' || activeFilter === 'routine') && activeRoutineCount > 0 && (
        <div className="bg-amber-500/10 dark:bg-amber-950/20 border border-amber-300/40 dark:border-amber-700/40 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500 animate-pulse" />
              <h3 className="font-extrabold text-xs text-amber-950 dark:text-amber-200 uppercase tracking-wide">
                Active Routine Hub Alarms ({activeRoutineCount})
              </h3>
            </div>
            {onNavigateRoutine && (
              <button
                type="button"
                onClick={onNavigateRoutine}
                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Manage in Routine Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(routineAlarms)
              .filter(([_, active]) => active)
              .map(([slotId]) => (
                <div
                  key={slotId}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 shadow-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      Class Alarm: {slotId.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400">
                      Chime audio + 15m lead notification
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRoutineAlarm(slotId)}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[10px] font-bold"
                    title="Dismiss Alarm"
                  >
                    Turn Off
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. Reminders List */}
      {activeFilter !== 'routine' && (
        <div className="space-y-3">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                All caught up! No reminders found.
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "Add Custom Reminder" to schedule upcoming lab quizzes, course homework, or transport alerts.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn-motion btn-bup-primary px-4 py-2 rounded-xl text-xs font-bold text-white inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Reminder</span>
              </button>
            </div>
          ) : (
            filteredReminders.map((reminder) => {
              const isPast = new Date(`${reminder.dueDate}T${reminder.dueTime}`).getTime() < Date.now();
              return (
                <div
                  key={reminder.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    reminder.completed
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-bup-500/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleComplete(reminder.id)}
                      className={`w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        reminder.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {reminder.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-bold text-xs sm:text-sm ${
                            reminder.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {reminder.title}
                        </span>

                        {/* Category Chip */}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {reminder.category}
                        </span>

                        {/* Priority Chip */}
                        {reminder.priority === 'high' && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                            High Priority
                          </span>
                        )}
                      </div>

                      {reminder.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {reminder.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                          <Calendar className="w-3 h-3 text-bup-600" />
                          {reminder.dueDate} at {reminder.dueTime}
                        </span>
                        <span>•</span>
                        <span>Lead: {reminder.leadMinutes}m before</span>
                        {isPast && !reminder.completed && (
                          <>
                            <span>•</span>
                            <span className="text-rose-600 font-bold flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={playSoundChime}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Test Audio Chime"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. Create Reminder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-bup-700/10 text-bup-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Add Custom Campus Reminder
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reminder Title & Purpose *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Submit Software Engineering SRS Document"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Assignment">Assignment & HW</option>
                    <option value="Exam">Final / Midterm Exam</option>
                    <option value="Quiz">Lab Quiz / Class Test</option>
                    <option value="Project">Project Presentation</option>
                    <option value="Bus">Campus Bus / Shuttle</option>
                    <option value="Personal">Personal Routine</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Normal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alarm Lead Time (Remind Me Before)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 15, 30, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setFormLead(mins)}
                      className={`p-2 rounded-xl font-bold border transition-all text-center ${
                        formLead === mins
                          ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-bup-400'
                      }`}
                    >
                      {mins >= 60 ? '1 hour' : `${mins} mins`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Notes / Location
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. ST-704 Laboratory Annex or Google Drive link"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-motion btn-bup-primary px-5 py-2.5 rounded-xl text-white font-bold shadow-md shadow-bup-700/20"
                >
                  Save & Activate Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
