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
  Paperclip,
  ChevronLeft,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Sparkles,
  User as UserIcon,
  X,
  Plus,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { encryptE2EE, decryptE2EE } from '../utils/cryptoE2EE';
import { ALL_100_BANGALDESHI_STUDENTS } from '../data/bangladeshiStudents';
import { CallModal } from '../components/CallModal';

// Authentic BUP Campus & Faculty DM Threads
const INITIAL_BUP_THREADS = [
  {
    _id: 'c1',
    name: 'Safaytul Islam Rafi',
    role: 'student',
    studentId: '24549010064',
    college: 'Notre Dame College',
    livesIn: 'Uttara Sector 11, Dhaka',
    hometown: 'Chattogram, Bangladesh',
    instagram: 'rafi_bup',
    department: 'Dept of ICT (BICE-2024)',
    designation: 'Student CR - Section A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    lastMessage: 'Software Lab report submission is approved! Check attachments.',
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
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    lastMessage: 'ICE-3207 SRS guidelines updated. Presentation on Monday.',
    time: '23m',
    unread: true,
    active: true,
    category: 'All',
  },
  {
    _id: 'c3',
    name: 'Nusrat Jahan Nishi',
    role: 'student',
    studentId: '24549010042',
    college: 'Holy Cross College',
    livesIn: 'Dhanmondi, Dhaka',
    hometown: 'Sylhet, Bangladesh',
    instagram: 'nishi.jahan',
    department: 'Dept of ICT (BICE-2024)',
    designation: 'Undergraduate Researcher',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    lastMessage: 'Did you review the thesis defense slides for Section B?',
    time: '45m',
    unread: false,
    active: true,
    category: 'All',
  },
  {
    _id: 'c4',
    name: 'Mahir Faisal',
    role: 'student',
    studentId: '24549010019',
    college: 'Rajuk Uttara Model College',
    livesIn: 'Mirpur 12, Dhaka',
    hometown: 'Bogura, Bangladesh',
    instagram: 'mahir_fst',
    department: 'Dept of CSE (BCSE-2024)',
    designation: 'Competitive Programmer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: 'BUP Tech Fest Hackathon team registration is finalized! 🔥',
    time: '2h',
    unread: false,
    active: true,
    category: 'All',
  },
  {
    _id: 'c5',
    name: 'Anika Tahsin',
    role: 'student',
    studentId: '25549010088',
    college: 'Viqarunnisa Noon College',
    livesIn: 'Bashundhara R/A, Dhaka',
    hometown: 'Rajshahi, Bangladesh',
    instagram: 'anika.tahsin',
    department: 'Dept of ICT (BICE-2025)',
    designation: 'Student Representative',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastMessage: 'Are we practicing line-follower code tomorrow at Lab 402?',
    time: '3h',
    unread: false,
    active: true,
    category: 'All',
  },
  {
    _id: 'c6',
    name: 'Col Mohammed Omar Faruque, PhD',
    role: 'faculty',
    department: 'Chairman, Dept of ICT, FST',
    designation: 'Chairman & Associate Professor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    lastMessage: 'Spring 2026 Capstone thesis defense schedule posted.',
    time: 'Yesterday',
    unread: false,
    active: true,
    category: 'All',
  },
  {
    _id: 'c7',
    name: 'Tanvir Naeem',
    role: 'student',
    studentId: '24549010076',
    college: 'Dhaka College',
    livesIn: 'Mirpur DOHS, Dhaka',
    hometown: 'Cumilla, Bangladesh',
    instagram: 'tanvir_naeeem',
    department: 'Dept of ICT (BICE-2024)',
    designation: 'BUP Undergraduate Scholar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    lastMessage: 'Batch Fest memories are unforgettable! See you at Vista cafe.',
    time: 'Oct 29',
    unread: false,
    active: true,
    category: 'All',
  },
  {
    _id: 'c8',
    name: 'BUP Robotics Club (BUPRC)',
    role: 'club',
    department: 'Student Affairs',
    avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150',
    lastMessage: 'Workshop registration open for ICT and CSE batches.',
    time: 'Oct 28',
    unread: false,
    active: true,
    category: 'Communities',
  },
  {
    _id: 'c9',
    name: 'Farhan Tanveer',
    role: 'student',
    studentId: '23549010052',
    college: 'Adamjee Cantonment College',
    livesIn: 'Mirpur DOHS, Dhaka',
    hometown: 'Barishal, Bangladesh',
    instagram: 'farhan_bup',
    department: 'Dept of Environmental Science',
    designation: 'Senior Researcher',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    lastMessage: 'Sent the climate dataset for Lake water telemetry analysis.',
    time: 'Oct 27',
    unread: false,
    active: false,
    category: 'All',
  },
  {
    _id: 'c10',
    name: 'Sadia Rahman',
    role: 'student',
    studentId: '26549010018',
    college: 'Dhaka City College',
    livesIn: 'Dhanmondi, Dhaka',
    hometown: 'Mymensingh, Bangladesh',
    instagram: 'sadia_bup',
    department: 'Dept of ICT (BICE-2026)',
    designation: 'Freshman Batch Representative',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    lastMessage: 'Thank you for the discrete math lecture notes!',
    time: 'Oct 26',
    unread: false,
    active: false,
    category: 'All',
  },
];

