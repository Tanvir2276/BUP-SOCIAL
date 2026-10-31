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
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { encryptE2EE, decryptE2EE } from '../utils/cryptoE2EE';

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

export const Messages: React.FC = () => {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
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

  // 1. Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiFetch('/messages/contacts');
        if (res.success && res.contacts.length > 0) {
          setContacts(res.contacts);
          setSelectedContact(res.contacts[0]);
        }
      } catch (e) {
        console.error(e);
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
      if (res.success) {
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
        setTimeout(scrollToBottom, 100);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [selectedContact]);

  // 3. Send message handler (supports text, [image:...], [sticker:...], [gif:...])
  const sendMessagePayload = async (payload: string) => {
    if (!payload.trim() || !selectedContact || !user) return;

    setSending(true);
    const plaintext = payload.trim();

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
        setTimeout(scrollToBottom, 100);
      }
    } catch (err: any) {
      alert(err.message || 'Message delivery failed');
    } finally {
      setSending(false);
      setShowEmojiPicker(false);
      setShowStickerPicker(false);
      setShowGifPicker(false);
      setShowImageModal(false);
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

  // Filter contacts by search
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
    (c.department && c.department.toLowerCase().includes(searchContact.toLowerCase()))
  );

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

      {/* Main Messaging Window (Messenger Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-[650px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Left: Contact List (4 Cols) - Facebook Messenger Desktop Sidebar (User Screenshot Req) */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-white dark:bg-[#242526]">
          {/* Header & Options */}
          <div className="p-3.5 pb-2 border-b border-slate-100 dark:border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Chats</h3>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  {contacts.length}
                </span>
              </div>
            </div>

            {/* Pill Search: 'Search Messenger' */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#b0b3b8] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                placeholder="Search Messenger"
                className="w-full pl-9 pr-3 py-2 rounded-full text-xs border border-slate-200 dark:border-transparent bg-slate-100 dark:bg-[#3a3b3c] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#b0b3b8] outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Filter Pills: All, Unread, Groups, Communities */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none pt-0.5">
              {(['All', 'Unread', 'Groups', 'Communities'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveChatFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-[11px] transition-colors whitespace-nowrap ${
                    activeChatFilter === filter
                      ? 'bg-blue-100 text-blue-700 dark:bg-[#2d88ff]/20 dark:text-[#2d88ff]'
                      : 'bg-slate-100 dark:bg-[#3a3b3c] text-slate-600 dark:text-[#e4e6eb] hover:bg-slate-200 dark:hover:bg-[#4e4f50]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Contact scrollable list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {filteredContacts.map((contact, idx) => {
              const isSelected = selectedContact?._id === contact._id;
              const isFaculty = contact.role === 'faculty';
              const isUnread = idx === 0 || idx === 1;

              return (
                <div
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-2.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-bup-700 text-white shadow-md shadow-bup-700/20'
                      : 'hover:bg-slate-100 dark:hover:bg-[#3a3b3c] text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-bup-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {contact.avatar ? (
                          <img src={contact.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          contact.name?.charAt(0)
                        )}
                      </div>
                      {/* Facebook Messenger Green Active Online Dot */}
                      <span className="w-3.5 h-3.5 rounded-full bg-[#31a24c] absolute bottom-0 right-0 ring-2 ring-white dark:ring-[#242526]" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate leading-tight text-slate-900 dark:text-white">
                        {contact.name}
                      </p>
                      <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-[#b0b3b8]'}`}>
                        {idx === 0
                          ? 'You sent a photo. · 12m'
                          : idx === 1
                          ? 'Software Lab report submission deadline... · 23m'
                          : `${isFaculty ? contact.designation || 'Faculty' : contact.section || 'Student'}`}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
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
                    {isUnread && !isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2d88ff] inline-block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Messenger Chat Pane (8 Cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900 relative">
          {/* 1. Messenger Header */}
          {selectedContact && (
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-bup-700 text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
                    {selectedContact.avatar ? (
                      <img src={selectedContact.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      selectedContact.name?.charAt(0)
                    )}
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                      {selectedContact.name}
                    </h4>
                    {selectedContact.role === 'faculty' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                        Faculty
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active now • End-to-End Encrypted</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 text-slate-500">
                <button
                  type="button"
                  onClick={() => alert(`Audio call simulation with ${selectedContact.name}`)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-bup-600 transition-colors"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Video room simulation with ${selectedContact.name}`)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-bup-600 transition-colors"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

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
