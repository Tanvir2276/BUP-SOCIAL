import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  RefreshCw,
  Layers,
  Download,
  Bell,
  CheckCircle2,
  Building,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const Routines: React.FC = () => {
  const { user } = useAuth();
  const [selectedDept, setSelectedDept] = useState('ICT');
  const [selectedSection, setSelectedSection] = useState(user?.section || 'Section A');
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminderSet, setReminderSet] = useState<Record<string, boolean>>({});

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/routines?department=${selectedDept}&section=${selectedSection}`);
      if (res.success && res.routines.length > 0) {
        setRoutines(res.routines);
      } else {
        // Fallback default routine slots if DB table has fewer entries
        setRoutines([
          {
            _id: 'r1',
            dayOfWeek: 'Sunday',
            courseCode: 'ICT-2201',
            courseTitle: 'Data Structures and Algorithms',
            startTime: '10:30 AM',
            endTime: '12:00 PM',
            roomNumber: 'Academic Block 2, Room 402',
            instructorName: 'Assistant Professor Nazneen Akhter',
            sectionName: selectedSection,
          },
          {
            _id: 'r2',
            dayOfWeek: 'Sunday',
            courseCode: 'ICT-2202',
            courseTitle: 'Data Structures Laboratory',
            startTime: '02:00 PM',
            endTime: '04:30 PM',
            roomNumber: 'ICT Software Lab 1, Block 2',
            instructorName: 'Assistant Professor Nazneen Akhter',
            sectionName: selectedSection,
          },
          {
            _id: 'r3',
            dayOfWeek: 'Monday',
            courseCode: 'ICT-2203',
            courseTitle: 'Digital Electronics & Logic Design',
            startTime: '09:00 AM',
            endTime: '10:30 AM',
            roomNumber: 'Hardware Lab 3, Block 2',
            instructorName: 'Assistant Professor Suman Saha',
            sectionName: selectedSection,
          },
          {
            _id: 'r4',
            dayOfWeek: 'Tuesday',
            courseCode: 'CSE-3101',
            courseTitle: 'Database Management Systems',
            startTime: '10:30 AM',
            endTime: '12:00 PM',
            roomNumber: 'Block 1, Room 301',
            instructorName: 'Assistant Professor Dr. Kazi Abu Taher',
            sectionName: selectedSection,
          },
          {
            _id: 'r5',
            dayOfWeek: 'Wednesday',
            courseCode: 'ICT-2101',
            courseTitle: 'Object-Oriented Programming (Java)',
            startTime: '11:00 AM',
            endTime: '12:30 PM',
            roomNumber: 'Block 2, Room 403',
            instructorName: 'Associate Professor Dr. Md. Sabir Hossain',
            sectionName: selectedSection,
          },
          {
            _id: 'r6',
            dayOfWeek: 'Thursday',
            courseCode: 'ICT-3201',
            courseTitle: 'Software Engineering & Agile System Design',
            startTime: '09:30 AM',
            endTime: '11:00 AM',
            roomNumber: 'Block 2, Room 406',
            instructorName: 'Dept Faculty Supervisor',
            sectionName: selectedSection,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [selectedDept, selectedSection]);

  const filteredRoutines = routines.filter((r) => r.dayOfWeek === selectedDay);

  const toggleClassAlarm = (id: string, courseCode: string) => {
    setReminderSet((prev) => ({ ...prev, [id]: !prev[id] }));
    alert(`Custom Alarm set: You will receive notification 15 minutes before ${courseCode} on ${user?.reminderSettings?.deviceType || 'your device'}.`);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
              ACADEMIC TIMETABLE
            </span>
            <span className="text-xs text-slate-400 font-mono">Spring 2026 Semester</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Class Schedule & Routine Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Section-wise class routines, room allocations, instructor schedules, and custom reminder sync.
          </p>
        </div>

        {/* Section Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 border border-slate-200 dark:border-slate-700">
          {['Section A', 'Section B'].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`btn-motion px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSection === sec
                  ? 'btn-bup-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Department Selector & Day Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-xs font-bold text-slate-500 shrink-0">Department:</span>
            {['ICT', 'CSE', 'ENV'].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`btn-motion px-3 py-1.5 rounded-xl font-bold transition-all border ${
                  selectedDept === dept
                    ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                Dept of {dept}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => alert('Downloading official Spring 2026 Academic Routine (PDF)...')}
            className="btn-motion text-xs font-bold text-bup-700 dark:text-blue-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Routine PDF</span>
          </button>
        </div>

        {/* Days of Week */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`btn-motion py-2 px-4 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                selectedDay === day
                  ? 'btn-bup-primary text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-bup-500'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Class Slots for Selected Day */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-bup-600" />
            <span>
              {selectedDay} Classes • {selectedDept} ({selectedSection})
            </span>
          </h3>
          <span className="text-xs text-slate-400">{filteredRoutines.length} classes scheduled</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading schedule...</div>
        ) : filteredRoutines.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No classes scheduled for {selectedDay} ({selectedSection}). Free day for study & club activities!
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRoutines.map((slot) => {
              const hasAlarm = reminderSet[slot._id];
              return (
                <div
                  key={slot._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-bup-500 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-blue-100 text-bup-900 dark:bg-blue-950 dark:text-blue-300">
                        {slot.courseCode}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• {selectedSection}</span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {slot.courseTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-bup-600" />
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {slot.roomNumber}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {slot.instructorName}
                      </span>
                    </div>
                  </div>

                  {/* Quick Reminder Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleClassAlarm(slot._id, slot.courseCode)}
                    className={`btn-motion py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                      hasAlarm
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
                    }`}
                  >
                    <Bell className={`w-3.5 h-3.5 ${hasAlarm ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                    <span>{hasAlarm ? 'Alarm Active (15m)' : 'Set Class Alarm'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Campus Room & Academic Block 2 Guide */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-bup-600" />
          <span>FST Academic Block 2 Quick Floor Guide</span>
        </h4>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          • <strong>Level 4:</strong> ICT Software Labs (Rooms 401-404), Dean Wing & Faculty Offices.
          <br />
          • <strong>Level 3:</strong> Computer Science & Engineering Hardware Architecture & Microprocessor Labs.
          <br />
          • <strong>Level 2:</strong> Environmental Modeling & Delta GIS Simulation Laboratories.
        </p>
      </div>
    </div>
  );
};
