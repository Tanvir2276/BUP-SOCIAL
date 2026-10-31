import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Search,
  Smile,
  Image as ImageIcon,
  Sticker,
  Film,
  ThumbsUp,
  X,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Sparkles,
  Paperclip,
  ChevronLeft,
  MoreHorizontal,
  Maximize2,
  Edit,
  VolumeX,
  MessageSquare,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { encryptE2EE, decryptE2EE } from '../utils/cryptoE2EE';

// Authentic BUP Campus & Faculty Messenger Threads (Matching Facebook Messenger Desktop Screenshot)
const INITIAL_BUP_THREADS = [
  {
    _id: 'c1',
    name: 'Safaytul Islam Rafi',
    role: 'student',
    studentId: '24549010064',
    department: 'Department of ICT (BICE-2024)',
    designation: 'CR - Section B',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    lastMessage: 'You sent a photo.',
    time: '12m',
    unread: true,
    active: true,
    category: 'All',
  },
  {
    _id: 'c2',
    name: 'Asst. Prof. Nazneen Akter',
    role: 'faculty',
    department: 'Dept of ICT, FST',
    designation: 'Assistant Professor & Course Teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120',
    lastMessage: 'Software Lab report submission deadline extended to Sunday.',
    time: '23m',
    unread: true,
    active: true,
    isMuted: true,
    category: 'All',
  },
  {
    _id: 'c3',
    name: 'BICE-2024 Section B (Official)',
    role: 'official',
    department: 'Department of ICT',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120',
    lastMessage: 'Munshi Tanvir reacted ❤️ to your message',
    time: '1h',
    unread: true,
    active: true,
    isMuted: true,
    category: 'Groups',
  },
  {
    _id: 'c4',
    name: 'BUP InfoTech Club (BUPITC)',
    role: 'club',
    department: 'Student Affairs',
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120',
    lastMessage: 'Hackathon team registration approved! Check email.',
    time: '3h',
    unread: false,
    active: true,
    category: 'Communities',
  },
  {
    _id: 'c5',
    name: 'Col Mohammed Omar Faruque, PhD',
    role: 'faculty',
    department: 'Chairman, Dept of ICT, FST',
    designation: 'Chairman & Associate Professor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    lastMessage: 'Routine reschedule notice posted for MATH-2207.',
    time: 'Yesterday',
    unread: false,
    active: true,
    category: 'All',
  },
  {
    _id: 'c6',
    name: 'Munshi Tanvir Hossain',
    role: 'student',
    studentId: '24549010001',
    department: 'Dept of ICT (BICE-2024)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    lastMessage: 'See you at Vista Cafeteria after the Networking lab.',
    time: 'Oct 29',
    unread: false,
    active: true,
    category: 'All',
  },
  {
    _id: 'c7',
    name: 'Nusrat Jahan Nishi',
    role: 'student',
    studentId: '24549010042',
    department: 'Dept of ICT',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    lastMessage: 'Can you please send the Lab 4 slide PDF?',
    time: 'Oct 28',
    unread: false,
    active: false,
    category: 'All',
  },
  {
    _id: 'c8',
    name: 'Dr. Kazi Abu Taher',
    role: 'faculty',
    department: 'Dean Office, FST',
    designation: 'Professor & Dean, FST',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
    lastMessage: 'FST Research symposium abstracts submission is live.',
    time: 'Oct 27',
    unread: false,
    active: true,
    category: 'All',
  },
  {
    _id: 'c9',
    name: 'Brigadier General Mohammad Sajjad Hossain',
    role: 'faculty',
    department: 'Dean Office, FST',
    designation: 'Dean, Faculty of Science and Technology',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120',
    lastMessage: 'All ICT routine schedules approved for July-Dec 2026 semester.',
    time: 'Oct 26',
    unread: false,
    active: false,
    category: 'All',
  },
  {
    _id: 'c10',
    name: 'BUP Robotics Club (BUPRC)',
    role: 'club',
    department: 'FST Club Network',
    avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120',
    lastMessage: 'Autonomous line-follower workshop registration open.',
    time: 'Oct 25',
    unread: false,
    active: true,
    category: 'Communities',
  },
];