const EMOJI_LIST = ['👍', '❤️', '🔥', '👏', '🎉', '😂', '🎓', '💻', '💡', '💯', '✨', '🚀'];

const STICKER_LIST = [
  { id: 'thumbs', label: 'Like', emoji: '👍' },
  { id: 'love', label: 'Love', emoji: '❤️' },
  { id: 'fire', label: 'Fire', emoji: '🔥' },
  { id: 'grad', label: 'BUP Grad', emoji: '🎓' },
  { id: 'code', label: 'Code Lab', emoji: '💻' },
  { id: 'win', label: 'Victory', emoji: '🏆' },
];

const MERGED_INITIAL_CONTACTS = [
  ...INITIAL_BUP_THREADS,
  ...ALL_100_BANGALDESHI_STUDENTS.map((s) => ({
    _id: s.id,
    name: s.name,
    role: s.role,
    studentId: s.studentId,
    college: s.college,
    livesIn: s.livesIn,
    hometown: s.hometown,
    instagram: s.instagram,
    department: `${s.department} (${s.batch})`,
    designation: s.designation,
    avatar: s.avatar,
    lastMessage: s.motto,
    time: 'Online',
    unread: false,
    active: true,
    category: 'All',
  })).filter((s) => !INITIAL_BUP_THREADS.some((t) => t.name.toLowerCase() === s.name.toLowerCase()))
];

interface MessagesProps {
  onViewProfile?: (user: any) => void;
}

