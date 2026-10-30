import React, { useState } from 'react';
import { Megaphone, AlertCircle, CheckCircle, FileText, X } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoticeCreated: () => void;
}

export const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({ isOpen, onClose, onNoticeCreated }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Exam');
  const [departmentCode, setDepartmentCode] = useState('ICT');
  const [courseCode, setCourseCode] = useState('ICT-2201');
  const [sectionName, setSectionName] = useState('Section A');
  const [urgency, setUrgency] = useState<'normal' | 'important' | 'urgent'>('important');
  const [attachmentName, setAttachmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide a title and notice content.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await apiFetch('/notices', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          category,
          scope: 'CourseSection',
          departmentCode,
          courseCode,
          sectionName,
          urgency,
          attachmentName: attachmentName || undefined,
        }),
      });
      onNoticeCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish notice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-bup-100 dark:bg-bup-900/40 text-bup-700 dark:text-bup-300 flex items-center justify-center shadow-inner">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Publish Academic Notice</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authorized faculty publisher for courses & segregated sections.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Hierarchy */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="ICT">Dept of ICT</option>
                <option value="CSE">Dept of CSE</option>
                <option value="BBA">Dept of BBA</option>
                <option value="ECON">Dept of Economics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="ICT-2201">ICT-2201 (Algorithms)</option>
                <option value="ICT-2202">ICT-2202 (DS Lab)</option>
                <option value="ICT-2203">ICT-2203 (Digital Elec)</option>
                <option value="CSE-3101">CSE-3101 (DBMS)</option>
                <option value="ALL">All Courses</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Section</label>
              <select
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-semibold text-bup-700 dark:text-bup-300"
              >
                <option value="Section A">Section A Only</option>
                <option value="Section B">Section B Only</option>
                <option value="ALL">All Sections (A & B)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Exam">Exam / Quiz Notice</option>
                <option value="Assignment">Assignment Deadline</option>
                <option value="Routine Change">Routine Change</option>
                <option value="Class Postponement">Class Postponement</option>
                <option value="Make-up Class">Make-up Class</option>
                <option value="General">General Announcement</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Urgency Level</label>
              <div className="flex gap-1.5 pt-0.5">
                {(['normal', 'important', 'urgent'] as const).map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setUrgency(urg)}
                    className={`flex-1 py-2 rounded-xl capitalize font-semibold border transition-all text-[11px] ${
                      urgency === urg
                        ? urg === 'urgent'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : urg === 'important'
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-bup-600 text-white border-bup-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Section A: Quiz 2 Rescheduled to Tuesday 10:30 AM"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Instructions</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide exact room, syllabus details, or revised deadlines for students..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs resize-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Attachment File Name (Optional)</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="e.g. Quiz2_Topics_SectionA.pdf"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-bup-700 hover:bg-bup-800 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-bup-700/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              {submitting ? 'Publishing Notice...' : 'Publish Official Notice to Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