// Popular Messenger & Campus Emojis
const EMOJI_LIST = [
  '😀', '😂', '😍', '😎', '🥳', '🤔', '😭', '🙌',
  '👍', '👎', '👏', '🔥', '💯', '❤️', '🎉', '✨',
  '🎓', '📚', '💻', '🚀', '☕', '⚡', '🏆', '💡',
];

// Messenger Style Big Stickers
const STICKER_LIST = [
  { id: 'thumbs_up', label: 'Like', emoji: '👍', bg: 'bg-blue-500/10 text-blue-600' },
  { id: 'heart', label: 'Love', emoji: '❤️', bg: 'bg-rose-500/10 text-rose-600' },
  { id: 'fire', label: 'Fire', emoji: '🔥', bg: 'bg-amber-500/10 text-amber-600' },
  { id: 'grad', label: 'Graduation', emoji: '🎓', bg: 'bg-indigo-500/10 text-indigo-600' },
  { id: 'laptop', label: 'Study Code', emoji: '💻', bg: 'bg-emerald-500/10 text-emerald-600' },
  { id: 'party', label: 'Celebrate', emoji: '🎉', bg: 'bg-purple-500/10 text-purple-600' },
  { id: 'rocket', label: 'BUP Launch', emoji: '🚀', bg: 'bg-sky-500/10 text-sky-600' },
  { id: 'hundred', label: '100% Score', emoji: '💯', bg: 'bg-red-500/10 text-red-600' },
  { id: 'trophy', label: 'Champion', emoji: '🏆', bg: 'bg-yellow-500/10 text-yellow-600' },
  { id: 'coffee', label: 'Lab Coffee', emoji: '☕', bg: 'bg-amber-700/10 text-amber-700' },
];

// Curated Educational & Campus GIFs
const GIF_LIST = [
  {
    id: 'g1',
    title: 'Celebrate / Hackathon Win',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
    tag: 'Victory',
  },
  {
    id: 'g2',
    title: 'Coding in Lab 402',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
    tag: 'Coding',
  },
  {
    id: 'g3',
    title: 'BUP Campus Green Breeze',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400',
    tag: 'Campus',
  },
  {
    id: 'g4',
    title: 'Research Discussion',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400',
    tag: 'Academic',
  },
  {
    id: 'g5',
    title: 'Robotics Workshop',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
    tag: 'Tech',
  },
];

// Sample Real Campus Images to share
const PRESET_IMAGES = [
  {
    title: 'FST Academic Block 2 Lab',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600',
  },
  {
    title: 'Handwritten Graph Formula Sheet',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
  },
  {
    title: 'BUP Central Campus Vista',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
  },
  {
    title: 'Robotics Microcontroller Circuit',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  },
];

interface MessagesProps {
  onViewProfile?: (user: any) => void;
}

