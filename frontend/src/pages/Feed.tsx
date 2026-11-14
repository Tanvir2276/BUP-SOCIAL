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
  Edit3,
  BarChart2,
  MoreHorizontal,
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  Globe,
  Car,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CreatePostModal } from '../components/CreatePostModal';
import { EditPostModal } from '../components/EditPostModal';

// Interactive Facebook-Style Reaction definitions
const REACTIONS = [
  { id: 'like', label: 'Like', emoji: '👍', color: 'text-blue-600' },
  { id: 'love', label: 'Love', emoji: '❤️', color: 'text-rose-600' },
  { id: 'insight', label: 'Insight', emoji: '💡', color: 'text-amber-500' },
  { id: 'clap', label: 'Clap', emoji: '👏', color: 'text-emerald-600' },
  { id: 'wow', label: 'Wow', emoji: '😮', color: 'text-purple-600' },
];

interface FeedProps {
  onViewProfile?: (user: any) => void;
  onOpenChat?: (chat: any) => void;
  onNavigateTab?: (tab: string) => void;
  initialFilter?: string;
}

export const Feed: React.FC<FeedProps> = ({ onViewProfile, onOpenChat, onNavigateTab, initialFilter }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [mediaFilter, setMediaFilter] = useState('ALL'); // ALL, NOTE, REEL, VIDEO, IMAGE
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

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

  // Realistic BUP Campus Stories data (matching reference mockup)
  const stories = [
    {
      id: 'create',
      isCreate: true,
      author: 'Create Story',
      avatar: user?.avatar,
      bg: 'bg-gradient-to-b from-blue-600 to-indigo-900',
    },
    {
      id: 's-nabila',
      author: 'Nabila Islam',
      role: 'BICE 2024',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      preview: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600',
      title: 'Central Library Study 📚',
      caption: 'Focused study session for SRE & Discrete Mathematics with the team at 4th floor reading hall! ✨',
      time: '35m ago',
    },
    {
      id: 's-rafi',
      author: 'Rafi Hasan',
      role: 'CSE 2023',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      preview: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500',
      title: 'Lab 402 Innovation 🚀',
      caption: 'Autonomous drone telemetry debugging session in progress! Ready for national showcase! 🏆',
      time: '1h ago',
    },
    {
      id: 's-cse-club',
      author: 'BUP CSE Club',
      role: 'Official Club',
      avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150',
      preview: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500',
      title: 'TechTalk: Future of AI 🤖',
      caption: 'Registration is now live! Seats filling fast for the biggest AI developer workshop at Bijoy Auditorium!',
      time: '2h ago',
    },
    {
      id: 's-sadia',
      author: 'Sadia Afrin',
      role: 'BBA Batch 25',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      preview: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500',
      title: 'Campus Sunset 🌅',
      caption: 'Sunset across Central Parade Ground & BUP Lakeside after financial accounting presentation.',
      time: '3h ago',
    },
    {
      id: 's-cultural',
      author: 'BUP Cultural Forum',
      role: 'Official Club',
      avatar: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=150',
      preview: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
      title: 'Cultural Fest 2026 🎭',
      caption: 'Rehearsals going strong at Bijoy Auditorium! Save the date for Spring Cultural Gala!',
      time: '5h ago',
    },
    {
      id: 's-antorikkho',
      author: 'Tanvir Naeem',
      role: 'ICT Batch 22 Scholar',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      preview: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500',
      title: 'BUP Lakeside Vista 🌿',
      caption: 'Peaceful afternoon by Central Lake after DSP and Microprocessors lab defense! FST scholars for life! 🎓✨',
      time: '7h ago',
    },
  ];

  // Default initial authentic BUP campus posts
  const DEFAULT_INITIAL_POSTS = [
    {
      _id: 'post-bup-cse-club-techtalk',
      id: 'post-bup-cse-club-techtalk',
      title: 'TechTalk: The Future of AI',
      content: 'Registration is now open for our upcoming TechTalk session!\nJoin us to explore the future of AI and its real-world applications.',
      communityType: 'CLUB',
      communityTarget: 'BUP CSE Club',
      mediaType: 'IMAGE',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000',
      isTechTalkBanner: true,
      tags: ['#TechTalk', '#TheFutureOfAI', '#BUPCSEClub', '#Auditorium', '#FSTInnovation'],
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      author: {
        id: 'club-bup-cse',
        name: 'BUP CSE Club',
        role: 'club',
        department: 'Dept of CSE & ICT',
        avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150',
        isVerified: true,
      },
      likes: [
        { userId: 'u1', name: 'Tanvir Naeem' },
        { userId: 'u2', name: 'Nabila Islam' },
        { userId: 'u3', name: 'Rafi Hasan' },
      ],
      likesCount: 124,
      commentsCount: 12,
      sharesCount: 8,
      comments: [
        {
          id: 'c-tt-1',
          content: 'Just registered! Looking forward to the AI model deployment hands-on session! 🔥',
          authorName: 'Nabila Islam',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'c-tt-2',
          content: 'Are students from all departments welcome to join?',
          authorName: 'Rafi Hasan',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
      viewsCount: 3250,
    },
    {
      _id: 'post-midterm-notes-published-32',
      id: 'post-midterm-notes-published-32',
      title: '📢 Official 3.2 Mid-Term Study Notes & Question Bank Published: MCA, MEA, SRE & WT! 📚🎓',
      content: `Dear 3rd Year ICT & CSE scholars,

The official academic study repositories for 3.2 Mid-Term examinations have been published to the Academics Notes Hub:

1. SRE (ICE-3201): Software Development Life Cycle (SDLC), IEEE 830 SRS Guide, IEEE Code of Ethics, Agile User Stories, and 5 Illustrated Handwritten Study Sheets!
2. WT (ICE-3205): Internet Architecture, HTML5/CSS3 Box Model, CT-1 & CT-2 Solved Papers, and Practice Problem Sets.
3. MCA (ICE-3203): Microprocessor 8086 Architecture, Bus Interface, Addressing Modes, Instruction Set & 8255 PPI Interface.
4. MEA (ICE-3204): Microwave Waveguides, TE/TM Modes, Antenna Radiation Patterns & 11.5 MB Comprehensive Handwritten Class Note!

All 69 files are available for preview and 1-click download in Academics -> "Mid-Term Notes Hub (3.2)". Best of luck with your preparation!`,
      communityType: 'DEPARTMENT',
      communityTarget: 'Department of ICT',
      mediaType: 'NOTE',
      imageUrl: '/notes/SRE/handwritten/Lecture_2_SDLC_Study_Notes.jpg',
      attachmentName: 'SRE_Lecture_2_SDLC_Study_Notes.jpg',
      attachmentUrl: '/notes/SRE/handwritten/Lecture_2_SDLC_Study_Notes.jpg',
      tags: ['#BUPNotes', '#MidTerm2026', '#SRE', '#WebTech', '#MCA', '#MEA', '#FSTFaculty'],
      createdAt: new Date().toISOString(),
      author: {
        id: 'fac-ict-suman-saha',
        name: 'Suman Saha',
        role: 'faculty',
        department: 'Department of ICT (FST)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      },
      likes: [
        { userId: 'u1', name: 'Tanvir Naeem' },
        { userId: 'u2', name: 'Safaytul Islam Rafi' },
        { userId: 'u3', name: 'Nusrat Jahan Nishi' },
      ],
      comments: [
        {
          id: 'c-notes-1',
          content: 'Thank you Sir! The handwritten SRE and MEA lecture notes are incredibly helpful! 🙏🔥',
          authorName: 'Tanvir Naeem',
          createdAt: new Date().toISOString(),
        },
      ],
      viewsCount: 1890,
    },
    {
      _id: 'post-prize-techfest',
      id: 'post-prize-techfest',
      title: 'বিজয় উল্লাস! BUP National Tech Fest 2026 Champion Award Ceremony 🏆',
      content: 'Honorable Vice Chancellor Maj Gen Md Mahbub-ul Alam, ndc, afwc, psc, MPhil, PhD presenting the Championship Trophy to Team BUP-CyberKnights for their Smart Campus IoT & Security Innovation! Faculty of Science and Technology (FST) Dean and Department Chairman congratulated all finalist teams. Hard work, countless sleepless nights at Lab 402, and true teamwork paid off! Proud moment for BUP! 🇧🇩✨',
      communityType: 'CAMPUS',
      communityTarget: 'General Campus',
      mediaType: 'IMAGE',
      imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900',
      tags: ['#BUPPrizeGiving', '#TechFestChampion', '#FSTAwards', '#SmartBangladesh', '#BUPPride'],
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      author: {
        id: 'student-24549010064',
        name: 'Safaytul Islam Rafi',
        role: 'student',
        studentId: '24549010064',
        college: 'Notre Dame College',
        livesIn: 'Uttara Sector 11, Dhaka',
        hometown: 'Chattogram, Bangladesh',
        instagram: 'rafi_bup',
        motto: 'Engineering digital solutions for Smart Bangladesh 🇧🇩',
        department: 'Dept of ICT (BICE-2024)',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      },
      likes: [
        { userId: 'u1', name: 'Tanvir Naeem' },
        { userId: 'u2', name: 'Nusrat Jahan Nishi' },
        { userId: 'u3', name: 'Mahir Faisal' },
        { userId: 'u4', name: 'Anika Tahsin' },
      ],
      comments: [
        {
          id: 'c-pz-1',
          content: 'Congratulations Rafi and team! FST is always on top! 👏🔥',
          authorName: 'Tanvir Naeem',
          createdAt: new Date(Date.now() - 1200000).toISOString(),
        },
        {
          id: 'c-pz-2',
          content: 'Outstanding achievement! Proud of our ICT scholars.',
          authorName: 'Asst. Prof. Nazneen Akter',
          createdAt: new Date(Date.now() - 600000).toISOString(),
        },
      ],
      viewsCount: 2450,
    },
    {
      _id: 'post-thesis-defense',
      id: 'post-thesis-defense',
      title: 'BICE & BCSE Spring 2026 Capstone Project & Final Year Thesis Defense 🎓📚',
      content: 'Insightful thesis defense sessions today at FST Conference Room 302! Undergraduate researchers presented thesis topics ranging from Quantum Cryptography, Low-Latency 5G Beamforming to AI-driven Medical Imaging before the Department Evaluation Committee and External Examiners from BUET and DU. Heartiest congratulations to all presenting scholars on their defense completion!',
      communityType: 'DEPARTMENT',
      communityTarget: 'Department of ICT',
      mediaType: 'IMAGE',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900',
      tags: ['#ThesisDefense', '#BUPResearch', '#FSTSymposium', '#CapstoneProject', '#GraduationBound'],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      author: {
        id: 'fac-ict-chair',
        name: 'Col Mohammed Omar Faruque, PhD',
        role: 'faculty',
        department: 'Chairman, Dept of ICT, FST',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
      likes: [
        { userId: 'u1', name: 'Tanvir Naeem' },
        { userId: 'u2', name: 'Safaytul Islam Rafi' },
      ],
      comments: [
        {
          id: 'c-th-1',
          content: 'Thank you Sir for your constant guidance throughout our research journey! 🙏',
          authorName: 'Nusrat Jahan Nishi',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
      viewsCount: 1820,
    },
    {
      _id: 'post-cpc-counseling',
      id: 'post-cpc-counseling',
      title: 'BUP CPC: Navigating Academic Stress, Thesis Milestones & Corporate Career Pathways 🧭',
      content: 'The Counselling and Placement Center (CPC) of BUP successfully conducted an interactive mentorship and mental wellness session titled "Thriving Beyond the Classroom". Dr. Shahed Rahman and guest corporate alumni shared strategies on handling final semester thesis pressure, balancing co-curricular activities, and acing tech interviews. Students from ICT, CSE and ES participated actively with fruitful open-floor discussions.',
      communityType: 'CAMPUS',
      communityTarget: 'Student Affairs',
      mediaType: 'IMAGE',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900',
      tags: ['#BUPCounseling', '#CPCMentorship', '#StudentWellbeing', '#CareerGuidance', '#AcademicCare'],
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      author: {
        id: 'fac-ict-001',
        name: 'Asst. Prof. Nazneen Akter',
        role: 'faculty',
        department: 'Department of ICT',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      },
      likes: [{ userId: 'u1', name: 'Sadia Rahman' }, { userId: 'u2', name: 'Anika Tahsin' }],
      comments: [
        {
          id: 'c-cpc-1',
          content: 'The session on thesis anxiety management was extremely helpful Ma\'am! ❤️',
          authorName: 'Sadia Rahman',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
      viewsCount: 1390,
    },
    {
      _id: 'post-seminar-ai',
      id: 'post-seminar-ai',
      title: 'Bijoy Auditorium: National Seminar on AI in 4IR & Smart Defence Systems 🛡️💡',
      content: 'Faculty of Science & Technology organized a full-day seminar at the Bijoy Auditorium. Renowned industry experts, military tech researchers, and academicians shared groundbreaking perspectives on AI ethics, cyber-resilience, and defense data encryption. Special student Q&A session enriched the technical discourse.',
      communityType: 'CAMPUS',
      communityTarget: 'Faculty of Science and Technology',
      mediaType: 'IMAGE',
      imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900',
      tags: ['#BUPSeminar', '#BijoyAuditorium', '#AIin4IR', '#CyberDefense', '#FSTEvent'],
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      author: {
        id: 'dean-fst-001',
        name: 'Brigadier General Sufi Md Ataur Rahman, ndc, psc',
        role: 'faculty',
        department: 'Dean, Faculty of Science & Technology',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      likes: [{ userId: 'u1', name: 'Tanvir Naeem' }, { userId: 'u2', name: 'Mahir Faisal' }],
      comments: [],
      viewsCount: 3120,
    },
    {
      _id: 'post-antorikkho-22',
      id: 'post-antorikkho-22',
      title: 'Campus Life & Lakeside Memories 🌿✨ BUP Autumn Afternoon Moments',
      content: 'Sunset by the BUP Central Lake after intensive SRE & Microprocessor lab defense! Balancing rigorous engineering coursework with campus culture, friendship and endless laughter by the cafeteria. Proud to be part of the vibrant BUP FST family! 🎓✨🇧🇩',
      communityType: 'CAMPUS',
      communityTarget: 'General Campus',
      mediaType: 'IMAGE',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000',
      tags: ['#BUPCampus', '#CampusLife', '#FSTScholars', '#MirpurDOHS', '#LakesideSunset'],
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      author: {
        id: 'student-24549010076',
        name: 'Tanvir Naeem',
        role: 'student',
        studentId: '24549010076',
        college: 'Dhaka College',
        livesIn: 'Mirpur DOHS, Dhaka',
        hometown: 'Cumilla, Bangladesh',
        instagram: 'tanvir_naeeem',
        motto: 'History only remembers how you finished.',
        department: 'Dept of ICT (BICE-2024)',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      },
      likes: [
        { userId: 'u1', name: 'Safaytul Islam Rafi' },
        { userId: 'u2', name: 'Nusrat Jahan Nishi' },
        { userId: 'u3', name: 'Mahir Faisal' },
        { userId: 'u4', name: 'Anika Tahsin' },
        { userId: 'u5', name: 'Sadia Rahman' },
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
      viewsCount: 3890,
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

  // User Requirement #1: Edit & Delete Own Posts
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    setPosts((prev) => prev.filter((p) => p._id !== postId && p.id !== postId));

    try {
      const stored = localStorage.getItem('bupsoc_feed_posts');
      if (stored) {
        const localList: any[] = JSON.parse(stored);
        const filtered = localList.filter((p) => p._id !== postId && p.id !== postId);
        localStorage.setItem('bupsoc_feed_posts', JSON.stringify(filtered));
      }
    } catch (e) {}

    try {
      await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Backend delete sync:', err);
    }
  };

  const handlePostUpdated = (updatedPost: any) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id || p.id === updatedPost.id ? updatedPost : p))
    );

    try {
      const stored = localStorage.getItem('bupsoc_feed_posts');
      if (stored) {
        const localList: any[] = JSON.parse(stored);
        const idx = localList.findIndex(
          (lp) => lp._id === updatedPost._id || lp.id === updatedPost.id
        );
        if (idx !== -1) {
          localList[idx] = updatedPost;
          localStorage.setItem('bupsoc_feed_posts', JSON.stringify(localList));
        }
      }
    } catch (e) {}
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
    <div className="max-w-6xl mx-auto px-1 sm:px-3 py-2 sm:py-4 space-y-4 w-full max-w-full overflow-x-hidden">
      {/* Official BUP Admission Alert */}
      <div className="rounded-2xl bg-gradient-to-r from-[#072146] via-bup-navy to-[#0a192f] text-white p-3.5 sm:p-4 shadow-sm border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full max-w-full overflow-hidden">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-rose-500 text-white shrink-0 tracking-wider shadow-xs">
            ADMISSION 2026-27
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-bold text-white leading-tight break-words">
              FST Undergraduate Admission Circular (Spring 2027)
            </h3>
            <p className="text-[10px] sm:text-[11px] text-blue-200/90 leading-snug mt-0.5 break-words">
              B.Sc. in ICT, CSE & ES • Written Test: 16 Jan 2027 • Application Deadline: 20 Dec 2026
            </p>
          </div>
        </div>

        <a
          href="https://admission.bup.edu.bd"
          target="_blank"
          rel="noreferrer"
          className="btn-motion btn-bup-gold text-xs font-bold px-3.5 py-1.5 rounded-xl text-center whitespace-nowrap shrink-0 shadow-sm"
        >
          Apply via admission.bup.edu.bd ↗
        </a>
      </div>

      {/* Main Grid: Feed Stream (8 cols) + Right Widgets (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left / Center Feed Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* 1. Facebook-Style Create Post Card matching Reference Mockup */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-4.5 shadow-xs">
            <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="flex-1 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium py-2.5 px-4 rounded-full text-left transition-colors cursor-pointer"
              >
                What's on your mind, {user?.name?.split(' ')[0] || 'Tanjim'}?
              </button>
            </div>

            {/* Bottom Actions Row matching Reference Screenshot: Photo/Video, Tag People, Poll, More */}
            <div className="flex items-center justify-between pt-3 px-1 sm:px-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => {
                  setMediaFilter('IMAGE');
                  setCreateModalOpen(true);
                }}
                className="flex items-center gap-1.5 sm:gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 py-1.5 px-2.5 sm:px-3 rounded-xl transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4 text-rose-500" />
                <span>Photo/Video</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 py-1.5 px-2.5 sm:px-3 rounded-xl transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Tag People</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 py-1.5 px-2.5 sm:px-3 rounded-xl transition-colors cursor-pointer"
              >
                <BarChart2 className="w-4 h-4 text-purple-500" />
                <span>Poll</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 py-1.5 px-2.5 sm:px-3 rounded-xl transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4 text-blue-500" />
                <span>More</span>
              </button>
            </div>
          </div>

          {/* 2. Facebook-Style Campus Stories Tray matching Reference Mockup */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Stories</h3>
              <button
                onClick={() => {}}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                See All
              </button>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
              {stories.map((story) => {
                if (story.isCreate) {
                  const hasValidAvatar = user?.avatar && !user.avatar.includes('photo-1534528741775-53994a69daeb');
                  return (
                    <div
                      key={story.id}
                      onClick={() => setCreateModalOpen(true)}
                      className="w-24 sm:w-28 h-36 sm:h-44 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col cursor-pointer shrink-0 group transition-transform hover:scale-[1.02]"
                    >
                      <div className="flex-1 bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 relative flex items-center justify-center overflow-hidden">
                        {hasValidAvatar ? (
                          <img
                            src={user.avatar}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-white/90">
                            <span className="text-base font-black text-amber-300">BUP</span>
                            <span className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold">Story</span>
                          </div>
                        )}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">
                          <Plus className="w-3.5 h-3.5 font-bold" />
                        </div>
                      </div>
                      <div className="h-8 pt-2.5 text-center bg-white dark:bg-slate-800">
                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Create Story</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={story.id}
                    onClick={() => setActiveStory(story)}
                    className="w-24 sm:w-28 h-36 sm:h-44 rounded-2xl relative overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-700 cursor-pointer shrink-0 group transition-transform hover:scale-[1.02]"
                  >
                    <img
                      src={story.preview}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

                    {/* Author Avatar Badge */}
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-full border-2 border-blue-500 overflow-hidden shadow-sm">
                      <img src={story.avatar} alt="" className="w-full h-full object-cover" />
                    </div>

                    {/* Author Name at Bottom */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-[10px] font-bold text-white drop-shadow truncate">{story.author}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Facebook-Style Media Filter Bar: All, Notes, Reels, Videos, Photos */}
          <div className="w-full max-w-full overflow-x-auto pb-1 text-xs scrollbar-none touch-pan-x">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
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
                    className={`btn-motion flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all border text-xs cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Community Space Filter */}
          <div className="w-full max-w-full overflow-x-auto pb-1 text-xs scrollbar-none touch-pan-x">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              {['All', 'Campus', 'Course', 'Department', 'Club'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-xl font-semibold transition-all shrink-0 text-xs cursor-pointer ${
                    selectedFilter === filter
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {filter === 'All' ? 'All Spaces' : `${filter}`}
                </button>
              ))}
            </div>
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
                    {/* Author Info & Verified Badges (Clickable -> Navigates to User Profile) */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        onClick={() => onViewProfile && onViewProfile(post.author)}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                        title={`View ${post.author?.name || 'user'}'s profile`}
                      >
                        <div className="w-10 h-10 rounded-2xl bg-bup-700 text-white font-black flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-105 group-hover:ring-2 group-hover:ring-bup-500 transition-all">
                          {post.author?.avatar ? (
                            <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            post.author?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-bup-600 dark:group-hover:text-bup-400 group-hover:underline underline-offset-2 transition-colors">
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
                          <p className="text-[10px] text-slate-400 group-hover:text-slate-500 transition-colors">
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

                        {/* User Requirement #1: Edit & Delete Own Post Buttons */}
                        {(post.author?.userId === user?.id ||
                          post.author?.id === user?.id ||
                          post.author?.name === user?.name ||
                          post.authorName === user?.name ||
                          user?.role === 'faculty' ||
                          user?.role === 'admin') && (
                          <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => setEditingPost(post)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-bup-600 dark:hover:text-bup-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit this post"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post._id || post.id)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete this post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title & Content */}
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                      {post.content}
                    </p>

                    {/* TechTalk Banner matching Reference Mockup */}
                    {post.isTechTalkBanner ? (
                      <div className="mb-4 rounded-2xl overflow-hidden relative shadow-md bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 text-white p-5 border border-slate-800">
                        <div className="relative z-10 space-y-2.5">
                          <div>
                            <p className="text-lg sm:text-xl font-black tracking-tight text-white">TechTalk:</p>
                            <p className="text-xl sm:text-2xl font-black tracking-tight text-emerald-400">The Future of AI</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-2 border-t border-white/10">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span>Oct 28, 2026</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>3:00 PM</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-amber-400" />
                              <span>BUP Auditorium</span>
                            </span>
                          </div>
                        </div>
                        {/* Background University Vista */}
                        <img
                          src={post.imageUrl}
                          alt="TechTalk AI"
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                      </div>
                    ) : null}

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
                    {!post.isTechTalkBanner && !isNote && !isReel && !isVideo && (post.imageUrl || post.mediaUrl) && (
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

                    {/* Engagement Counts Row matching Reference Mockup: Emojis + 124, 12 comments, 8 shares */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center -space-x-1">
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center shadow-xs">
                            👍
                          </span>
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center shadow-xs">
                            ❤️
                          </span>
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center shadow-xs">
                            😮
                          </span>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">
                          {post.likesCount || post.likes?.length || 124}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span>{post.commentsCount || post.comments?.length || 12} comments</span>
                        <span>•</span>
                        <span>{post.sharesCount || 8} shares</span>
                      </div>
                    </div>

                    {/* Like, Comment, Share & Save Bar matching Reference Mockup */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 relative">
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

                      {/* 1. Like Button */}
                      <button
                        onMouseEnter={() => setActiveReactionPostId(post._id)}
                        onClick={() => handleSelectReaction(post._id, 'like')}
                        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                          selectedReaction
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : hasLiked
                            ? 'text-rose-600'
                            : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
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
                        <span>Like</span>
                      </button>

                      {/* 2. Comment Button */}
                      <button
                        onClick={() => {
                          const input = document.getElementById(`comment-input-${post._id}`);
                          if (input) input.focus();
                        }}
                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Comment</span>
                      </button>

                      {/* 3. Share Button */}
                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Post link copied to clipboard!');
                          }
                        }}
                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>

                      {/* 4. Save Button */}
                      <button
                        onClick={() => alert('Post saved to your bookmarks!')}
                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600"
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>Save</span>
                      </button>
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
                                  <div
                                    onClick={() =>
                                      onViewProfile &&
                                      onViewProfile({
                                        name: comment.authorName,
                                        id: comment.authorId,
                                        role: comment.authorRole,
                                      })
                                    }
                                    className="w-6 h-6 rounded-lg bg-bup-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 cursor-pointer hover:ring-2 hover:ring-bup-500"
                                  >
                                    {comment.authorName?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        onClick={() =>
                                          onViewProfile &&
                                          onViewProfile({
                                            name: comment.authorName,
                                            id: comment.authorId,
                                            role: comment.authorRole,
                                          })
                                        }
                                        className="font-bold text-[11px] text-slate-900 dark:text-white cursor-pointer hover:text-bup-600 dark:hover:text-bup-400 hover:underline"
                                      >
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

        {/* Right: Widgets Sidebar matching Reference Screenshot (Upcoming Classes & Faculty Notices) */}
        <div className="hidden lg:block lg:col-span-4 space-y-4 sticky top-16 sm:top-20 self-start">
          {/* 1. Upcoming Classes Widget matching Reference Screenshot */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Upcoming Classes</h3>
              <button
                onClick={() => (onNavigateTab ? onNavigateTab('routines') : null)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                See All
              </button>
            </div>

            <div className="space-y-3">
              {/* Class 1: Data Structures */}
              <div
                onClick={() => (onNavigateTab ? onNavigateTab('routines') : null)}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">Data Structures</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">CSE-201 • Section A</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Today, 10:00 AM – 12:00 PM</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Room: 404</span>
                  </p>
                </div>
              </div>

              {/* Class 2: Discrete Mathematics */}
              <div
                onClick={() => (onNavigateTab ? onNavigateTab('routines') : null)}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">Discrete Mathematics</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">CSE-203 • Section A</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Today, 1:00 PM – 3:00 PM</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Room: 301</span>
                  </p>
                </div>
              </div>

              {/* Class 3: Web Technologies */}
              <div
                onClick={() => (onNavigateTab ? onNavigateTab('routines') : null)}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">Web Technologies</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">CSE-205 • Section A</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Tomorrow, 10:00 AM – 12:00 PM</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Room: 502</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Faculty Notices Widget matching Reference Screenshot */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Faculty Notices</h3>
              <button
                onClick={() => (onNavigateTab ? onNavigateTab('notices') : null)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                See All
              </button>
            </div>

            <div className="space-y-3">
              {/* Notice 1: Class Schedule Update */}
              <div
                onClick={() => (onNavigateTab ? onNavigateTab('notices') : null)}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">Class Schedule Update</h4>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-rose-500 text-white uppercase tracking-wider">
                      New
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">By Dr. Fairoz Ahmed • CSE Department</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">2 hours ago</p>
                </div>
              </div>

              {/* Notice 2: Midterm Exam Routine */}
              <div
                onClick={() => (onNavigateTab ? onNavigateTab('notices') : null)}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    Midterm Exam Routine & Hall Allotment
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">By Dean's Office, FST</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Yesterday</p>
                </div>
              </div>

              {/* Notice 3: 3.1 & 3.2 Notes Published */}
              <div
                onClick={() => (onNavigateTab ? onNavigateTab('notes') : null)}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    3.1 & 3.2 Academic Notes Published
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">By Suman Saha • Dept of ICT</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">2 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. BUP-GO Campus RideShare Fast Launcher */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 text-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
              <span className="flex items-center gap-1.5">
                <Car className="w-4 h-4 text-white" />
                <span>BUP-GO RideShare Partner</span>
              </span>
              <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full font-extrabold uppercase">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-emerald-50 leading-relaxed">
              Find verified fellow BUPian ride sharing to Mirpur-12, Uttara, Dhanmondi, and Mohakhali.
            </p>
            <a
              href="https://bup-go-project-8njl.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 block w-full py-2 px-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs text-center shadow-xs transition-all"
            >
              🚗 Open BUP-GO Partner
            </a>
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

      {/* Edit Post Modal (User Requirement #1: Edit Own Posts) */}
      <EditPostModal
        isOpen={!!editingPost}
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
};
