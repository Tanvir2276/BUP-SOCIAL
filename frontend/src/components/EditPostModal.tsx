import React, { useState } from 'react';
import { X, Save, Edit3, Image as ImageIcon, Tag, Sparkles } from 'lucide-react';
import { apiFetch } from '../utils/api';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  onPostUpdated: (updatedPost: any) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onPostUpdated,
}) => {
  if (!isOpen || !post) return null;

  const [title, setTitle] = useState(post.title || '');
  const [content, setContent] = useState(post.content || '');
  const [communityTarget, setCommunityTarget] = useState(post.communityTarget || 'General Campus');
  const [imageUrl, setImageUrl] = useState(post.imageUrl || post.mediaUrl || '');
  const [tags, setTags] = useState(
    Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '#BUPSocial'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const postId = post._id || post.id;
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedData = {
      ...post,
      title: title.trim(),
      content: content.trim(),
      communityTarget,
      imageUrl: imageUrl.trim() || null,
      mediaUrl: imageUrl.trim() || post.mediaUrl,
      tags: tagArray,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await apiFetch(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          communityTarget,
          imageUrl: imageUrl.trim() || null,
          tags: tagArray,
        }),
      });

      if (res.success && res.post) {
        onPostUpdated(res.post);
      } else {
        onPostUpdated(updatedData);
      }
    } catch (err: any) {
      // Offline / client fallback
      onPostUpdated(updatedData);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-bup-700/10 text-bup-600 flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Edit Your Post
              </h3>
              <p className="text-[10px] text-slate-400">
                Modify post title, notes description, target community, or photo attachment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Post Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Updated Lecture 3 Notes on SRE"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Community / Audience
            </label>
            <select
              value={communityTarget}
              onChange={(e) => setCommunityTarget(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="General Campus">General Campus</option>
              <option value="Department of ICT">Department of ICT</option>
              <option value="Department of CSE">Department of CSE</option>
              <option value="Faculty of Science & Technology (FST)">Faculty of Science & Technology (FST)</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="BICE-2024">BICE-2024 (3rd Year)</option>
              <option value="BICE-2025">BICE-2025 (2nd Year)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Post Content & Notes Body *
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your revised post body..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-bup-600" />
              <span>Image / Media URL (Optional)</span>
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... or /assets/..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>Hashtags (Comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#BUPSocial, #SRE, #MidTerm"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-motion btn-bup-primary px-5 py-2.5 rounded-xl text-white font-bold shadow-md shadow-bup-700/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save & Update Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