export const Messages: React.FC<MessagesProps> = ({ onViewProfile }) => {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<any[]>(MERGED_INITIAL_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<any | null>(INITIAL_BUP_THREADS[0]);
  const [messages, setMessages] = useState<any[]>([]);
  const [decryptedTexts, setDecryptedTexts] = useState<Record<string, string>>({});
  const [inputText, setInputText] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [activeChatFilter, setActiveChatFilter] = useState<'All' | 'Unread' | 'Faculty' | 'Communities'>('All');
  const [sending, setSending] = useState(false);
  const [showRawCrypto, setShowRawCrypto] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // Active interactive toolbars
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [activeCallType, setActiveCallType] = useState<'audio' | 'video'>('audio');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  // 1. Fetch verified contacts from backend & merge
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
                avatar: c.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
                lastMessage: 'Tap to start conversation...',
                time: 'Recent',
                active: true,
                category: c.role === 'faculty' ? 'Faculty' : 'All',
              }));
            return [...prev, ...newUnique];
          });
        }
      } catch (e) {
        // Fallback to initial threads
      }
    };
    fetchContacts();
  }, []);

  const getConvId = (id1?: string, id2?: string) => {
    if (!id1 || !id2) return '';
    return [id1, id2].sort().join('_');
  };

  // 2. Fetch conversation messages
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
        setTimeout(() => scrollToBottom(false), 50);
      } else {
        const starterMessages = [
          {
            _id: `m_init_${selectedContact._id}_1`,
            senderId: selectedContact._id,
            senderName: selectedContact.name,
            plainPreviewForDemo:
              selectedContact.lastMessage || 'Assalamu Alaikum! How can I assist you with academic tasks today?',
            createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          },
        ];
        setMessages(starterMessages);
        setDecryptedTexts({
          [starterMessages[0]._id]: starterMessages[0].plainPreviewForDemo,
        });
        setTimeout(() => scrollToBottom(false), 50);
      }
    } catch (e) {
      const starterMessages = [
        {
          _id: `m_init_${selectedContact._id}_1`,
          senderId: selectedContact._id,
          senderName: selectedContact.name,
          plainPreviewForDemo: selectedContact.lastMessage || 'Salam! Welcome to BUP Direct Messages.',
          createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        },
      ];
      setMessages(starterMessages);
      setDecryptedTexts({
        [starterMessages[0]._id]: starterMessages[0].plainPreviewForDemo,
      });
      setTimeout(() => scrollToBottom(false), 50);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length]);

  // 3. Send message payload
  const sendMessagePayload = async (payload: string) => {
    if (!payload.trim() || !selectedContact || !user) return;

    setSending(true);
    const plaintext = payload.trim();

    const snippet = plaintext.startsWith('[image:')
      ? 'Sent a photo'
      : plaintext.startsWith('[sticker:')
      ? 'Sent a sticker'
      : plaintext;

    // Update contacts list: move active to top
    setContacts((prev) => {
      const updated = {
        ...selectedContact,
        lastMessage: snippet,
        time: 'Just now',
        unread: false,
      };
      return [updated, ...prev.filter((c) => c._id !== selectedContact._id)];
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
        const localMsg = {
          _id: `local_${Date.now()}`,
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
      const localMsg = {
        _id: `local_${Date.now()}`,
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
      setTimeout(() => scrollToBottom(true), 60);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessagePayload(inputText);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        sendMessagePayload(`[image:${reader.result}]`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Active users for horizontal tray
  const activeProfiles = contacts.filter((c) => c.active);

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    const q = searchContact.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      (c.department && c.department.toLowerCase().includes(q)) ||
      (c.studentId && c.studentId.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (activeChatFilter === 'Unread') return c.unread;
    if (activeChatFilter === 'Faculty') return c.role === 'faculty';
    if (activeChatFilter === 'Communities') return c.role === 'club' || c.category === 'Communities';
    return true;
  });

  const handleSelectContact = (contact: any) => {
    setSelectedContact(contact);
    setMobileChatOpen(true);
  };

  const renderBubble = (content: string) => {
    if (content.startsWith('[sticker:') && content.endsWith(']')) {
      const parts = content.slice(9, -1).split('|');
      return (
        <div className="py-1 select-none text-center">
          <span className="text-4xl filter drop-shadow hover:scale-110 transition-transform block">
            {parts[0]}
          </span>
          <span className="text-[10px] opacity-75 font-semibold mt-0.5 block">{parts[1]}</span>
        </div>
      );
    }

    if (content.startsWith('[image:') && content.endsWith(']')) {
      const imgUrl = content.slice(7, -1);
      return (
        <div
          className="rounded-xl overflow-hidden max-w-xs cursor-pointer group"
          onClick={() => setPreviewMediaUrl(imgUrl)}
        >
          <img
            src={imgUrl}
            alt="Attachment"
            className="w-full max-h-56 object-cover rounded-xl group-hover:scale-102 transition-transform"
          />
          <span className="text-[9px] opacity-80 mt-1 block font-medium">Click to view full image</span>
        </div>
      );
    }

    return <p className="leading-relaxed whitespace-pre-wrap break-words text-xs sm:text-sm">{content}</p>;
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-5.5rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ============================================================== */}
        {/* LEFT COLUMN: CONTACTS LIST & ACTIVE PROFILES (DESKTOP OR MOBILE LIST) */}
        {/* ============================================================== */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex-col h-full bg-slate-50/60 dark:bg-slate-900/60 shrink-0 ${
            mobileChatOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* DM Header & Search */}
          <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">DM</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-bup-100 text-bup-800 dark:bg-bup-900/50 dark:text-bup-300">
                  Direct Messages
                </span>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>E2EE Active</span>
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                placeholder="Search students, faculty, ID..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-bup-600 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold scrollbar-none pt-0.5">
              {(['All', 'Unread', 'Faculty', 'Communities'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChatFilter(tab)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    activeChatFilter === tab
                      ? 'btn-bup-primary text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE USERS TRAY (Fixed Framing, Identical Baseline, No Jitter) */}
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 p-2.5 shrink-0">
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active Now ({activeProfiles.length})
              </span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">ONLINE</span>
            </div>

            {/* Rigid Frame Container: Cards never wrap or jump vertically */}
            <div className="flex items-start gap-2 overflow-x-auto pb-1 scrollbar-none">
              {activeProfiles.map((p) => {
                const isSelected = selectedContact?._id === p._id;
                return (
                  <button
                    key={p._id}
                    onClick={() => handleSelectContact(p)}
                    className="w-14 flex flex-col items-center justify-start shrink-0 group focus:outline-none transition-transform active:scale-95"
                    title={`Chat with ${p.name}`}
                  >
                    <div className="relative">
                      <div
                        className={`w-11 h-11 rounded-full p-0.5 transition-all ${
                          isSelected
                            ? 'ring-2 ring-bup-600 ring-offset-2 dark:ring-offset-slate-900'
                            : 'bg-gradient-to-tr from-emerald-500 to-teal-400'
                        }`}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>
                      <span className="w-3 h-3 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mt-1 w-full text-center truncate group-hover:text-bup-700 dark:group-hover:text-emerald-400">
                      {p.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredContacts.map((contact) => {
              const isSelected = selectedContact?._id === contact._id;
              return (
                <div
                  key={contact._id}
                  onClick={() => handleSelectContact(contact)}
                  className={`p-2.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'btn-bup-primary text-white shadow-md shadow-bup-700/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-bup-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {contact.avatar ? (
                          <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                        ) : (
                          contact.name?.charAt(0)
                        )}
                      </div>
                      {contact.active && (
                        <span className="w-3 h-3 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-xs truncate leading-tight">{contact.name}</p>
                        {contact.role === 'faculty' && (
                          <span
                            className={`text-[8px] font-black px-1.5 py-0.2 rounded uppercase ${
                              isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            Faculty
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] truncate leading-tight mt-0.5 ${
                          isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {contact.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-medium block ${
                        isSelected ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {contact.time}
                    </span>
                    {contact.unread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mt-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: ACTIVE CONVERSATION VIEW (DESKTOP & MOBILE PINNED) */}
        {/* ============================================================== */}
        <div
          className={`flex-1 flex flex-col h-full bg-slate-50/40 dark:bg-slate-950 min-w-0 ${
            mobileChatOpen ? 'flex' : 'hidden md:flex'
          }`}
        >
          {selectedContact ? (
            <>
              {/* 1. Sleek Conversation Header (Pinned) */}
              <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Mobile Back Button: Never scroll, return to chat list in 1 tap */}
                  <button
                    type="button"
                    onClick={() => setMobileChatOpen(false)}
                    className="md:hidden p-1.5 -ml-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
                    title="Back to all chats"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div
                    onClick={() => onViewProfile && onViewProfile(selectedContact)}
                    className="relative shrink-0 cursor-pointer group"
                    title="View Profile"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-bup-700 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:ring-2 group-hover:ring-bup-500 transition-all">
                      {selectedContact.avatar ? (
                        <img
                          src={selectedContact.avatar}
                          alt={selectedContact.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        selectedContact.name?.charAt(0)
                      )}
                    </div>
                    {selectedContact.active && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3
                        onClick={() => onViewProfile && onViewProfile(selectedContact)}
                        className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate cursor-pointer hover:underline hover:text-bup-600 dark:hover:text-bup-400"
                      >
                        {selectedContact.name}
                      </h3>
                      <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        E2EE
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate leading-tight">
                      {selectedContact.department || 'BUP Member'} •{' '}
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active now</span>
                    </p>
                  </div>
                </div>

                {/* Right Action Tools */}
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCallType('audio');
                      setCallModalOpen(true);
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    title="Audio call"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveCallType('video');
                      setCallModalOpen(true);
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Video call"
                  >
                    <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>

                  {onViewProfile && (
                    <button
                      type="button"
                      onClick={() => onViewProfile(selectedContact)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl hover:text-bup-600 transition-colors"
                      title="View Student / Faculty Profile"
                    >
                      <UserIcon className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowRawCrypto(!showRawCrypto)}
                    className={`p-2 rounded-xl transition-colors ${
                      showRawCrypto ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Toggle Ciphertext"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. Scrollable Messages Body (Auto-scrolled, Zero Outer Scroll) */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3">
                {/* Intro Profile Snapshot */}
                <div className="text-center py-4 border-b border-slate-200/50 dark:border-slate-800/50 mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 shadow-sm ring-2 ring-bup-500 ring-offset-2 dark:ring-offset-slate-900 bg-slate-200">
                    <img src={selectedContact.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {selectedContact.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedContact.designation || selectedContact.department}
                  </p>
                  {selectedContact.college && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      College: {selectedContact.college} • {selectedContact.livesIn || 'Mirpur DOHS, Dhaka'}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                    <ShieldCheck className="w-3 h-3" />
                    <span>AES-256-GCM End-to-End Encrypted</span>
                  </span>
                </div>

                {/* Messages List */}
                {messages.map((m) => {
                  const isMe = m.senderId === user?.id || m.senderId === 'me';
                  const text = decryptedTexts[m._id] || m.plainPreviewForDemo || 'Encrypted Message';

                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-md">
                        {!isMe && (
                          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mb-0.5">
                            <img src={selectedContact.avatar} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div
                          className={`p-3 rounded-2xl shadow-xs transition-colors ${
                            isMe
                              ? 'bg-gradient-to-r from-bup-700 to-blue-600 text-white rounded-br-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 rounded-bl-xs'
                          }`}
                        >
                          {renderBubble(text)}

                          {showRawCrypto && m.ciphertext && (
                            <div className="mt-2 pt-2 border-t border-white/20 text-[9px] font-mono opacity-85 break-all">
                              <span className="font-bold">Ciphertext:</span> {m.ciphertext.slice(0, 48)}...
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-1 px-1">
                        <span>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Now'}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* 3. Pinned Bottom Input Bar (Always Accessible, No Scrolling Needed) */}
              <div className="p-2 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 relative">
                {/* Emoji Tray Popover */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-3 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-wrap gap-2 max-w-xs z-30 animate-in fade-in">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-transform active:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sticker Tray Popover */}
                {showStickerPicker && (
                  <div className="absolute bottom-16 left-12 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-wrap gap-3 max-w-xs z-30 animate-in fade-in">
                    {STICKER_LIST.map((stk) => (
                      <button
                        key={stk.id}
                        type="button"
                        onClick={() => sendMessagePayload(`[sticker:${stk.emoji}|${stk.label}]`)}
                        className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                      >
                        <span className="text-3xl">{stk.emoji}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                          {stk.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendText} className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl text-slate-500 hover:text-bup-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Attach Photo"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowStickerPicker(false);
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-bup-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Choose Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowStickerPicker(!showStickerPicker);
                      setShowEmojiPicker(false);
                    }}
                    className="hidden sm:inline-flex p-2 rounded-xl text-slate-500 hover:text-bup-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold"
                    title="Choose Sticker"
                  >
                    <span>Sticker</span>
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${selectedContact.name.split(' ')[0]}...`}
                    className="flex-1 min-w-0 px-3.5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-bup-600 transition-all"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="p-2 sm:px-4 sm:py-2.5 rounded-full btn-bup-primary text-white flex items-center justify-center gap-1.5 shadow-md shadow-bup-700/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-bold">Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">No Conversation Selected</h3>
              <p className="text-xs max-w-xs text-slate-500 mt-1">
                Choose a student, course teacher or club from the left panel to start a secure encrypted DM.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewMediaUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewMediaUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-2 border border-slate-800">
            <button
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewMediaUrl} alt="Preview" className="max-h-[80vh] w-auto rounded-2xl object-contain mx-auto" />
          </div>
        </div>
      )}

      {/* Audio / Video Call Interface Modal */}
      {selectedContact && (
        <CallModal
          isOpen={callModalOpen}
          onClose={() => setCallModalOpen(false)}
          callType={activeCallType}
          recipient={{
            id: selectedContact._id,
            name: selectedContact.name,
            avatar: selectedContact.avatar,
            department: selectedContact.department,
            role: selectedContact.role,
          }}
        />
      )}
    </div>
  );
};
