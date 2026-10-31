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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SecurityShieldModal } from '../components/SecurityShieldModal';

export const ProfileSettings: React.FC = () => {
  const { user, updatePreferences } = useAuth();

  // Profile Picture Upload State (User Requirements #1 & #3)
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // Cover Photo State (User Requirement #5 - inspired by user screenshot)
  const [coverPhoto, setCoverPhoto] = useState<string>(
    localStorage.getItem('bupsoc_cover_photo') || '/assets/bup_antorikkho_batch22.jpg'
  );
  const [coverUploading, setCoverUploading] = useState(false);
  const [showCoverPresets, setShowCoverPresets] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // Follower & Social Interactivity (User Requirement #5)
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    return localStorage.getItem('bupsoc_is_following') === 'true';
  });
  const [followerCount, setFollowerCount] = useState<number>(() => {
    return Number(localStorage.getItem('bupsoc_follower_count')) || 2410;
  });
  const [friendStatus, setFriendStatus] = useState<'none' | 'sent' | 'friends'>(() => {
    return (localStorage.getItem('bupsoc_friend_status') as any) || 'none';
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Thought Status Bubble
  const [thoughtStatus, setThoughtStatus] = useState<string>(
    localStorage.getItem('bupsoc_user_thought') || 'Celebrating অন্তরীক্ষ-২২ with FST comrades 🎓'
  );
  const [isEditingThought, setIsEditingThought] = useState(false);
  const [tempThought, setTempThought] = useState(thoughtStatus);

  // Personal Information Details (User Requirement #6)
  const [profileType, setProfileType] = useState<string>(
    localStorage.getItem('bupsoc_profile_type') || 'Personal blog'
  );
  const [livesIn, setLivesIn] = useState<string>(
    localStorage.getItem('bupsoc_lives_in') || 'Dhaka, Bangladesh'
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
    localStorage.getItem('bupsoc_university') || 'Bangladesh University of Professionals - BUP'
  );
  const [instagram, setInstagram] = useState<string>(
    localStorage.getItem('bupsoc_instagram') || 'tanvir_naeeem'
  );
  const [motto, setMotto] = useState<string>(
    localStorage.getItem('bupsoc_motto') || 'History only remembers how you finished.'
  );

  // Edit Personal Information Modal / Form Mode
  const [editProfileMode, setEditProfileMode] = useState(false);

  // State
  const [section, setSection] = useState(user?.section || 'Section A');
  const [bio, setBio] = useState(user?.bio || '');
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

  const availableCourses = [
    { code: 'ICT-1101', title: 'Structured Programming (C)' },
    { code: 'ICT-1201', title: 'Discrete Mathematics' },
    { code: 'ICT-2101', title: 'Object-Oriented Programming (Java/C++)' },
    { code: 'ICT-2201', title: 'Data Structures and Algorithms' },
    { code: 'ICT-2202', title: 'Data Structures Lab' },
    { code: 'ICT-2203', title: 'Digital Electronics & Logic Design' },
    { code: 'ICT-3101', title: 'Database Management Systems (DBMS)' },
    { code: 'ICT-3103', title: 'Data Communication & Networks' },
    { code: 'ICT-4101', title: 'Artificial Intelligence & Machine Learning' },
    { code: 'ICT-4103', title: 'Cryptography & Network Security' },
    { code: 'CSE-1101', title: 'Intro to Computer Systems & C' },
    { code: 'CSE-2201', title: 'Computer Architecture & Organization' },
    { code: 'CSE-3101', title: 'Database Systems (CSE)' },
    { code: 'CSE-3105', title: 'Operating Systems & System Programming' },
    { code: 'ENV-1101', title: 'Introduction to Environmental Science' },
    { code: 'ENV-3101', title: 'Climate Change, GIS & Disaster Management' },
  ];

  const availableClubs = [
    'BUP InfoTech Club (BUPITC)',
    'BUP Robotics Club (BUPRC)',
    'BUP IEEE Student Branch',
    'BUP Career & Leadership Club (BCLC)',
    'BUP Debate Club (BUPDC)',
    'BUP Environmental Club (BUPEC)',
    'BUP Cultural Forum',
    'BUP Sports Club',
  ];

  const toggleCourse = (code: string) => {
    if (coursePrefs.includes(code)) {
      setCoursePrefs(coursePrefs.filter((c) => c !== code));
    } else {
      setCoursePrefs([...coursePrefs, code]);
    }
  };

  const toggleClub = (clubName: string) => {
    if (favoriteClubs.includes(clubName)) {
      setFavoriteClubs(favoriteClubs.filter((c) => c !== clubName));
    } else {
      setFavoriteClubs([...favoriteClubs, clubName]);
    }
  };

  // Handle Profile Picture File Upload (User Requirements #1 & #3)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarPreview(dataUrl);
      try {
        await updatePreferences({ avatar: dataUrl });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setAvatarUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Cover Photo File Upload (User Requirement #5)
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCoverPhoto(dataUrl);
      localStorage.setItem('bupsoc_cover_photo', dataUrl);
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

  // Toggle Follow (User Requirement #5)
  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    const nextCount = nextState ? followerCount + 1 : followerCount - 1;
    setFollowerCount(nextCount);
    localStorage.setItem('bupsoc_is_following', String(nextState));
    localStorage.setItem('bupsoc_follower_count', String(nextCount));
  };

  // Toggle Friend Request (User Requirement #5)
  const handleToggleFriend = () => {
    if (friendStatus === 'none') {
      setFriendStatus('sent');
      localStorage.setItem('bupsoc_friend_status', 'sent');
    } else if (friendStatus === 'sent') {
      setFriendStatus('friends');
      localStorage.setItem('bupsoc_friend_status', 'friends');
    } else {
      setFriendStatus('none');
      localStorage.setItem('bupsoc_friend_status', 'none');
    }
  };

  // Share Profile (User Requirement #5)
  const handleCopyProfileLink = () => {
    const url = `${window.location.origin}/u/${encodeURIComponent(
      (user?.name || 'tanvir_naeem').toLowerCase().replace(/\s+/g, '_')
    )}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Save Thought Status
  const handleSaveThought = () => {
    setThoughtStatus(tempThought);
    localStorage.setItem('bupsoc_user_thought', tempThought);
    setIsEditingThought(false);
  };

  // Save Personal Details (User Requirement #6)
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
    setBio(motto);
    setEditProfileMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await updatePreferences({
        section,
        bio,
        coursePreferences: coursePrefs,
        favoriteClubs,
        reminderSettings: {
          leadTimeMinutes: leadTime,
          deviceType: device,
          soundEnabled,
          classReminders,
          examReminders,
          noticeAlerts,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Hidden File Inputs for Avatar & Cover Photo */}
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

      {/* User Requirement #5: Facebook-Inspired Profile Cover Banner (Matching User Screenshot) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* 1. Large Cover Photo with Edit Button */}
        <div className="relative w-full h-52 sm:h-80 bg-slate-900 overflow-hidden group">
          <img
            src={coverPhoto}
            alt="BUP Cover Banner"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Edit Cover Photo Button (Bottom Right) */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={() => setShowCoverPresets(!showCoverPresets)}
              className="py-2 px-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20 transition-all"
              title="Pick BUP Cover Presets"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Presets</span>
            </button>

            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="py-2 px-3.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg border border-white/20 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>{coverUploading ? 'Uploading...' : 'Edit cover photo'}</span>
            </button>
          </div>

          {/* BUP Cover Presets Dropdown */}
          {showCoverPresets && (
            <div className="absolute bottom-16 right-4 z-20 w-72 bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-2 animate-fadeIn text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <span className="font-extrabold text-slate-900 dark:text-white">Choose BUP Campus Cover</span>
                <button onClick={() => setShowCoverPresets(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {[
                  { title: 'অন্তরীক্ষ-২২ Cohort (Batch Fest)', url: '/assets/bup_antorikkho_batch22.jpg' },
                  { title: 'BUP Central Campus Lake & Sunset', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200' },
                  { title: 'Academic Block 2 & Library Vista', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200' },
                  { title: 'BUP FST Robotics Hardware Lab', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200' },
                ].map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectCoverPreset(preset.url)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <img src={preset.url} alt="" className="w-12 h-8 rounded-lg object-cover shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{preset.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Profile Identity Bar (Avatar overlapping cover + Name + Follow + Add Friend + Share) */}
        <div className="px-4 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Left: Avatar with Camera button & Thought Bubble */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-slate-900 bg-bup-700 overflow-hidden shadow-2xl relative">
                  {avatarPreview || user?.avatar ? (
                    <img src={avatarPreview || user?.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>

                {/* Clickable camera upload badge */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-slate-900/90 hover:bg-black text-white shadow-lg border-2 border-white dark:border-slate-900 transition-transform active:scale-95"
                  title="Upload profile picture"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                </button>

                {/* Thought Status Bubble (Inspired by User Screenshot: "Share a thought...") */}
                <div
                  onClick={() => setIsEditingThought(true)}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md py-1 px-3 rounded-full text-[10px] font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap cursor-pointer hover:scale-105 transition-transform flex items-center gap-1.5"
                  title="Click to edit thought status"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span className="truncate max-w-[130px]">{thoughtStatus || 'Share a thought...'}</span>
                </div>
              </div>

              {/* User Name & Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {user?.name || 'Tanvir Naeem'}
                  </h1>
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] shadow-sm" title="Verified Campus Member">
                    ✓
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bup-100 dark:bg-bup-950 text-bup-800 dark:text-bup-300 uppercase">
                    {user?.role}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {followerCount.toLocaleString()} followers • 482 following
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {user?.department || 'Department of ICT'} • {user?.role === 'student' ? `ID: ${user?.studentId || '24549010001'}` : user?.designation || 'Faculty'}
                </p>
              </div>
            </div>

            {/* Right: Interactive Action Buttons (Follow, Add Friend, Share, Edit) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
              {/* Follow Button */}
              <button
                type="button"
                onClick={handleToggleFollow}
                className={`btn-motion py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  isFollowing
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                    : 'btn-bup-primary text-white shadow-bup-700/20'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4 text-emerald-500" /> : <UserPlus className="w-4 h-4" />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>

              {/* Add Friend Button */}
              <button
                type="button"
                onClick={handleToggleFriend}
                className={`btn-motion py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  friendStatus === 'friends'
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                    : friendStatus === 'sent'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${friendStatus !== 'none' ? 'fill-current text-rose-500' : 'text-slate-500'}`} />
                <span>
                  {friendStatus === 'friends'
                    ? 'Friends ✓'
                    : friendStatus === 'sent'
                    ? 'Request Sent'
                    : 'Add Friend'}
                </span>
              </button>

              {/* Share Profile Button */}
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="btn-motion py-2.5 px-3.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Edit Profile Button */}
              <button
                type="button"
                onClick={() => setEditProfileMode(!editProfileMode)}
                className="btn-motion py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
              >
                <Edit className="w-4 h-4" />
                <span>{editProfileMode ? 'Close Editor' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Motto / Bio Quote */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs sm:text-sm italic font-medium text-slate-700 dark:text-slate-300">
              "{motto}"
            </p>
            <span className="text-[10px] text-slate-400 font-mono">BUP Campus Profile</span>
          </div>
        </div>
      </div>

      {/* User Requirement #6: Personal Information & University Affiliation Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-bup-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Personal Information & Academic Background
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setEditProfileMode(!editProfileMode)}
            className="text-xs font-bold text-bup-700 dark:text-bup-400 hover:underline flex items-center gap-1"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{editProfileMode ? 'Cancel' : 'Edit Details'}</span>
          </button>
        </div>

        {/* Display Mode: Personal Info Badges (Inspired by User Screenshot) */}
        {!editProfileMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-bup-600" /> Profile Category
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{profileType}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" /> Lives In (City/Village)
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{livesIn}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Home className="w-3 h-3 text-emerald-500" /> Hometown (From)
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{hometown}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Cake className="w-3 h-3 text-amber-500" /> Birthdate
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{birthdate}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <School className="w-3 h-3 text-indigo-500" /> School
              </span>
              <p className="font-bold text-slate-900 dark:text-white truncate" title={school}>{school}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-purple-500" /> College
              </span>
              <p className="font-bold text-slate-900 dark:text-white truncate" title={college}>{college}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-bup-700" /> University
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{university}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <AtSign className="w-3 h-3 text-sky-500" /> Instagram / Social
              </span>
              <p className="font-bold text-sky-600 dark:text-sky-400">@{instagram}</p>
            </div>
          </div>
        ) : (
          /* Edit Mode Form (User Requirement #6) */
          <form onSubmit={handleSavePersonalDetails} className="space-y-4 text-xs animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Profile Category / Type:
                </label>
                <input
                  type="text"
                  value={profileType}
                  onChange={(e) => setProfileType(e.target.value)}
                  placeholder="e.g. Personal blog, Student Leader"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lives in (City / Village):
                </label>
                <input
                  type="text"
                  value={livesIn}
                  onChange={(e) => setLivesIn(e.target.value)}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hometown (From):
                </label>
                <input
                  type="text"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  placeholder="e.g. Cumilla, Bangladesh"
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
                  placeholder="e.g. Tongi Pilot School & Girls College"
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
                  placeholder="e.g. Dhaka College"
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
                  placeholder="e.g. Bangladesh University of Professionals - BUP"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instagram / Social Handle:
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="e.g. tanvir_naeeem"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Motto Quote:
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="e.g. History only remembers how you finished."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditProfileMode(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
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
        )}
      </div>

      {/* Share Profile Modal (User Requirement #5) */}
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
              <p className="font-bold text-xs text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">BUP Profile QR Code</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/u/${encodeURIComponent(
                  (user?.name || 'tanvir_naeem').toLowerCase().replace(/\s+/g, '_')
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
              placeholder="What's on your mind? (e.g. Lab test prep...)"
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

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Success!</strong> Profile picture, cover photo, and personal background updated.
          </span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Requirement 5: 3-Level Military Grade Security Shield & Architecture */}
        <div className="bg-gradient-to-br from-slate-900 via-bup-navy to-slate-950 text-white rounded-3xl p-6 border border-blue-900/60 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">3-Level University Security Shield</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    ALL TIERS ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Comprehensive Defense: Network Perimeter, Zero-Trust Authentication & AES-256 Cryptographic Vault
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSecurityModalOpen(true)}
              className="btn-motion px-4 py-2 rounded-xl text-xs font-bold bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/40 flex items-center gap-2"
            >
              <span>Inspect Live Telemetry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Level 1 */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Globe className="w-4 h-4" />
                <h4 className="font-bold">Level 1: Perimeter Shield</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Sliding-Window IP Rate Limiter (150 req/min), Anti-Brute Force Lockout (8 fails/15m), and HSTS Clickjack Defense.
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                ✓ 100% Armed
              </span>
            </div>

            {/* Level 2 */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <KeyRound className="w-4 h-4" />
                <h4 className="font-bold">Level 2: Zero-Trust Guard</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Bcrypt-hashed single-use 5m OTP challenge, HMAC-SHA256 signed JWTs, and Server-enforced Role Isolation.
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                ✓ Verified
              </span>
            </div>

            {/* Level 3 */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Database className="w-4 h-4" />
                <h4 className="font-bold">Level 3: Cryptographic Vault</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Web Crypto AES-GCM 256-bit envelope encryption for Chatbox, zero plaintext in MySQL, and 100% prepared SQL.
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                ✓ AES-256 Active
              </span>
            </div>
          </div>
        </div>

        {/* Section Choice & Bio */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-bup-600" />
            <span>Academic Section & Biography</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Enrolled Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-bup-700 dark:text-bup-300"
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">About / Bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your interests..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Teacher Feedback: Custom Reminder Settings (Time, Device) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Teacher Requirement: Custom Reminder Setting (Time, Device)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
              CONFIGURED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Advance Time */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-bup-600" /> Lead Notification Time:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 30, 60].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setLeadTime(t)}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      leadTime === t
                        ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>

            {/* Target Device */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-bup-600" /> Target Reminder Device:
              </label>
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="browser">Current Web Browser</option>
                <option value="android_pwa">Android Device (PWA Push)</option>
                <option value="ios_pwa">iOS Device (Apple PWA)</option>
                <option value="email_push">SMS & Priority Email</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teacher Feedback: Course Selection Preference */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-bup-600" />
            <span>Teacher Requirement: Course Selection Preference</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select enrolled or prioritized courses to customize your personalized routine & alerts:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {availableCourses.map((c) => {
              const selected = coursePrefs.includes(c.code);
              return (
                <div
                  key={c.code}
                  onClick={() => toggleCourse(c.code)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-bup-50/80 dark:bg-bup-950/40 border-bup-600 ring-2 ring-bup-600/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-mono font-bold text-bup-700 dark:text-bup-300">{c.code}</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{c.title}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      selected ? 'bg-bup-700 text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {selected && '✓'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teacher Feedback: Favorite Club Preference */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Teacher Requirement: Favorite Club Preference</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {availableClubs.map((club) => {
              const selected = favoriteClubs.includes(club);
              return (
                <div
                  key={club}
                  onClick={() => toggleClub(club)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{club}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      selected ? 'bg-rose-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {selected && '✓'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>

      {/* Security Telemetry Modal */}
      <SecurityShieldModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />
    </div>
  );
};