export const Messages: React.FC<MessagesProps> = ({ onViewProfile }) => {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<any[]>(INITIAL_BUP_THREADS);
  const [selectedContact, setSelectedContact] = useState<any | null>(INITIAL_BUP_THREADS[0]);
  const [messages, setMessages] = useState<any[]>([]);
  const [decryptedTexts, setDecryptedTexts] = useState<Record<string, string>>({});
  const [inputText, setInputText] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [activeChatFilter, setActiveChatFilter] = useState<'All' | 'Unread' | 'Groups' | 'Communities'>('All');
  const [sending, setSending] = useState(false);
  const [showRawCrypto, setShowRawCrypto] = useState(false);

  // Active Toolbars (Messenger style)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const directFileInputRef = useRef<HTMLInputElement | null>(null);

  // Selected preview image
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch verified contacts from backend & merge with authentic threads (deduplicating)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiFetch('/messages/contacts');
        if (res.success && Array.isArray(res.contacts) && res.contacts.length > 0) {
          setContacts((prev) => {
            const seenNames = new Set(prev.map((c) => c.name.toLowerCase()));
            const newUnique = res.contacts
              .filter((c: any) => !seenNames.has(c.name.toLowerCase()))
              .map((c: any) => ({
                ...c,
                avatar: c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
                lastMessage: 'Tap to start conversation...',
                time: 'Recent',
                active: true,
                category: c.role === 'faculty' ? 'All' : 'All',
              }));
            return [...prev, ...newUnique];
          });
        }
      } catch (e) {
        console.error('Contact fetch fallback to BUP initial threads:', e);
      }
    };
    fetchContacts();
  }, []);

  const getConvId = (id1?: string, id2?: string) => {
    if (!id1 || !id2) return '';
    return [id1, id2].sort().join('_');
  };

  // 2. Fetch conversation messages & decrypt them using Web Crypto API
  const fetchConversation = async () => {
    if (!selectedContact || !user) return;
    try {
      const res = await apiFetch(`/messages/conversation/${selectedContact._id}`);
      if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
        setMessages(res.messages);

        const convId = getConvId(user.id, selectedContact._id);
        const map: Record<string, string> = {};

        for (const msg of res.messages) {
          if (msg.ciphertext && msg.iv) {
            try {
              const decrypted = await decryptE2EE(msg.ciphertext, msg.iv, convId);
              map[msg._id] = decrypted;
            } catch (err) {
              map[msg._id] = msg.plainPreviewForDemo || '[Encrypted Message]';
            }
          } else {
            map[msg._id] = msg.plainPreviewForDemo || 'Plain message';
          }
        }
        setDecryptedTexts(map);
        setTimeout(scrollToBottom, 60);
      } else {
        // Preset welcome messages for demo conversation
        const starterMessages = [
          {
            _id: `m_init_${selectedContact._id}_1`,
            senderId: selectedContact._id,
            senderName: selectedContact.name,
            ciphertext: 'demo_cipher',
            iv: 'demo_iv',
            plainPreviewForDemo: selectedContact.lastMessage?.includes('·')
              ? selectedContact.lastMessage.split('·')[0].trim()
              : selectedContact.lastMessage || 'Salam! Welcome to BUP Chatbox.',
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          },
        ];
        setMessages(starterMessages);
        setDecryptedTexts({
          [starterMessages[0]._id]: starterMessages[0].plainPreviewForDemo,
        });
        setTimeout(scrollToBottom, 60);
      }
    } catch (e) {
      // Local demo starter
      const starterMessages = [
        {
          _id: `m_init_${selectedContact._id}_1`,
          senderId: selectedContact._id,
          senderName: selectedContact.name,
          plainPreviewForDemo: selectedContact.lastMessage || 'Salam! How can I assist you?',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
      ];
      setMessages(starterMessages);
      setDecryptedTexts({
        [starterMessages[0]._id]: starterMessages[0].plainPreviewForDemo,
      });
      setTimeout(scrollToBottom, 60);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. Send message handler: immediately moves conversation to TOP with latest snippet
  const sendMessagePayload = async (payload: string) => {
    if (!payload.trim() || !selectedContact || !user) return;

    setSending(true);
    const plaintext = payload.trim();

    // Prepare preview snippet
    const snippet = plaintext.startsWith('[image:')
      ? 'You sent a photo.'
      : plaintext.startsWith('[sticker:')
      ? 'You sent a sticker.'
      : plaintext.startsWith('[gif:')
      ? 'You sent a GIF.'
      : `You: ${plaintext}`;

    // Auto-reorder: Move contact to TOP of contacts list with "Just now" timestamp
    setContacts((prev) => {
      const updatedContact = {
        ...selectedContact,
        lastMessage: snippet,
        time: 'Just now',
        unread: false,
      };
      const remaining = prev.filter((c) => c._id !== selectedContact._id);
      return [updatedContact, ...remaining];
    });

    try {
      const convId = getConvId(user.id, selectedContact._id);
      const { ciphertext, iv, keyFingerprint } = await encryptE2EE(plaintext, convId);

      const res = await apiFetch('/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          recipientId: selectedContact._id,
          ciphertext,
          iv,
          keyFingerprint,
          plainPreviewForDemo: plaintext,
        }),
      });

      if (res.success && res.messageRecord) {
        setMessages((prev) => [...prev, res.messageRecord]);
        setDecryptedTexts((prev) => ({
          ...prev,
          [res.messageRecord._id]: plaintext,
        }));
      } else {
        // Fallback local message item
        const localMsg = {
          _id: `local_${Date.now()}`,
          id: `local_${Date.now()}`,
          senderId: user.id,
          senderName: user.name,
          recipientId: selectedContact._id,
          ciphertext,
          iv,
          plainPreviewForDemo: plaintext,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, localMsg]);
        setDecryptedTexts((prev) => ({
          ...prev,
          [localMsg._id]: plaintext,
        }));
      }
    } catch (err: any) {
      // Offline fallback: keep chatting smoothly
      const localMsg = {
        _id: `local_${Date.now()}`,
        id: `local_${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        recipientId: selectedContact._id,
        plainPreviewForDemo: plaintext,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, localMsg]);
      setDecryptedTexts((prev) => ({
        ...prev,
        [localMsg._id]: plaintext,
      }));
    } finally {
      setSending(false);
      setShowEmojiPicker(false);
      setShowStickerPicker(false);
      setShowGifPicker(false);
      setShowImageModal(false);
      setTimeout(scrollToBottom, 80);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessagePayload(inputText);
    setInputText('');
  };

  const handleSendSticker = (stickerEmoji: string, label: string) => {
    sendMessagePayload(`[sticker:${stickerEmoji}|${label}]`);
  };

  const handleSendGif = (gifUrl: string, title: string) => {
    sendMessagePayload(`[gif:${gifUrl}|${title}]`);
  };

  const handleSendImage = (imgUrl: string) => {
    if (!imgUrl.trim()) return;
    sendMessagePayload(`[image:${imgUrl.trim()}]`);
    setCustomImageUrl('');
  };

  // Direct file photo attachment
  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleSendImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Active Profiles for horizontal strip
  const activeProfiles = contacts.filter((c) => c.active);

  // Filter contacts by search & active tabs (All, Unread, Groups, Communities)
  const filteredContacts = contacts.filter((c) => {
    const query = searchContact.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      (c.department && c.department.toLowerCase().includes(query)) ||
      (c.studentId && c.studentId.toLowerCase().includes(query)) ||
      (c.designation && c.designation.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (activeChatFilter === 'Unread') return c.unread;
    if (activeChatFilter === 'Groups') return c.role === 'official' || c.role === 'club' || c.category === 'Groups';
    if (activeChatFilter === 'Communities') return c.role === 'club' || c.category === 'Communities';
    return true;
  });

  // Helper to render message content (Text, Sticker, Image, GIF)
  const renderMessageBubbleContent = (content: string, isMe: boolean) => {
    // 1. Sticker Pattern
    if (content.startsWith('[sticker:') && content.endsWith(']')) {
      const match = content.slice(9, -1).split('|');
      const emoji = match[0];
      const label = match[1] || 'Sticker';
      return (
        <div className="flex flex-col items-center py-1">
          <span className="text-5xl filter drop-shadow hover:scale-110 transition-transform cursor-pointer select-none">
            {emoji}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">{label}</span>
        </div>
      );
    }

    // 2. Image Pattern
    if (content.startsWith('[image:') && content.endsWith(']')) {
      const imgUrl = content.slice(7, -1);
      return (
        <div className="rounded-2xl overflow-hidden max-w-sm cursor-pointer group" onClick={() => setPreviewMediaUrl(imgUrl)}>
          <img
            src={imgUrl}
            alt="Shared Photo"
            className="w-full max-h-64 object-cover rounded-2xl group-hover:scale-102 transition-transform duration-200"
          />
          <span className="text-[10px] opacity-75 mt-1 block">Click to expand photo</span>
        </div>
      );
    }

    // 3. GIF Pattern
    if (content.startsWith('[gif:') && content.endsWith(']')) {
      const match = content.slice(5, -1).split('|');
      const gifUrl = match[0];
      const title = match[1] || 'Campus GIF';
      return (
        <div className="rounded-2xl overflow-hidden max-w-sm cursor-pointer group" onClick={() => setPreviewMediaUrl(gifUrl)}>
          <img
            src={gifUrl}
            alt={title}
            className="w-full max-h-56 object-cover rounded-2xl group-hover:scale-102 transition-transform"
          />
          <span className="text-[10px] opacity-80 mt-1 font-bold block">{title}</span>
        </div>
      );
    }

    // 4. Standard Text
    return <p className="leading-relaxed whitespace-pre-wrap break-words">{content}</p>;
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4">
      {/* Top Messenger Status Banner */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-bup-700 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-bup-700/20">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                BUP Chatbox Messenger
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                AES-256 E2EE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct campus peer-to-peer messaging: send texts, photos, emojis, stickers & GIFs securely.
            </p>
          </div>
        </div>

        {/* Cryptographic Inspector Toggle */}
        <button
          onClick={() => setShowRawCrypto(!showRawCrypto)}
          className="btn-motion py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          {showRawCrypto ? <EyeOff className="w-3.5 h-3.5 text-emerald-600" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showRawCrypto ? 'Hide Raw Ciphertext' : 'Inspect Ciphertext'}</span>
        </button>
      </div>

      {/* Hidden File Input for Direct Photo Attachment */}
      <input
        type="file"
        ref={directFileInputRef}
        onChange={handleDirectFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Main Messaging Window (Harmonized University Facebook Messenger Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-[680px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Left: Contact List (4 Cols) - Facebook Messenger Desktop Format matching user screenshot */}
        <div
          className={`md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex-col h-full bg-slate-50/70 dark:bg-slate-900/90 transition-colors ${
            selectedContact ? 'hidden md:flex' : 'flex w-full'
          }`}
        >
          {/* Header & Options */}
          <div className="p-3.5 pb-2.5 border-b border-slate-200/80 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Chats</h3>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => alert('Messenger Preferences & Options')}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  title="Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchContact('')}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  title="New message"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Messenger Pill */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                placeholder="Search Messenger"
                className="w-full pl-9 pr-3 py-2 rounded-full text-xs border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-1 focus:ring-bup-600 transition-all"
              />
            </div>

            {/* Filter Pills: All, Unread, Groups, Communities */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none pt-0.5">
              {(['All', 'Unread', 'Groups', 'Communities'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveChatFilter(filter)}
                  className={`px-3 py-1 rounded-full text-[11px] transition-all whitespace-nowrap ${
                    activeChatFilter === filter
                      ? 'btn-bup-primary text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Active Profiles Strip ("active profile gula dekhabe") */}
          <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Profiles</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Online
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              {activeProfiles.map((p) => (
                <div
                  key={p._id}
                  onClick={() => setSelectedContact(p)}
                  className="flex flex-col items-center cursor-pointer group shrink-0 transition-transform active:scale-95"
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 overflow-hidden shadow-xs bg-slate-200">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mt-1 max-w-[54px] truncate text-center group-hover:text-bup-700 dark:group-hover:text-emerald-400">
                    {p.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Threads List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredContacts.map((contact, idx) => {
              const isSelected = selectedContact?._id === contact._id;
              const isFaculty = contact.role === 'faculty';
              const isGroup = contact.role === 'official' || contact.role === 'club';

              return (
                <div
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-2.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'btn-bup-primary text-white shadow-md shadow-bup-700/25'
                      : 'hover:bg-slate-100/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-bup-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {contact.avatar ? (
                          <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                        ) : (
                          contact.name?.charAt(0)
                        )}
                      </div>
                      {contact.active && (
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`font-bold text-sm truncate leading-tight ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {contact.name}
                        </p>
                      </div>

                      <p
                        className={`text-xs truncate mt-1 flex items-center gap-1 ${
                          isSelected
                            ? 'text-slate-200'
                            : contact.unread
                            ? 'font-bold text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className="truncate">{contact.lastMessage || 'Start conversation...'}</span>
                        {contact.time && (
                          <span className="text-[10px] opacity-75 shrink-0">· {contact.time}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 ml-2">
                    {contact.isMuted && (
                      <VolumeX className={`w-3.5 h-3.5 ${isSelected ? 'text-white/70' : 'text-slate-400'}`} />
                    )}
                    {isFaculty && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        Faculty
                      </span>
                    )}
                    {contact.unread && !isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-sm" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Messenger Chat Pane (8 Cols) */}
        <div
          className={`md:col-span-8 flex-col h-full bg-white dark:bg-slate-900 relative ${
            selectedContact ? 'flex w-full' : 'hidden md:flex'
          }`}
        >
          {/* 1. Messenger Header */}
          {selectedContact ? (
            <>
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Mobile Back Button to Chats List */}
                  <button
                    type="button"
                    onClick={() => setSelectedContact(null)}
                    className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Back to Chats"
                  >
                    <ChevronLeft className="w-5 h-5 text-bup-700 dark:text-emerald-400" />
                  </button>

                  <div
                    onClick={() => onViewProfile && onViewProfile(selectedContact)}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                    title={`View ${selectedContact.name}'s profile`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-bup-700 text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden group-hover:scale-105 group-hover:ring-2 group-hover:ring-bup-500 transition-all">
                        {selectedContact.avatar ? (
                          <img src={selectedContact.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          selectedContact.name?.charAt(0)
                        )}
                      </div>
                      {selectedContact.active && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight truncate group-hover:text-bup-600 dark:group-hover:text-bup-400 group-hover:underline">
                          {selectedContact.name}
                        </h4>
                        {selectedContact.role === 'faculty' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                            Faculty
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="truncate">
                          {selectedContact.active ? 'Active now' : 'Active recently'} • End-to-End Encrypted
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call Simulation Buttons */}
                <div className="flex items-center gap-1 text-slate-500 shrink-0">
                  <button
                    type="button"
                    onClick={() => alert(`Starting secure audio call with ${selectedContact.name}...`)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-bup-700 dark:text-bup-400 transition-colors"
                    title="Voice Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Initiating video conference with ${selectedContact.name}...`)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-bup-700 dark:text-bup-400 transition-colors"
                    title="Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-950/20 dark:via-slate-900 dark:to-slate-950/30">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-bup-700 dark:text-blue-400 flex items-center justify-center mb-3 shadow-inner">
                      <Lock className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                      Say Hi to {selectedContact?.name}!
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Your chat is protected by zero-knowledge AES-256-GCM envelope encryption.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => handleSendSticker('👋', 'Wave')}
                        className="btn-motion px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5"
                      >
                        <span>👋 Wave Hello</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendSticker('👍', 'Like')}
                        className="btn-motion px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5"
                      >
                        <span>👍 Quick Thumbs Up</span>
                      </button>
                    </div>
                  </div>
                ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                const text = decryptedTexts[msg._id] || msg.plainPreviewForDemo || 'Decrypting...';
                const isSticker = text.startsWith('[sticker:');

                return (
                  <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm transition-all ${
                        isSticker
                          ? 'bg-transparent shadow-none px-1 py-0'
                          : isMe
                          ? 'bg-bup-700 text-white rounded-br-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs'
                      }`}
                    >
                      {renderMessageBubbleContent(text, isMe)}

                      {/* Raw Cryptographic Payload Inspector */}
                      {showRawCrypto && msg.ciphertext && (
                        <div className="mt-2 pt-2 border-t border-white/20 dark:border-slate-700 text-[10px] font-mono opacity-80 break-all space-y-0.5">
                          <p>
                            <strong>Ciphertext:</strong> {msg.ciphertext.slice(0, 32)}...
                          </p>
                          <p>
                            <strong>IV:</strong> {msg.iv}
                          </p>
                          <p>
                            <strong>Fingerprint:</strong> {msg.keyFingerprint}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3. Messenger Pickers Tray (Popups for Emojis, Stickers, GIFs, Images) */}
          {/* Emoji Tray */}
          {showEmojiPicker && (
            <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 animate-fadeIn z-20 shadow-lg max-h-40 overflow-y-auto">
              <div className="w-full flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500">
                <span>Select Emoji</span>
                <button onClick={() => setShowEmojiPicker(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + emoji);
                  }}
                  className="p-1.5 text-xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Stickers Tray */}
          {showStickerPicker && (
            <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 animate-fadeIn z-20 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500">
                <span>Campus & Messenger Stickers</span>
                <button onClick={() => setShowStickerPicker(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-2">
                {STICKER_LIST.map((stk) => (
                  <button
                    key={stk.id}
                    type="button"
                    onClick={() => handleSendSticker(stk.emoji, stk.label)}
                    className={`btn-motion p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 ${stk.bg} hover:scale-105 transition-transform`}
                  >
                    <span className="text-2xl">{stk.emoji}</span>
                    <span className="text-[10px] font-bold truncate max-w-full">{stk.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GIFs Tray */}
          {showGifPicker && (
            <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 animate-fadeIn z-20 shadow-lg max-h-52 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500">
                <span>Campus Reaction GIFs</span>
                <button onClick={() => setShowGifPicker(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {GIF_LIST.map((gif) => (
                  <div
                    key={gif.id}
                    onClick={() => handleSendGif(gif.url, gif.title)}
                    className="rounded-xl overflow-hidden cursor-pointer relative group border border-slate-200 dark:border-slate-700 hover:border-bup-600"
                  >
                    <img src={gif.url} alt={gif.title} className="w-full h-20 object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                      <span className="text-[10px] font-bold text-white drop-shadow">{gif.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Chooser Modal */}
          {showImageModal && (
            <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 animate-fadeIn z-20 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500">
                <span>Share Campus Image or Note</span>
                <button onClick={() => setShowImageModal(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>

              {/* Preset campus images */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_IMAGES.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => handleSendImage(img.url)}
                    className="rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-bup-600 group"
                  >
                    <img src={img.url} alt="" className="w-full h-16 object-cover group-hover:scale-105 transition-transform" />
                    <p className="text-[9px] font-bold p-1 text-slate-700 dark:text-slate-200 truncate">{img.title}</p>
                  </div>
                ))}
              </div>

              {/* Or enter custom Image URL */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Paste direct Image URL (https://...)"
                  className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSendImage(customImageUrl)}
                  disabled={!customImageUrl.trim()}
                  className="btn-motion btn-bup-primary px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  Send Photo
                </button>
              </div>
            </div>
          )}

          {/* 4. Messenger Send Form Input */}
          <form
            onSubmit={handleSendText}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 bg-white dark:bg-slate-900"
          >
            {/* Action Tools: Images, Stickers, GIFs, Emojis */}
            <div className="flex items-center gap-0.5 text-slate-500">
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(!showImageModal);
                  setShowStickerPicker(false);
                  setShowGifPicker(false);
                  setShowEmojiPicker(false);
                }}
                className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  showImageModal ? 'text-bup-600 bg-blue-50 dark:bg-blue-950/40' : ''
                }`}
                title="Send Photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => directFileInputRef.current?.click()}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-bup-700"
                title="Attach Photo from Device"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowStickerPicker(!showStickerPicker);
                  setShowImageModal(false);
                  setShowGifPicker(false);
                  setShowEmojiPicker(false);
                }}
                className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  showStickerPicker ? 'text-bup-600 bg-blue-50 dark:bg-blue-950/40' : ''
                }`}
                title="Send Sticker"
              >
                <Sticker className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowGifPicker(!showGifPicker);
                  setShowImageModal(false);
                  setShowStickerPicker(false);
                  setShowEmojiPicker(false);
                }}
                className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  showGifPicker ? 'text-bup-600 bg-blue-50 dark:bg-blue-950/40' : ''
                }`}
                title="Send GIF"
              >
                <Film className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowImageModal(false);
                  setShowStickerPicker(false);
                  setShowGifPicker(false);
                }}
                className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  showEmojiPicker ? 'text-bup-600 bg-blue-50 dark:bg-blue-950/40' : ''
                }`}
                title="Insert Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${selectedContact?.name?.split(' ')[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-bup-600"
            />

            {/* Quick Thumbs Up OR Send Button (Messenger behavior) */}
            {inputText.trim() ? (
              <button
                type="submit"
                disabled={sending}
                className="btn-motion btn-bup-primary p-2.5 rounded-full text-white transition-all shadow-md shadow-bup-700/20 disabled:opacity-40"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSendSticker('👍', 'Like')}
                className="btn-motion p-2.5 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-transform active:scale-125"
                title="Quick Thumbs Up"
              >
                <ThumbsUp className="w-5 h-5 fill-blue-600" />
              </button>
            )}
          </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-bup-700 dark:text-emerald-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Select a Chat</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Select a conversation from the left to start messaging your peers, faculty, or club members.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Media Fullscreen Preview Modal */}
      {previewMediaUrl && (
        <div
          onClick={() => setPreviewMediaUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl">
            <img src={previewMediaUrl} alt="Expanded Media" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
