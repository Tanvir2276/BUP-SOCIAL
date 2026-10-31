import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Bell,
  Clock,
  Smartphone,
  BookOpen,
  Star,
  CheckCircle,
  Save,
  Volume2,
  VolumeX,
  ShieldCheck,
  Globe,
  KeyRound,
  Database,
  ExternalLink,
  Lock,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Share2,
  UserPlus,
  UserCheck,
  Heart,
  MapPin,
  Home,
  Cake,
  GraduationCap,
  School,
  AtSign,
  Tag,
  MessageCircle,
  QrCode,
  Copy,
  Edit,
  Sparkles,
  X,
  Check,
  ArrowLeft,
  Award,
  Calendar,
  Layers,
  FileText,
  ThumbsUp,
  MessageSquare,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SecurityShieldModal } from '../components/SecurityShieldModal';

interface ProfileSettingsProps {
  viewingUser?: any | null;
  onBack?: () => void;
  onOpenChat?: (user: any) => void;
  onViewProfile?: (user: any) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  viewingUser,
  onBack,
  onOpenChat,
  onViewProfile,
}) => {
  const { user, updatePreferences } = useAuth();

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !viewingUser || viewingUser.id === user?.id || viewingUser.name === user?.name;
  const activeProfile = isOwnProfile ? user : viewingUser;

  // Active navigation tab within profile
  const [activeTab, setActiveTab] = useState<'timeline' | 'about' | 'courses' | 'badges' | 'settings'>('timeline');

  // Profile Picture Upload State
  const [avatarPreview, setAvatarPreview] = useState<string>(activeProfile?.avatar || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // Cover Photo State
  const [coverPhoto, setCoverPhoto] = useState<string>(() => {
    if (!isOwnProfile && viewingUser?.coverPhoto) return viewingUser.coverPhoto;
    return localStorage.getItem('bupsoc_cover_photo') || '/assets/bup_antorikkho_batch22.jpg';
  });
  const [coverUploading, setCoverUploading] = useState(false);
  const [showCoverPresets, setShowCoverPresets] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // Follower & Social Interactivity
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    return localStorage.getItem(`bupsoc_following_${activeProfile?.name || 'default'}`) === 'true';
  });
  const [followerCount, setFollowerCount] = useState<number>(() => {
    const base = isOwnProfile ? 2410 : 1840;
    return Number(localStorage.getItem(`bupsoc_followers_${activeProfile?.name || 'default'}`)) || base;
  });
  const [friendStatus, setFriendStatus] = useState<'none' | 'sent' | 'friends'>(() => {
    return (localStorage.getItem(`bupsoc_friend_${activeProfile?.name || 'default'}`) as any) || 'none';
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Thought Status Bubble
  const [thoughtStatus, setThoughtStatus] = useState<string>(() => {
    if (!isOwnProfile && viewingUser?.thought) return viewingUser.thought;
    return localStorage.getItem('bupsoc_user_thought') || 'Celebrating অন্তরীক্ষ-২২ with FST comrades 🎓';
  });
  const [isEditingThought, setIsEditingThought] = useState(false);
  const [tempThought, setTempThought] = useState(thoughtStatus);

  // Personal Information Details
  const [profileType, setProfileType] = useState<string>(
    localStorage.getItem('bupsoc_profile_type') || (activeProfile?.role === 'faculty' ? 'Faculty & Academician' : 'BUP Undergraduate Scholar')
  );
  const [livesIn, setLivesIn] = useState<string>(
    localStorage.getItem('bupsoc_lives_in') || 'Mirpur DOHS, Dhaka'
  );
  const [hometown, setHometown] = useState<string>(
    localStorage.getItem('bupsoc_hometown') || 'Cumilla, Bangladesh'
  );
  const [birthdate, setBirthdate] = useState<string>(
    localStorage.getItem('bupsoc_birthdate') || '2003-10-24'
  );
  const [school, setSchool] = useState<string>(
    localStorage.getItem('bupsoc_school') || 'Tongi Pilot School & Girls College'
  );
  const [college, setCollege] = useState<string>(
    localStorage.getItem('bupsoc_college') || 'Dhaka College'
  );
  const [university, setUniversity] = useState<string>(
    localStorage.getItem('bupsoc_university') || 'Bangladesh University of Professionals (BUP)'
  );
  const [instagram, setInstagram] = useState<string>(
    localStorage.getItem('bupsoc_instagram') || 'tanvir_naeeem'
  );
  const [motto, setMotto] = useState<string>(
    localStorage.getItem('bupsoc_motto') || 'History only remembers how you finished.'
  );

  // Edit Personal Information Modal / Form Mode
  const [editProfileMode, setEditProfileMode] = useState(false);

  // Preferences & Security
  const [section, setSection] = useState(user?.section || 'Section A');
  const [bio, setBio] = useState(activeProfile?.bio || 'BUP Faculty of Science and Technology (FST) | Innovating next-gen campus web systems.');
  const [leadTime, setLeadTime] = useState<number>(user?.reminderSettings?.leadTimeMinutes ?? 15);
  const [device, setDevice] = useState<string>(user?.reminderSettings?.deviceType ?? 'browser');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(user?.reminderSettings?.soundEnabled ?? true);
  const [classReminders, setClassReminders] = useState<boolean>(user?.reminderSettings?.classReminders ?? true);
  const [examReminders, setExamReminders] = useState<boolean>(user?.reminderSettings?.examReminders ?? true);
  const [noticeAlerts, setNoticeAlerts] = useState<boolean>(user?.reminderSettings?.noticeAlerts ?? true);

  const [coursePrefs, setCoursePrefs] = useState<string[]>(
    user?.coursePreferences || ['ICT-2201', 'ICT-2202', 'CSE-3101']
  );
  const [favoriteClubs, setFavoriteClubs] = useState<string[]>(
    user?.favoriteClubs || ['BUP InfoTech Club (BUPITC)', 'BUP Robotics Club (BUPRC)']
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  // Synchronize when switching between viewing users
  useEffect(() => {
    setAvatarPreview(activeProfile?.avatar || '');
    if (!isOwnProfile && viewingUser?.coverPhoto) {
      setCoverPhoto(viewingUser.coverPhoto);
    } else {
      setCoverPhoto(localStorage.getItem('bupsoc_cover_photo') || '/assets/bup_antorikkho_batch22.jpg');
    }
  }, [viewingUser, activeProfile]);

  // Handle Profile Picture File Upload
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setAvatarPreview(base64Url);
      localStorage.setItem('bupsoc_user_avatar', base64Url);

      try {
        const storedUser = localStorage.getItem('bupsoc_auth_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.avatar = base64Url;
          localStorage.setItem('bupsoc_auth_user', JSON.stringify(parsed));
        }
      } catch (err) {}

      setAvatarUploading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Handle Cover Photo File Upload
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Cover photo exceeds 8MB limit. Please choose a smaller image.');
      return;
    }

    setCoverUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setCoverPhoto(base64Url);
      localStorage.setItem('bupsoc_cover_photo', base64Url);
      setCoverUploading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectCoverPreset = (url: string) => {
    setCoverPhoto(url);
    localStorage.setItem('bupsoc_cover_photo', url);
    setShowCoverPresets(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Follow / Unfollow Toggle
  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    const updatedCount = nextState ? followerCount + 1 : followerCount - 1;
    setFollowerCount(updatedCount);
    localStorage.setItem(`bupsoc_following_${activeProfile?.name || 'default'}`, String(nextState));
    localStorage.setItem(`bupsoc_followers_${activeProfile?.name || 'default'}`, String(updatedCount));
  };

  // Friend Request Toggle
  const handleToggleFriend = () => {
    let nextStatus: 'none' | 'sent' | 'friends' = 'none';
    if (friendStatus === 'none') nextStatus = 'sent';
    else if (friendStatus === 'sent') nextStatus = 'friends';
    else nextStatus = 'none';

    setFriendStatus(nextStatus);
    localStorage.setItem(`bupsoc_friend_${activeProfile?.name || 'default'}`, nextStatus);
  };

  // Save Thought Bubble
  const handleSaveThought = () => {
    setThoughtStatus(tempThought.trim());
    localStorage.setItem('bupsoc_user_thought', tempThought.trim());
    setIsEditingThought(false);
  };

  // Save Personal Details
  const handleSavePersonalDetails = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bupsoc_profile_type', profileType);
    localStorage.setItem('bupsoc_lives_in', livesIn);
    localStorage.setItem('bupsoc_hometown', hometown);
    localStorage.setItem('bupsoc_birthdate', birthdate);
    localStorage.setItem('bupsoc_school', school);
    localStorage.setItem('bupsoc_college', college);
    localStorage.setItem('bupsoc_university', university);
    localStorage.setItem('bupsoc_instagram', instagram);
    localStorage.setItem('bupsoc_motto', motto);
    setEditProfileMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyProfileLink = () => {
    const url = `${window.location.origin}/u/${encodeURIComponent(
      (activeProfile?.name || 'tanvir_naeem').toLowerCase().replace(/\s+/g, '_')
    )}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePreferences({
        section,
        bio,
        coursePreferences: coursePrefs,
        favoriteClubs,
        reminderSettings: {
          leadTimeMinutes: Number(leadTime),
          deviceType: device,
          soundEnabled,
          classReminders,
          examReminders,
          noticeAlerts,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Hidden File Inputs for Uploads */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
        id="avatar-file-input"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFileChange}
        accept="image/*"
        className="hidden"
        id="cover-file-input"
      />

      {/* 0. Top Back Button when viewing another user */}
      {!isOwnProfile && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="btn-motion px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-bup-600 flex items-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Community News Feed</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Viewing Campus Profile</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. CREATIVE CINEMATIC HERO PROFILE BANNER                       */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
        {/* Cover Photo */}
        <div className="relative w-full h-56 sm:h-80 md:h-96 bg-slate-950 overflow-hidden group">
          <img
            src={coverPhoto}
            alt="BUP Campus Cover"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 filter brightness-95"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/30 pointer-events-none" />

          {/* Cover Watermark Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-extrabold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-wide">BUP Campus Social • Official Portal</span>
          </div>

          {/* Action Tools on Cover (Edit Cover, Presets) */}
          {isOwnProfile && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setShowCoverPresets(!showCoverPresets)}
                className="py-2.5 px-3.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20 transition-all"
                title="BUP Cover Presets"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Presets</span>
              </button>

              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className="py-2.5 px-4 bg-bup-700/80 hover:bg-bup-700 backdrop-blur-md text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg border border-white/20 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4 text-emerald-300" />
                <span>{coverUploading ? 'Uploading...' : 'Change Cover Photo'}</span>
              </button>
            </div>
          )}

          {/* BUP Presets Dropdown */}
          {showCoverPresets && (
            <div className="absolute bottom-16 right-4 z-20 w-80 bg-white dark:bg-slate-900 rounded-3xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-2 animate-fadeIn text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Choose Official Campus Cover
                </span>
                <button onClick={() => setShowCoverPresets(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {[
                  { title: 'অন্তরীক্ষ-২২ Cohort (Batch Fest)', url: '/assets/bup_antorikkho_batch22.jpg', tag: 'Official Batch 22' },
                  { title: 'BUP Central Campus Lake & Bridge', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200', tag: 'Lakefront' },
                  { title: 'Academic Block 2 & Library Vista', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200', tag: 'Faculty Block' },
                  { title: 'BUP FST Robotics Hardware Lab', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200', tag: 'FST ICT Lab' },
                ].map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectCoverPreset(preset.url)}
                    className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <img src={preset.url} alt="" className="w-14 h-10 rounded-xl object-cover shrink-0 shadow-xs" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{preset.title}</p>
                      <span className="text-[10px] text-bup-600 dark:text-bup-400 font-semibold">{preset.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Identity & Social Action Bar */}
        <div className="px-5 sm:px-8 pb-6 pt-0 relative bg-white dark:bg-slate-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-16 sm:-mt-20">
            {/* Left: Avatar with Glowing Ring + Thought Status + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Avatar Frame */}
              <div className="relative group shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-bup-700 via-amber-400 to-emerald-500 shadow-2xl relative">
                  <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-900 bg-slate-800 overflow-hidden relative flex items-center justify-center">
                    {avatarPreview || activeProfile?.avatar ? (
                      <img src={avatarPreview || activeProfile?.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-black text-white">
                        {activeProfile?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Campus Online Active Beacon */}
                <div
                  className="absolute bottom-2 left-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-md"
                  title="Campus Online"
                />

                {/* Camera upload badge for own profile */}
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 right-1 p-2.5 rounded-full bg-slate-900 hover:bg-black text-white shadow-xl border-2 border-white dark:border-slate-900 transition-transform active:scale-95"
                    title="Change Profile Photo"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                  </button>
                )}

                {/* Thought Status Bubble */}
                <div
                  onClick={() => isOwnProfile && setIsEditingThought(true)}
                  className={`absolute -top-10 sm:-top-8 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-24 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap flex items-center gap-1.5 z-20 ${
                    isOwnProfile ? 'cursor-pointer hover:border-bup-500' : ''
                  }`}
                  title={isOwnProfile ? 'Click to change status thought' : undefined}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="max-w-[200px] truncate">{thoughtStatus}</span>
                  {isOwnProfile && <Edit className="w-3 h-3 text-slate-400 ml-0.5" />}
                </div>
              </div>

              {/* Name, Roles, Affiliation */}
              <div className="space-y-1 sm:pt-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {activeProfile?.name || 'BUP Member'}
                  </h1>

                  {/* Verified Role Badge */}
                  {activeProfile?.role === 'faculty' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300">
                      <Award className="w-3 h-3 text-amber-600" />
                      <span>Official Faculty</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>BUP Student • Batch 22</span>
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {activeProfile?.designation || activeProfile?.department || 'Department of ICT • Faculty of Science & Technology'}
                </p>

                {/* Followers Counter Stats */}
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {followerCount.toLocaleString()} <span className="font-normal text-slate-400">followers</span>
                  </span>
                  <span>•</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    482 <span className="font-normal text-slate-400">following</span>
                  </span>
                  <span>•</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    ICT Batch 22
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Social Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap pt-2 sm:pt-0">
              {/* If viewing someone else: Follow + Message + Add Friend + Share */}
              {!isOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    className={`btn-motion py-2.5 px-4 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
                      isFollowing
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                        : 'btn-bup-primary text-white shadow-bup-700/20'
                    }`}
                  >
                    {isFollowing ? <UserCheck className="w-4 h-4 text-emerald-500" /> : <UserPlus className="w-4 h-4" />}
                    <span>{isFollowing ? 'Following ✓' : 'Follow'}</span>
                  </button>

                  {onOpenChat && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenChat({
                          id: activeProfile?.id || 'chat-' + (activeProfile?.name || 'user'),
                          name: activeProfile?.name || 'BUP Member',
                          avatar: activeProfile?.avatar,
                          role: activeProfile?.role || 'student',
                          department: activeProfile?.department || 'Department of ICT',
                          online: true,
                        })
                      }
                      className="btn-motion py-2.5 px-4 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleToggleFriend}
                    className={`btn-motion py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      friendStatus === 'friends'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : friendStatus === 'sent'
                        ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${friendStatus !== 'none' ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="hidden sm:inline">
                      {friendStatus === 'friends' ? 'Friends' : friendStatus === 'sent' ? 'Sent' : 'Add Friend'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareModalOpen(true)}
                    className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                /* Own Profile: Edit Profile + Share + Security Shield */
                <>
                  <button
                    type="button"
                    onClick={() => setEditProfileMode(!editProfileMode)}
                    className="btn-motion py-2.5 px-4 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{editProfileMode ? 'Close Editor' : 'Edit Profile'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSecurityModalOpen(true)}
                    className="btn-motion py-2.5 px-3.5 rounded-2xl text-xs font-extrabold bg-slate-900 hover:bg-black text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Level 3 Shield</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareModalOpen(true)}
                    className="btn-motion p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Motto / Bio Quote */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs sm:text-sm italic font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="text-amber-500 font-serif text-lg leading-none">“</span>
              <span>{motto}</span>
              <span className="text-amber-500 font-serif text-lg leading-none">”</span>
            </p>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              BUP Verified Profile • {activeProfile?.department || 'FST ICT'}
            </span>
          </div>
        </div>

        {/* 2. CREATIVE PROFILE NAVIGATION TABS */}
        <div className="px-5 sm:px-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'timeline', label: 'Timeline & Posts', icon: FileText },
            { id: 'about', label: 'About & Academic Bio', icon: School },
            { id: 'courses', label: 'Courses & Routine', icon: BookOpen },
            { id: 'badges', label: 'Badges & Honors', icon: Award },
            ...(isOwnProfile ? [{ id: 'settings', label: 'Preferences & Shield', icon: ShieldCheck }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  active
                    ? 'border-bup-600 text-bup-700 dark:text-bup-400 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-bup-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TAB CONTENTS: DYNAMIC VIEWS                                 */}
      {/* ============================================================== */}

      {/* TAB 1: TIMELINE & RECENT POSTS */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Quick About & Highlights Card */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <School className="w-4 h-4 text-bup-600" />
                <span>Intro & Affiliation</span>
              </h3>

              <div className="space-y-2.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-bup-600 shrink-0" />
                  <span>Studies at <strong>{university}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <School className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>College: <strong>{college}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Lives in <strong>{livesIn}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Home className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>From <strong>{hometown}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <AtSign className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Instagram: <strong className="text-sky-600">@{instagram}</strong></span>
                </div>
              </div>

              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setEditProfileMode(true)}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"
                >
                  Edit Personal Details
                </button>
              )}
            </div>

            {/* Campus Photos Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center justify-between text-xs">
                <span>Campus Photos</span>
                <span className="text-[10px] text-bup-600 font-bold">4 Photos</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
                <img src="/assets/bup_antorikkho_batch22.jpg" alt="" className="w-full h-24 object-cover rounded-xl hover:scale-105 transition-transform" />
                <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600" alt="" className="w-full h-24 object-cover rounded-xl hover:scale-105 transition-transform" />
                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600" alt="" className="w-full h-24 object-cover rounded-xl hover:scale-105 transition-transform" />
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600" alt="" className="w-full h-24 object-cover rounded-xl hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>

          {/* Right Column: User's Posts Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Featured Post for Munshi Tanvir Hossain / Active User */}
            <article className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-bup-700 text-white font-black flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      activeProfile?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{activeProfile?.name || 'BUP Member'}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {activeProfile?.department || 'Department of ICT'} • 2 days ago • Public
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                  Featured
                </span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                🚀 Official Teaser: BUP Inter-Department Hackathon 2026 Trailer & Launch
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Calling all coders, innovators, and problem solvers across FST, FBS, and FASS! Gear up for the most anticipated hackathon of the semester. Registration opens this Sunday!
              </p>

              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <img
                  src="/assets/bup_antorikkho_batch22.jpg"
                  alt="Batch 22 Hackathon"
                  className="w-full max-h-80 object-cover"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <ThumbsUp className="w-4 h-4 text-blue-600" />
                  <span>142 Likes</span>
                </div>
                <span>38 Comments • 19 Shares</span>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT & PERSONAL DETAILS */}
      {activeTab === 'about' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-bup-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Personal Background & Institutional Credentials
              </h3>
            </div>

            {isOwnProfile && (
              <button
                type="button"
                onClick={() => setEditProfileMode(!editProfileMode)}
                className="text-xs font-bold text-bup-700 dark:text-bup-400 hover:underline flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{editProfileMode ? 'Cancel' : 'Edit Details'}</span>
              </button>
            )}
          </div>

          {/* Edit Form */}
          {editProfileMode ? (
            <form onSubmit={handleSavePersonalDetails} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Profile Category:
                  </label>
                  <input
                    type="text"
                    value={profileType}
                    onChange={(e) => setProfileType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lives In (City/Area):
                  </label>
                  <input
                    type="text"
                    value={livesIn}
                    onChange={(e) => setLivesIn(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hometown:
                  </label>
                  <input
                    type="text"
                    value={hometown}
                    onChange={(e) => setHometown(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Birthdate:
                  </label>
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    School:
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    College:
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    University:
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Instagram Handle:
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Life Motto / Bio Quote:
                  </label>
                  <input
                    type="text"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditProfileMode(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-motion btn-bup-primary px-5 py-2 rounded-xl text-white font-bold shadow-md shadow-bup-700/20"
                >
                  Save Personal Details
                </button>
              </div>
            </form>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-bup-600" /> Category
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{profileType}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" /> Lives In (City/Village)
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{livesIn}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Home className="w-3 h-3 text-emerald-500" /> Hometown
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{hometown}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Cake className="w-3 h-3 text-amber-500" /> Birthdate
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {new Date(birthdate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <School className="w-3 h-3 text-blue-500" /> School
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{school}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-purple-500" /> College
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{college}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <School className="w-3 h-3 text-bup-600" /> University
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{university}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <AtSign className="w-3 h-3 text-pink-500" /> Instagram
                </span>
                <p className="font-bold text-slate-900 dark:text-white font-mono">@{instagram}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COURSES & ENROLLMENT */}
      {activeTab === 'courses' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-bup-600" />
              <span>Current Semester Enrolled Courses (BICE-2025 / 2026)</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600">Spring 2026 Semester</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {[
              { code: 'ICE-2201', title: 'Data Structures and Algorithms', credits: 3.0, faculty: 'Lec. Samia Ahmed' },
              { code: 'ICE-2202', title: 'Data Structures Lab', credits: 1.5, faculty: 'Lec. Md. Appel Mahmud Pranto' },
              { code: 'ICE-2203', title: 'Database Management Systems', credits: 3.0, faculty: 'Asst. Prof. Aditya Rajbongshi' },
              { code: 'ICE-2204', title: 'DBMS Laboratory', credits: 1.5, faculty: 'Asst. Prof. Aditya Rajbongshi' },
              { code: 'ICE-2207', title: 'Computer Networks', credits: 3.0, faculty: 'Lec. Sharmeen Jahan Seema' },
              { code: 'ICE-2208', title: 'Computer Networks Lab', credits: 1.5, faculty: 'Lec. Sharmeen Jahan Seema' },
            ].map((course, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-bup-700 dark:text-bup-400">{course.code}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {course.credits} Credits
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{course.title}</h4>
                <p className="text-[10px] text-slate-400">Instructor: {course.faculty}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BADGES & HONORS */}
      {activeTab === 'badges' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Honors, Competitions & Campus Badges</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: 'অন্তরীক্ষ-২২ Fest Core',
                desc: 'Batch fest organizing committee member & stage coordinator',
                color: 'from-amber-500 to-orange-500',
                icon: Flame,
              },
              {
                title: 'BUPITC Tech Lead',
                desc: 'Executive webmaster & frontend developer for BUP InfoTech Club',
                color: 'from-blue-600 to-indigo-600',
                icon: Award,
              },
              {
                title: 'Hackathon Finalist 2026',
                desc: 'Top 5 in National Inter-University IoT & Cloud Competition',
                color: 'from-emerald-600 to-teal-600',
                icon: Sparkles,
              },
              {
                title: "Dean's Honor Roll",
                desc: 'Academic excellence for outstanding GPA in ICT Dept',
                color: 'from-purple-600 to-pink-600',
                icon: Star,
              },
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-center flex flex-col items-center"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${badge.color} text-white flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{badge.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS & SECURITY (Only for Own Profile) */}
      {activeTab === 'settings' && isOwnProfile && (
        <div className="space-y-6">
          {/* Level 3 Military Grade Shield Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-bup-navy to-slate-950 text-white rounded-3xl p-6 border border-blue-900/60 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <span>3-Level Military Grade Security Shield</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    BUP Enterprise Defense: RBAC, Bcrypt 10 rounds, & anti-tamper sessions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSecurityModalOpen(true)}
                className="btn-motion px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Open Security Shield</span>
              </button>
            </div>
          </div>

          {/* Preferences Form */}
          <form onSubmit={handleSavePreferences} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Campus Notification & Reminder Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Lead Time (Minutes Before Class)
                </label>
                <select
                  value={leadTime}
                  onChange={(e) => setLeadTime(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value={5}>5 minutes before</option>
                  <option value={10}>10 minutes before</option>
                  <option value={15}>15 minutes before (Default)</option>
                  <option value={30}>30 minutes before</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Audio Chime
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="soundEnabled"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 text-bup-600 rounded"
                  />
                  <label htmlFor="soundEnabled" className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                    Enable synthesized alarm chime when reminder triggers
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="btn-motion btn-bup-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md shadow-bup-700/20"
              >
                {saving ? 'Saving...' : 'Save Reminder Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Share Profile Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-bup-600" />
                <span>Share Campus Profile</span>
              </h3>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-2xl bg-white p-2 border border-slate-200 flex items-center justify-center shadow-sm">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">{activeProfile?.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">BUP Profile QR Code</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/u/${encodeURIComponent(
                  (activeProfile?.name || 'tanvir_naeem').toLowerCase().replace(/\s+/g, '_')
                )}`}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono outline-none"
              />
              <button
                type="button"
                onClick={handleCopyProfileLink}
                className="btn-motion btn-bup-primary px-3.5 py-2 rounded-xl text-xs font-bold text-white shrink-0 flex items-center gap-1 shadow-xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thought Status Editor Modal */}
      {isEditingThought && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Update Thought Status</span>
            </h4>
            <input
              type="text"
              value={tempThought}
              onChange={(e) => setTempThought(e.target.value)}
              placeholder="What's on your mind? (e.g. Preparing for Mid-terms...)"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-bup-600"
              maxLength={80}
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingThought(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveThought}
                className="btn-motion btn-bup-primary px-4 py-1.5 rounded-xl text-xs font-bold text-white"
              >
                Save Thought
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Shield Modal */}
      <SecurityShieldModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />
    </div>
  );
};
