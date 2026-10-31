import React, { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Send,
  Sparkles,
  Users,
  BookOpen,
  Filter,
  FileText,
  Download,
  Play,
  Pause,
  Video,
  Film,
  Image as ImageIcon,
  Eye,
  CheckCircle2,
  Plus,
  Flame,
  TrendingUp,
  Award,
  Smile,
  ShieldCheck,
  Compass,
  X,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CreatePostModal } from '../components/CreatePostModal';

// Interactive Facebook-Style Reaction definitions
const REACTIONS = [
  { id: 'like', label: 'Like', emoji: '👍', color: 'text-blue-600' },
  { id: 'love', label: 'Love', emoji: '❤️', color: 'text-rose-600' },
  { id: 'insight', label: 'Insight', emoji: '💡', color: 'text-amber-500' },
  { id: 'clap', label: 'Clap', emoji: '👏', color: 'text-emerald-600' },
  { id: 'wow', label: 'Wow', emoji: '😮', color: 'text-purple-600' },
];

export const Feed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [mediaFilter, setMediaFilter] = useState('ALL'); // ALL, NOTE, REEL, VIDEO, IMAGE
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Active comment inputs per post ID
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});

  // Video play state
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Active hover reaction menu
  const [activeReactionPostId, setActiveReactionPostId] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, string>>({});

  // Story modal state
  const [activeStory, setActiveStory] = useState<any | null>(null);

  // Realistic Stories data
  const stories = [
    {
      id: 'create',
      isCreate: true,
      author: 'Add to Story',
      avatar: user?.avatar,
      bg: 'bg-gradient-to-b from-blue-600 to-bup-900',
    },
    {
      id: 's1',
      author: 'BUP Robotics Club',
      role: 'Official Club',
      avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150',
      preview: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
      title: 'Robotics Workshop',
      caption: 'FST Lab 402 Hands-on Microcontroller Workshop tomorrow at 3:00 PM! 🤖 Free registration for ICT & CSE.',
      time: '2h ago',
    },
    {
      id: 's2',
      author: 'Dr. Md. Sabir Hossain',
      role: 'Dept Chairman',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      preview: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      title: 'Midterm Examination',
      caption: 'Spring 2026 Midterm schedule approved by Academic Council. Check Routine Hub for section timings.',
      time: '4h ago',
    },
    {
      id: 's3',
      author: 'Munshi Tanvir Hossain',
      role: 'Section B Lead',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      preview: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
      title: 'Campus Sunset',
      caption: 'Evening golden hour breeze at BUP Central Lake after 4 hours of Data Structures lab! 🌅',
      time: '6h ago',
    },
    {
      id: 's4',
      author: 'BUP InfoTech Club',
      role: 'Official Club',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
      preview: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
      title: 'Tech Fest 2026',
      caption: 'BUP National Tech Fest 2026 registration is officially LIVE! Hackathon prize pool: 1,50,000 BDT. 💻',
      time: '8h ago',
    },
    {
      id: 's5',
      author: 'Asst. Prof. Nazneen',
      role: 'Faculty Supervisor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      title: 'Lab Manual Updated',
      caption: 'Data Structures Lab Manual v2 uploaded on Academics Portal. Section A students please submit report.',
      time: '12h ago',
    },
    {
      id: 's6',
      author: 'BUP Sports Club',
      role: 'Inter-Faculty Football',
      avatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150',
      preview: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
      title: 'FST Grand Final Win',
      caption: 'Congratulations to FST Football Team on reaching the BUP Inter-Faculty Championship Finals! ⚽🏆',
      time: '14h ago',
    },
    {
      id: 's7',
      author: 'BUP Cultural Forum',
      role: 'Lakeside Spring Fest',
      avatar: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=150',
      preview: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      title: 'Bijoy Auditorium Night',
      caption: 'Glimpse of musical rhythm & acoustic band performance at Central Lakeside Amphitheatre! 🎸✨',
      time: '16h ago',
    },
  ];

  // Default initial BUP campus posts for instant fallback
  const DEFAULT_INITIAL_POSTS = [
    {
      _id: 'post-antorikkho-22',
      id: 'post-antorikkho-22',
      title: 'স্মৃতির পাতায় অন্তরীক্ষ-২২ ❤️ BUP Campus Batch Fest Celebrations',
      content: 'লাল পাঞ্জাবি আর শাড়ির মুগ্ধতায় পুরো বিইউপি ক্যাম্পাস মুখরিত! Faculty of Science and Technology (FST) এর অন্তরীক্ষ-২২ ব্যাচ ফেস্টের অবিস্মরণীয় মুহূর্তগুলো। একসাথে ক্লাস করা, ল্যাব টেস্টের প্যারা, ক্যাফেটেরিয়ার আড্ডা—সবকিছু মিলিয়ে জীবনের সেরা সময়গুলো কাটছে BUP-তে! 🎓✨🇧🇩',
      communityType: 'CAMPUS',
      communityTarget: 'General Campus',
      mediaType: 'IMAGE',
      imageUrl: '/assets/bup_antorikkho_batch22.jpg',
      tags: ['#অন্তরীক্ষ২২', '#BUPCampus', '#FSTBatchFest', '#RedPanjabiSaree', '#Memories'],
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      author: {
        id: 'student-tanvir-naeem',
        name: 'Tanvir Naeem',
        role: 'student',
        department: 'Dept of ICT (BICE-2024)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      },
      likes: [
        { userId: 'u1', name: 'Munshi Tanvir' },
        { userId: 'u2', name: 'Safaytul Islam Rafi' },
        { userId: 'u3', name: 'Nusrat Jahan' },
        { userId: 'u4', name: 'Anika' },
        { userId: 'u5', name: 'Sadia' },
      ],
      comments: [
        {
          id: 'c-ant-1',
          content: 'কী দারুণ মুহূর্ত ছিল ভাই! আমাদের অন্তরীক্ষ-২২ ব্যাচ ফেস্ট সত্যিই স্মরণীয় হয়ে থাকবে। ❤️',
          authorName: 'Safaytul Islam Rafi',
          createdAt: new Date(Date.now() - 1200000).toISOString(),
        },
        {
          id: 'c-ant-2',
          content: 'লাল রঙের পুরো ব্যানার আর মিলনমেলা একদম পারফেক্ট এসেছে! 👏',
          authorName: 'Asst. Prof. Nazneen Akter',
          createdAt: new Date(Date.now() - 600000).toISOString(),
        },
      ],
      viewsCount: 1680,
    },
    {
      _id: 'post-init-1',
      id: 'post-init-1',
      title: 'ICE-3207: Software & Requirement Engineering SRS Guideline & Midterm Handout',
      content: 'Dear students of BICE-2024 (Section A & B), please review the attached Software Requirement Specification (SRS) standard template and agile user-story breakdown for your upcoming semester project.',
      communityType: 'DEPARTMENT',
      communityTarget: 'Department of ICT',
      mediaType: 'NOTE',
      attachmentName: 'ICE3207_Software_Requirement_Engineering_SRS_Guide.pdf',
      attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tags: ['#BUPFST', '#ICE3207', '#StudyNotes', '#LectureMaterials'],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      author: {
        id: 'fac-ict-001',
        name: 'Asst. Prof. Nazneen Akter',
        role: 'faculty',
        department: 'Department of ICT',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      },
      likes: [{ userId: 'u1', name: 'Tanvir' }, { userId: 'u2', name: 'Rafi' }],
      comments: [
        {
          id: 'c1',
          content: 'Thank you Ma\'am! The diagram breakdown on page 14 is very clear.',
          authorName: 'Safaytul Islam Rafi',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
      viewsCount: 384,
    },
    {
      _id: 'post-init-2',
      id: 'post-init-2',
      title: 'BUP Campus Sunset at Mirpur Cantonment Central Lake',
      content: 'Golden hour after 4 intense hours of Web Technologies Lab! BUP campus always gives the most peaceful breeze after a hard coding day. 🌅',
      communityType: 'CAMPUS',
      communityTarget: 'General Campus',
      mediaType: 'IMAGE',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900',
      tags: ['#BUPLife', '#CampusVibes', '#ICTBatch24', '#Sunset'],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      author: {
        id: 'student-tanvir',
        name: 'Munshi Tanvir Hossain',
        role: 'student',
        department: 'Department of ICT',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      },
      likes: [{ userId: 'u1', name: 'Anika' }, { userId: 'u2', name: 'Rafi' }, { userId: 'u3', name: 'Sadia' }],
      comments: [
        {
          id: 'c2',
          content: 'The lighting on Academic Block 2 is stunning! 🔥',
          authorName: 'Anika Tahsin',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        },
      ],
      viewsCount: 512,
    },
    {
      _id: 'post-init-3',
      id: 'post-init-3',
      title: 'ICE-3205: Full-Stack Web Architecture & Express / MySQL Lab Manual',
      content: 'Here are the laboratory exercises and code snippets for Session 4 (Database Connection Pooling and JWT Authentication). Ensure you clone the repo and submit lab reports by Thursday.',
      communityType: 'COURSE',
      communityTarget: 'ICE-3205 (Web Technologies)',
      mediaType: 'NOTE',
      attachmentName: 'ICE3205_Web_Technologies_Lab_Exercises.pdf',
      attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tags: ['#WebTech', '#NodeJS', '#MySQL', '#BICE2024'],
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      author: {
        id: 'fac-ict-003',
        name: 'Lec. Md. Istakiak Adnan Palash',
        role: 'faculty',
        department: 'Department of ICT',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      likes: [{ userId: 'u1', name: 'Rafi' }],
      comments: [],
      viewsCount: 290,
    },
    {
      _id: 'post-init-4',
      id: 'post-init-4',
      title: 'BUP Robotics Club: Autonomous Line Follower Testing in Hardware Lab',
      content: 'Our team fine-tuning PID controller parameters on the custom Arduino robot for the upcoming National Robotics Olympiad 2026. Watch the smooth turning radius! 🤖',
      communityType: 'CLUB',
      communityTarget: 'BUP Robotics Club (BUPRC)',
      mediaType: 'REEL',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      tags: ['#BUPRC', '#Robotics', '#HardwareLab', '#Engineering'],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      author: {
        id: 'club-buprc',
        name: 'BUP Robotics Club',
        role: 'club_admin',
        department: 'Department of ICT',
        avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150',
      },
      likes: [{ userId: 'u1', name: 'Tanvir' }, { userId: 'u2', name: 'Dean' }],
      comments: [
        {
          id: 'c3',
          content: 'Keep up the good work! Represent BUP with excellence.',
          authorName: 'Col Mohammed Omar Faruque, PhD',
          createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        },
      ],
      viewsCount: 890,
    },
  ];

  const fetchPosts = async () => {
    try {
      const query = selectedFilter !== 'All' ? `?communityType=${selectedFilter}` : '';
      const res = await apiFetch(`/posts${query}`);
      const stored = localStorage.getItem('bupsoc_feed_posts');
      const localPosts = stored ? JSON.parse(stored) : [];

      if (res.success && res.posts && res.posts.length > 0) {
        // Merge API posts with local user posts (avoid duplicate IDs)
        const combined = [...localPosts];
        res.posts.forEach((ap: any) => {
          if (!combined.some((cp) => cp._id === ap.id || cp.id === ap.id || cp._id === ap._id)) {
            combined.push(ap);
          }
        });
        setPosts(combined);
      } else {
        // Fallback: local posts merged with rich default initial posts
        const combined = [...localPosts];
        DEFAULT_INITIAL_POSTS.forEach((dp) => {
          if (!combined.some((cp) => cp._id === dp._id || cp.id === dp.id)) {
            combined.push(dp);
          }
        });
        setPosts(combined);
      }
    } catch (err) {
      console.warn('Network fetch error, loading local posts and defaults:', err);
      const stored = localStorage.getItem('bupsoc_feed_posts');
      const localPosts = stored ? JSON.parse(stored) : [];
      const combined = [...localPosts];
      DEFAULT_INITIAL_POSTS.forEach((dp) => {
        if (!combined.some((cp) => cp._id === dp._id || cp.id === dp.id)) {
          combined.push(dp);
        }
      });
      setPosts(combined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedFilter]);

  const handleSelectReaction = async (postId: string, reactionId: string) => {
    setUserReactions((prev) => ({ ...prev, [postId]: reactionId }));
    setActiveReactionPostId(null);

    // Update state & localStorage immediately
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p._id === postId || p.id === postId) {
          const hasLiked = p.likes?.some((l: any) => l.userId === user?.id);
          const newLikes = hasLiked
            ? p.likes
            : [...(p.likes || []), { userId: user?.id || 'guest', name: user?.name || 'You' }];
          return { ...p, likes: newLikes };
        }
        return p;
      });

      try {
        const stored = localStorage.getItem('bupsoc_feed_posts');
        if (stored) {
          const localList: any[] = JSON.parse(stored);
          const idx = localList.findIndex((lp) => lp._id === postId || lp.id === postId);
          if (idx !== -1) {
            localList[idx].likes = [...(localList[idx].likes || []), { userId: user?.id || 'guest', name: user?.name || 'You' }];
            localStorage.setItem('bupsoc_feed_posts', JSON.stringify(localList));
          }
        }
      } catch (e) {}

      return updated;
    });

    try {
      await apiFetch(`/posts/${postId}/like`, { method: 'POST' });
    } catch (err) {}
  };

  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));

    const newCommentObj = {
      id: 'comm-' + Date.now(),
      content: content.trim(),
      authorName: user?.name || 'BUP Member',
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p._id === postId || p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newCommentObj],
          };
        }
        return p;
      });

      try {
        const stored = localStorage.getItem('bupsoc_feed_posts');
        if (stored) {
          const localList: any[] = JSON.parse(stored);
          const idx = localList.findIndex((lp) => lp._id === postId || lp.id === postId);
          if (idx !== -1) {
            localList[idx].comments = [...(localList[idx].comments || []), newCommentObj];
            localStorage.setItem('bupsoc_feed_posts', JSON.stringify(localList));
          }
        }
      } catch (e) {}

      return updated;
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));

    try {
      await apiFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    } catch (err) {
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const res = await apiFetch(`/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (res.success && res.post) {
        setPosts((prev) => prev.map((p) => (p._id === postId ? res.post : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter posts by media type
  const filteredPosts = posts.filter((p) => {
    if (mediaFilter === 'ALL') return true;
    if (mediaFilter === 'NOTE') return p.mediaType === 'NOTE';
    if (mediaFilter === 'REEL') return p.mediaType === 'REEL';
    if (mediaFilter === 'VIDEO') return p.mediaType === 'VIDEO';
    if (mediaFilter === 'IMAGE') return p.mediaType === 'IMAGE' || p.imageUrl;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-5">
      {/* Official BUP Admission & Research Alert Marquee (Req 8) */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-bup-navy to-indigo-950 text-white p-3 sm:p-3.5 shadow-md border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse shrink-0">
            ADMISSION 2026-27
          </span>
          <p className="text-xs font-semibold text-blue-100 truncate">
            <strong>FST Undergraduate Admission Circular:</strong> B.Sc. in ICT, CSE & ES. Written Test: 16 Jan 2027. Application Deadline: 20 Dec 2026.
          </p>
        </div>

        <a
          href="https://admission.bup.edu.bd"
          target="_blank"
          rel="noreferrer"
          className="btn-motion btn-bup-gold text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 shadow-sm"
        >
          Apply via admission.bup.edu.bd ↗
        </a>
      </div>

      {/* 1. Facebook-Style Campus Stories Tray */}
      <div className="mb-6 overflow-hidden">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {stories.map((story) => {
            if (story.isCreate) {
              return (
                <div
                  key={story.id}
                  onClick={() => setCreateModalOpen(true)}
                  className="btn-motion w-28 sm:w-32 h-44 sm:h-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col cursor-pointer shrink-0 group"
                >
                  <div className="flex-1 bg-gradient-to-tr from-blue-700 via-bup-700 to-indigo-800 relative flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      />
                    ) : (
                      <Users className="w-10 h-10 text-white/50" />
                    )}
                    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md">
                      <Plus className="w-4 h-4 font-bold" />
                    </div>
                  </div>
                  <div className="h-10 pt-4 pb-2 px-1 text-center bg-white dark:bg-slate-900">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">Create Story</p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="btn-motion w-28 sm:w-32 h-44 sm:h-48 rounded-2xl relative overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800 cursor-pointer shrink-0 group"
              >
                <img
                  src={story.preview}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                {/* Author Avatar Badge */}
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full border-2 border-blue-500 overflow-hidden shadow-md">
                  <img src={story.avatar} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Caption / Title */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <p className="text-[11px] font-bold text-white drop-shadow-md truncate">{story.title}</p>
                  <p className="text-[9px] text-blue-200 drop-shadow truncate">{story.author}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Feed + Campus Pulse Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Feed Stream (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Top Banner & Quick Creator */}
          <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-bup-700 to-emerald-600 text-amber-400 flex items-center justify-center font-black text-lg shadow-md shadow-bup-700/20">
                BUP
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Campus Social & Academic Feed</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Welcome, <strong className="text-bup-700 dark:text-bup-300">{user?.name}</strong> (
                  {user?.role === 'faculty' ? 'Faculty' : `${user?.section || 'Section A'}`})
                </p>
              </div>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="btn-motion btn-bup-primary w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Post Note, Reel or Photo</span>
            </button>
          </div>

          {/* Facebook-Style Media Filter Bar: Notes, Reels, Videos, Photos */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'All Feed', icon: Sparkles },
              { id: 'NOTE', label: 'Lecture Notes (PDF)', icon: FileText },
              { id: 'REEL', label: 'Campus Reels', icon: Film },
              { id: 'VIDEO', label: 'Videos', icon: Video },
              { id: 'IMAGE', label: 'Photos', icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = mediaFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMediaFilter(tab.id)}
                  className={`btn-motion flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-bup-700 text-white border-bup-700 shadow-md shadow-bup-700/25'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-bup-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Community Space Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            {['All', 'Campus', 'Course', 'Department', 'Club'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-xl font-semibold transition-all shrink-0 ${
                  selectedFilter === filter
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {filter === 'All' ? 'All Spaces' : `${filter}`}
              </button>
            ))}
          </div>

          {/* Feed Posts Stream */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading feed posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-3xl p-8">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No posts found in this filter</p>
              <p className="text-xs text-slate-500 mt-1">Be the first to share notes, photos or a reel in this space!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredPosts.map((post) => {
                const hasLiked = post.likes?.some((l: any) => l.userId === user?.id);
                const isNote = post.mediaType === 'NOTE';
                const isReel = post.mediaType === 'REEL';
                const isVideo = post.mediaType === 'VIDEO';
                const selectedReaction = userReactions[post._id];

                return (
                  <article
                    key={post._id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 relative"
                  >
                    {/* Author Info & Verified Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-bup-700 text-white font-black flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {post.author?.avatar ? (
                            <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            post.author?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {post.author?.name}
                            </span>
                            {/* Verified Badge */}
                            {post.author?.role === 'faculty' ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
                                <Award className="w-3 h-3 text-amber-600" />
                                <span>Official Faculty</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                <span>BUP Student</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {post.author?.department || 'Department of ICT'} • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isNote && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Note
                          </span>
                        )}
                        {isReel && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                            <Film className="w-3 h-3" /> Reel
                          </span>
                        )}
                        {isVideo && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 flex items-center gap-1">
                            <Video className="w-3 h-3" /> Video
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {post.communityTarget}
                        </span>
                      </div>
                    </div>

                    {/* Title & Content */}
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                      {post.content}
                    </p>

                    {/* 1. MEDIA: Hand-written Notes / PDF Attachment Box */}
                    {isNote && post.attachmentName && (
                      <div className="mb-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center justify-center font-black text-sm shrink-0">
                            PDF
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-amber-950 dark:text-amber-100 truncate">
                              {post.attachmentName}
                            </p>
                            <p className="text-[10px] text-amber-800/80 dark:text-amber-400">
                              Handwritten Lecture Notes & Formulas • PDF Document
                            </p>
                          </div>
                        </div>

                        <a
                          href={post.attachmentUrl || '#'}
                          download={post.attachmentName}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-motion btn-bup-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Note</span>
                        </a>
                      </div>
                    )}

                    {/* 2. MEDIA: Vertical 9:16 Campus Reel Player */}
                    {isReel && post.mediaUrl && (
                      <div className="mb-4 flex justify-center">
                        <div className="w-64 sm:w-72 aspect-[9/16] bg-black rounded-3xl overflow-hidden relative shadow-lg group">
                          <video
                            src={post.mediaUrl}
                            controls
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* 3. MEDIA: Video Post */}
                    {isVideo && post.mediaUrl && (
                      <div className="mb-4 rounded-2xl overflow-hidden bg-black aspect-video relative shadow-md">
                        <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* 4. MEDIA: Image Post */}
                    {!isNote && !isReel && !isVideo && (post.imageUrl || post.mediaUrl) && (
                      <div className="mb-4 rounded-2xl overflow-hidden max-h-96 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                        <img
                          src={post.mediaUrl || post.imageUrl}
                          alt="Post attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Tags & Views Count */}
                    <div className="flex items-center justify-between mb-3">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium text-bup-700 dark:text-bup-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {post.viewsCount > 0 && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.viewsCount} views</span>
                        </span>
                      )}
                    </div>

                    {/* Like, Comment & Share Bar with Facebook Reactions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs relative">
                      {/* Floating Reaction Bar when hovering */}
                      {activeReactionPostId === post._id && (
                        <div
                          onMouseLeave={() => setActiveReactionPostId(null)}
                          className="absolute -top-11 left-0 z-20 flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-fadeIn"
                        >
                          {REACTIONS.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => handleSelectReaction(post._id, r.id)}
                              className="btn-motion p-1 text-lg hover:scale-125 transition-transform"
                              title={r.label}
                            >
                              {r.emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        {/* Reaction / Like Button */}
                        <div className="relative">
                          <button
                            onMouseEnter={() => setActiveReactionPostId(post._id)}
                            onClick={() => handleSelectReaction(post._id, 'like')}
                            className={`flex items-center gap-1.5 transition-colors font-bold ${
                              selectedReaction
                                ? 'text-blue-600 dark:text-blue-400'
                                : hasLiked
                                ? 'text-rose-600'
                                : 'text-slate-500 hover:text-blue-600 dark:text-slate-400'
                            }`}
                          >
                            <span>
                              {selectedReaction === 'love'
                                ? '❤️'
                                : selectedReaction === 'insight'
                                ? '💡'
                                : selectedReaction === 'clap'
                                ? '👏'
                                : selectedReaction === 'wow'
                                ? '😮'
                                : '👍'}
                            </span>
                            <span>{post.likes?.length || 0}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments?.length || 0} comments</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{post.sharesCount || 14} shares</span>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {post.comments.map((comment: any) => {
                            const canDelete =
                              comment.authorId === user?.id ||
                              post.author?.userId === user?.id ||
                              user?.role === 'faculty' ||
                              user?.role === 'admin';

                            return (
                              <div
                                key={comment._id}
                                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-start justify-between gap-2 text-xs group"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-bup-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                    {comment.authorName?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-[11px] text-slate-900 dark:text-white">
                                        {comment.authorName}
                                      </span>
                                      {comment.authorRole === 'faculty' && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold dark:bg-amber-900/40 dark:text-amber-300">
                                          Faculty
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-xs mt-0.5">{comment.content}</p>
                                  </div>
                                </div>

                                {/* Delete Comment Button */}
                                {canDelete && (
                                  <button
                                    onClick={() => handleDeleteComment(post._id, comment._id)}
                                    title="Delete this comment"
                                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <form onSubmit={(e) => handleAddComment(post._id, e)} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                          placeholder="Write a constructive reply or ask question..."
                          className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-bup-600"
                        />
                        <button
                          type="submit"
                          disabled={submittingComment[post._id] || !commentInputs[post._id]?.trim()}
                          className="btn-motion btn-bup-primary p-2 rounded-xl text-white transition-colors disabled:opacity-40"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Campus Live Pulse & Trending Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Live Active Counter Card */}
          <div className="glass-panel rounded-3xl p-5 border border-emerald-500/20 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Campus Live Network
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>ONLINE</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">1,008</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">verified accounts active</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              FST, FBS, FASS, FSSS faculty and student accounts synced with MySQL database.
            </p>
          </div>

          {/* 2. Trending on Campus */}
          <div className="glass-panel rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Trending on BUP Campus</h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { tag: '#BUPHackathon2026', posts: '428 discussions', cat: 'FST Tech Fest' },
                { tag: '#MidtermRoutines', posts: '312 discussions', cat: 'Academics' },
                { tag: '#SectionA_DataStructures', posts: '189 notes shared', cat: 'Course ICT-2201' },
                { tag: '#MirpurCampusBusRoute', posts: '95 updates', cat: 'RideShare & Travel' },
                { tag: '#RoboticsWorkshopLab402', posts: '64 registered', cat: 'Clubs' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{item.cat}</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{item.tag}</p>
                  <p className="text-[10px] text-slate-500">{item.posts}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Fast Academic Services Launcher */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-bup-navy via-bup-900 to-[#0355a2] text-white shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Compass className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">Quick Campus Portal</h4>
            </div>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              Section notices, customized class alarms, and BUP-GO ride sharing are synchronized for Spring 2026.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://bup-go-project-8njl.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="btn-motion btn-bup-emerald w-full py-2 px-3 rounded-xl text-xs font-bold text-center block"
              >
                🚗 Launch BUP-GO RideShare
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Story Preview Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative flex flex-col animate-fadeIn">
            {/* Story Header */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-blue-400 overflow-hidden">
                  <img src={activeStory.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">{activeStory.author}</p>
                  <p className="text-[10px] text-slate-300">{activeStory.role} • {activeStory.time}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Media */}
            <div className="aspect-[9/16] bg-black relative flex items-center justify-center">
              <img src={activeStory.preview} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
              <div className="absolute bottom-6 left-5 right-5 text-white">
                <h4 className="text-base font-extrabold mb-1 drop-shadow">{activeStory.title}</h4>
                <p className="text-xs text-slate-200 leading-relaxed drop-shadow">{activeStory.caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  );
};
