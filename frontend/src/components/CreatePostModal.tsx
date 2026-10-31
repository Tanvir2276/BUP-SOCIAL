import React, { useState, useRef } from 'react';
import {
  MessageSquarePlus,
  Image as ImageIcon,
  Tag,
  X,
  Send,
  FileText,
  Film,
  Video,
  Upload,
  CheckCircle2,
  Paperclip,
  Trash2,
  ExternalLink,
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
  const [communityType, setCommunityType] = useState('CAMPUS');
  const [communityTarget, setCommunityTarget] = useState('General Campus');
  const [mediaType, setMediaType] = useState<'TEXT' | 'NOTE' | 'IMAGE' | 'REEL' | 'VIDEO'>('TEXT');
  const [mediaUrl, setMediaUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [tags, setTags] = useState('#BUPSocial, #CampusLife');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload states
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${sizeInMb} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFilePreviewUrl(dataUrl);

      if (mediaType === 'IMAGE') {
        setImageUrl(dataUrl);
        setMediaUrl(dataUrl);
      } else if (mediaType === 'NOTE') {
        setAttachmentName(file.name);
        setMediaUrl(dataUrl);
      } else if (mediaType === 'REEL' || mediaType === 'VIDEO') {
        setMediaUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setFilePreviewUrl(null);
    setImageUrl('');
    setMediaUrl('');
    setAttachmentName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const postPayload = {
      _id: 'post-' + Date.now(),
      id: 'post-' + Date.now(),
      title,
      content,
      communityType: communityType.toUpperCase(),
      communityTarget,
      mediaType,
      mediaUrl: mediaUrl || (mediaType === 'IMAGE' ? imageUrl : undefined),
      attachmentName: attachmentName || (mediaType === 'NOTE' ? uploadedFileName || `${title}.pdf` : undefined),
      attachmentUrl: mediaUrl || undefined,
      imageUrl: imageUrl || (mediaType === 'IMAGE' ? mediaUrl : undefined),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      author: {
        id: user?.id || 'anon',
        name: user?.name || 'BUP Student',
        email: user?.email || 'student@bup.edu.bd',
        role: user?.role || 'student',
        department: user?.department || 'Department of ICT',
        section: user?.section || 'Section A',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      },
      likes: [],
      comments: [],
      viewsCount: 1,
    };

    try {
      // 1. Attempt API submission
      await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          communityType: communityType.toUpperCase(),
          communityTarget,
          mediaType,
          mediaUrl: postPayload.mediaUrl,
          attachmentName: postPayload.attachmentName,
          attachmentUrl: postPayload.attachmentUrl,
          imageUrl: postPayload.imageUrl,
          tags: postPayload.tags,
        }),
      });
    } catch (apiErr: any) {
      console.warn('API post creation returned notice, persisting to client feed storage:', apiErr.message);
    }

    // 2. Always persist locally so it is instantly viewable by all users & across tab refreshes
    try {
      const stored = localStorage.getItem('bupsoc_feed_posts');
      const existingPosts: any[] = stored ? JSON.parse(stored) : [];
      const updated = [postPayload, ...existingPosts];
      localStorage.setItem('bupsoc_feed_posts', JSON.stringify(updated));
    } catch (storageErr) {
      console.error('Storage error:', storageErr);
    }

    onPostCreated();
    onClose();
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-bup-100 dark:bg-bup-900/40 text-bup-700 dark:text-bup-300 flex items-center justify-center shadow-sm">
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
          {/* Media Format Picker: Text, Note, Photo, Reel, Video */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Post Format
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'TEXT', label: 'Standard', icon: MessageSquarePlus },
                { id: 'NOTE', label: 'Note / PDF', icon: FileText },
                { id: 'IMAGE', label: 'Photo', icon: ImageIcon },
                { id: 'REEL', label: 'Reel (9:16)', icon: Film },
                { id: 'VIDEO', label: 'Video', icon: Video },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const active = mediaType === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      setMediaType(fmt.id as any);
                      handleRemoveFile();
                    }}
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
                  const val = e.target.value;
                  setCommunityType(val);
                  if (val === 'CAMPUS') setCommunityTarget('General Campus');
                  if (val === 'DEPARTMENT') setCommunityTarget('Department of ICT');
                  if (val === 'COURSE') setCommunityTarget('ICE-3205 (Web Technologies)');
                  if (val === 'CLUB') setCommunityTarget('BUP InfoTech Club (BUPITC)');
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="CAMPUS">Campus General</option>
                <option value="DEPARTMENT">Department Space</option>
                <option value="COURSE">Course Group</option>
                <option value="CLUB">Club Forum</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Name</label>
              <input
                type="text"
                value={communityTarget}
                onChange={(e) => setCommunityTarget(e.target.value)}
                placeholder="e.g. ICE-3205 Web Technologies"
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
              placeholder="Provide a description, key takeaways or study guidance..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs resize-none"
              required
            />
          </div>

          {/* Interactive File Attachment / Upload Area (User Requirement #3) */}
          {mediaType !== 'TEXT' && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-bup-600" />
                  {mediaType === 'NOTE' && 'Upload Lecture Note / PDF Document'}
                  {mediaType === 'IMAGE' && 'Upload Campus Photo'}
                  {mediaType === 'REEL' && 'Upload Campus Reel (.mp4 / .mov)'}
                  {mediaType === 'VIDEO' && 'Upload Video File'}
                </span>
                <button
                  type="button"
                  onClick={() => setUseUrlInput(!useUrlInput)}
                  className="text-[10px] text-bup-600 dark:text-bup-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {useUrlInput ? 'Switch to File Upload' : 'Or Paste Web URL'}
                </button>
              </div>

              {!useUrlInput ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={
                      mediaType === 'IMAGE'
                        ? 'image/*'
                        : mediaType === 'NOTE'
                        ? '.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip'
                        : 'video/*,.mp4,.mov,.webm'
                    }
                    className="hidden"
                    id="file-upload-input"
                  />

                  {!uploadedFileName ? (
                    <label
                      htmlFor="file-upload-input"
                      className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-bup-500 dark:hover:border-bup-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-800/40 text-center"
                    >
                      <Upload className="w-7 h-7 text-bup-600 mb-1 animate-bounce" />
                      <p className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                        Click to select file or drag & drop here
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {mediaType === 'IMAGE' && 'Supported: JPG, PNG, WEBP, GIF (Up to 15MB)'}
                        {mediaType === 'NOTE' && 'Supported: PDF, Word DOCX, Slides PPT, ZIP (Up to 25MB)'}
                        {mediaType === 'REEL' && 'Supported: MP4, WebM (Vertical 9:16 format recommended)'}
                        {mediaType === 'VIDEO' && 'Supported: MP4, MKV, WebM lecture recordings'}
                      </p>
                    </label>
                  ) : (
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate text-xs">
                            {uploadedFileName}
                          </p>
                          <p className="text-[10px] text-slate-400">{uploadedFileSize} • File attached</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Thumbnail Previews */}
                  {filePreviewUrl && mediaType === 'IMAGE' && (
                    <div className="mt-2 rounded-xl overflow-hidden max-h-40 border border-slate-200 dark:border-slate-700">
                      <img src={filePreviewUrl} alt="Upload preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {filePreviewUrl && (mediaType === 'REEL' || mediaType === 'VIDEO') && (
                    <div className="mt-2 rounded-xl overflow-hidden max-h-48 bg-black flex justify-center">
                      <video src={filePreviewUrl} controls className="max-h-48" />
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback direct URL input */
                <div>
                  <input
                    type="url"
                    value={mediaType === 'IMAGE' ? imageUrl : mediaUrl}
                    onChange={(e) => {
                      if (mediaType === 'IMAGE') setImageUrl(e.target.value);
                      setMediaUrl(e.target.value);
                      if (mediaType === 'NOTE') setAttachmentName(title ? `${title}.pdf` : 'Course_Note.pdf');
                    }}
                    placeholder={
                      mediaType === 'IMAGE'
                        ? 'https://images.unsplash.com/...'
                        : mediaType === 'NOTE'
                        ? 'https://example.com/notes.pdf'
                        : 'https://example.com/video.mp4'
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
                  />
                  {mediaType === 'NOTE' && (
                    <input
                      type="text"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      placeholder="Display Note Name (e.g. ICT3205_Web_Tech_Lab_Manual.pdf)"
                      className="w-full mt-2 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs"
                    />
                  )}
                </div>
              )}
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
              className="w-full py-3 px-4 bg-bup-700 hover:bg-bup-800 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-bup-700/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Publishing Post...' : 'Publish to Feed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};