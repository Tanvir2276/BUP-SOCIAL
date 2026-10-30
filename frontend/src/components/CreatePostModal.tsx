import React, { useState } from 'react';
import {
  MessageSquarePlus,
  Image,
  Tag,
  X,
  Send,
  FileText,
  Film,
  Video,
  Sparkles,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communityType, setCommunityType] = useState('Campus');
  const [communityTarget, setCommunityTarget] = useState('General Campus');
  const [mediaType, setMediaType] = useState<'TEXT' | 'NOTE' | 'IMAGE' | 'REEL' | 'VIDEO'>('TEXT');
  const [mediaUrl, setMediaUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [tags, setTags] = useState('#BUPSocial, #CampusLife');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          communityType,
          communityTarget,
          mediaType,
          mediaUrl: mediaUrl || undefined,
          attachmentName: attachmentName || undefined,
          imageUrl: imageUrl || undefined,
          tags: tags.split(',').map((t) => t.trim()),
        }),
      });
      onPostCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
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
          <div className="w-12 h-12 rounded-2xl bg-bup-100 dark:bg-bup-900/40 text-bup-700 dark:text-bup-300 flex items-center justify-center">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Facebook-Style Post</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share lecture notes, campus photos, reels or video updates.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Media Format Picker: Text, Note, Photo, Reel, Video (User Requirement #3) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Post Format
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'TEXT', label: 'Standard', icon: MessageSquarePlus },
                { id: 'NOTE', label: 'Note / PDF', icon: FileText },
                { id: 'IMAGE', label: 'Photo', icon: Image },
                { id: 'REEL', label: 'Reel', icon: Film },
                { id: 'VIDEO', label: 'Video', icon: Video },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const active = mediaType === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setMediaType(fmt.id as any)}
                    className={`py-2 px-1 rounded-xl text-center border font-bold transition-all flex flex-col items-center gap-1 ${
                      active
                        ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-bup-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Community Space</label>
              <select
                value={communityType}
                onChange={(e) => {
                  setCommunityType(e.target.value);
                  if (e.target.value === 'Campus') setCommunityTarget('General Campus');
                  if (e.target.value === 'Department') setCommunityTarget('Department of ICT');
                  if (e.target.value === 'Course') setCommunityTarget('ICT-2201 (Algorithms)');
                  if (e.target.value === 'Club') setCommunityTarget('BUP InfoTech Club (BUPITC)');
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Campus">Campus General</option>
                <option value="Department">Department Space</option>
                <option value="Course">Course Group</option>
                <option value="Club">Club Forum</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Name</label>
              <input
                type="text"
                value={communityTarget}
                onChange={(e) => setCommunityTarget(e.target.value)}
                placeholder="e.g. ICT-2201 Algorithms"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Post Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you sharing with BUPians today?"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Content Details</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide a description, key takeaways or questions..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs resize-none"
              required
            />
          </div>

          {/* Conditional Media Inputs */}
          {mediaType === 'NOTE' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-600" /> Note / PDF Document File Name
              </label>
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="e.g. ICT2201_Graph_Algorithms_Handwritten_Notes.pdf"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
                required
              />
            </div>
          )}

          {(mediaType === 'REEL' || mediaType === 'VIDEO') && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-rose-600" /> Video URL (.mp4 / stream)
              </label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://commondatastorage.googleapis.com/... or video link"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
                required
              />
            </div>
          )}

          {mediaType === 'IMAGE' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-bup-600" /> Campus Photo URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-bup-600" /> Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#BUPSocial, #Notes, #SectionA"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-bup-700 hover:bg-bup-800 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-bup-700/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Publishing...' : 'Publish to Feed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
