import React, { useState } from 'react';
import { Bell, Clock, Smartphone, Volume2, VolumeX, CheckCircle, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose }) => {
  const { user, updatePreferences } = useAuth();

  const [leadTime, setLeadTime] = useState<number>(user?.reminderSettings?.leadTimeMinutes ?? 15);
  const [device, setDevice] = useState<string>(user?.reminderSettings?.deviceType ?? 'browser');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(user?.reminderSettings?.soundEnabled ?? true);
  const [classReminders, setClassReminders] = useState<boolean>(user?.reminderSettings?.classReminders ?? true);
  const [examReminders, setExamReminders] = useState<boolean>(user?.reminderSettings?.examReminders ?? true);
  const [noticeAlerts, setNoticeAlerts] = useState<boolean>(user?.reminderSettings?.noticeAlerts ?? true);

  const [saving, setSaving] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        reminderSettings: {
          leadTimeMinutes: leadTime,
          deviceType: device,
          soundEnabled,
          classReminders,
          examReminders,
          noticeAlerts,
        },
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestReminder = () => {
    setTestNotificationSent(true);

    // Audio chime synthesis using Web Audio API
    if (soundEnabled && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } catch (e) {}
    }

    // Try HTML5 Browser Notification if permitted
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🎓 BUP Social Class Reminder', {
          body: `Upcoming Class: ICT-2201 Data Structures starts in ${leadTime} minutes in Room 402!`,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    setTimeout(() => setTestNotificationSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Reminder Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize reminder alerts, lead times, and target devices.
            </p>
          </div>
        </div>

        {testNotificationSent && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Reminder Dispatched:</strong> Simulated alert sent to <u>{device}</u> with {leadTime}-min lead time!
            </span>
          </div>
        )}

        <div className="space-y-5 text-sm">
          {/* 1. Time Selection */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-2 text-xs">
              <Clock className="w-4 h-4 text-bup-600" />
              Advance Notification Time (Before Class / Exam)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '10 Mins', val: 10 },
                { label: '15 Mins', val: 15 },
                { label: '30 Mins', val: 30 },
                { label: '60 Mins', val: 60 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setLeadTime(opt.val)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    leadTime === opt.val
                      ? 'bg-bup-700 text-white border-bup-700 shadow-md shadow-bup-700/20'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-bup-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Device Selection */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-2 text-xs">
              <Smartphone className="w-4 h-4 text-bup-600" />
              Target Reminder Device
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'browser', name: 'Current Web Browser', desc: 'Desktop / Laptop push alerts' },
                { id: 'android_pwa', name: 'Android Device (PWA)', desc: 'Mobile homescreen app alerts' },
                { id: 'ios_pwa', name: 'iOS Device (Apple PWA)', desc: 'Safari Web Push notifications' },
                { id: 'email_push', name: 'SMS & University Email', desc: 'BUP Official high-priority alerts' },
              ].map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => setDevice(dev.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    device === dev.id
                      ? 'bg-bup-50/80 dark:bg-bup-950/40 border-bup-600 ring-2 ring-bup-600/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">{dev.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{dev.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Categories & Sound */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-xs text-slate-800 dark:text-slate-200">Audio Chime</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Play chime when reminder triggers</p>
              </div>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border transition-colors ${
                  soundEnabled
                    ? 'bg-bup-100 text-bup-700 dark:bg-bup-900/50 dark:text-bup-300 border-bup-300'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 border-slate-300'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={classReminders}
                  onChange={(e) => setClassReminders(e.target.checked)}
                  className="rounded text-bup-600 focus:ring-bup-500"
                />
                <span>Classes</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={examReminders}
                  onChange={(e) => setExamReminders(e.target.checked)}
                  className="rounded text-bup-600 focus:ring-bup-500"
                />
                <span>Exams</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noticeAlerts}
                  onChange={(e) => setNoticeAlerts(e.target.checked)}
                  className="rounded text-bup-600 focus:ring-bup-500"
                />
                <span>Notices</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestReminder}
            className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Test Device Reminder
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="flex-1 py-2.5 px-3 bg-bup-700 hover:bg-bup-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-md shadow-bup-700/20 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
