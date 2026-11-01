import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Minus,
  Phone,
  Video,
  Smile,
  Image as ImageIcon,
  Send,
  ThumbsUp,
  Paperclip,
  Maximize2,
  Lock,
} from 'lucide-react';
import { ChatThread } from './FacebookMessengerPopover';
import { useAuth } from '../context/AuthContext';
import { CallModal } from './CallModal';

interface FloatingMessengerChatProps {
  chat: ChatThread | null;
  onClose: () => void;
  onMaximize: () => void;
  onViewProfile?: (user: any) => void;
}

interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type?: 'text' | 'image' | 'sticker';
}

const EMOJI_PRESETS = ['👍', '❤️', '😂', '🔥', '🎓', '💻', '👏', '🎉'];

const STICKER_PRESETS = [
  { id: 'like', emoji: '👍', label: 'Like' },
  { id: 'love', emoji: '❤️', label: 'Love' },
  { id: 'grad', emoji: '🎓', label: 'BUP Grad' },
  { id: 'code', emoji: '💻', label: 'Code Lab' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
];

export const FloatingMessengerChat: React.FC<FloatingMessengerChatProps> = ({
  chat,
  onClose,
  onMaximize,
  onViewProfile,
}) => {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [activeCallType, setActiveCallType] = useState<'audio' | 'video'>('audio');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize conversation messages from localStorage or defaults
  useEffect(() => {
    if (!chat) return;

    const storageKey = `bupsoc_chat_${chat.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (e) {
        setMessages([]);
      }
    } else {
      // Default realistic starter messages
      const initial: MessageItem[] = [
        {
          id: 'm1',
          senderId: chat.id,
          senderName: chat.name,
          content: chat.lastMessage.includes('·')
            ? 'Salam! Did you check the updated schedule in Routine Hub?'
            : chat.lastMessage,
          timestamp: '10:45 AM',
        },
      ];
      setMessages(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    }
  }, [chat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) return null;

  const handleSendMessage = (textToSend?: string, type: 'text' | 'image' | 'sticker' = 'text') => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: MessageItem = {
      id: 'msg-' + Date.now(),
      senderId: user?.id || 'me',
      senderName: user?.name || 'You',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInputText('');
    setShowEmojiPicker(false);
    setShowStickers(false);

    const storageKey = `bupsoc_chat_${chat.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Simulated Smart Reply from Faculty / Student Contact
    setTimeout(() => {
      let replyContent = 'Received! Thank you for the update. Let me check and get back to you.';
      if (chat.role === 'faculty') {
        replyContent = 'Noted. Please make sure to review the lecture notes and lab exercise guidelines on the Academics Hub.';
      } else if (text.toLowerCase().includes('routine') || text.toLowerCase().includes('class')) {
        replyContent = 'Yeah, check the Routine Hub tab! Room ST 504 and LAB1 Annex timings are updated.';
      } else if (text.toLowerCase().includes('note') || text.toLowerCase().includes('pdf')) {
        replyContent = 'You can download the PDF directly from the Course Materials Hub under Routines!';
      }

      const replyMsg: MessageItem = {
        id: 'reply-' + Date.now(),
        senderId: chat.id,
        senderName: chat.name,
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };

      const finalMessages = [...updated, replyMsg];
      setMessages(finalMessages);
      localStorage.setItem(storageKey, JSON.stringify(finalMessages));
    }, 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleSendMessage(dataUrl, 'image');
    };
    reader.readAsDataURL(file);
  };

  // Minimized Floating Chat Head Bubble
  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 cursor-pointer group animate-in slide-in-from-bottom duration-200"
      >
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-bup-600 shadow-2xl hover:scale-105 transition-transform bg-white"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 sm:bottom-0 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-[360px] max-w-[360px] h-[460px] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-b-none shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden font-sans animate-in slide-in-from-bottom duration-200">
      {/* 1. Header: Avatar + Name + Video/Audio Call + Minimize + Close */}
      <div className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-900 dark:text-white shadow-xs">
        <div
          onClick={() => onViewProfile && onViewProfile(chat)}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
          title={`View ${chat.name}'s profile`}
        >
          <div className="relative shrink-0">
            <img src={chat.avatar} alt={chat.name} className="w-8 h-8 rounded-full object-cover bg-slate-100 group-hover:ring-2 group-hover:ring-bup-500 transition-all" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate leading-tight group-hover:text-bup-600 dark:group-hover:text-bup-400 group-hover:underline">
              {chat.name}
            </h4>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium leading-tight">Active now</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => {
              setActiveCallType('audio');
              setCallModalOpen(true);
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full hover:text-bup-700 transition-colors"
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
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full hover:text-bup-700 transition-colors"
            title="Video call"
          >
            <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full hover:text-slate-800 dark:hover:text-white"
            title="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full hover:text-slate-800 dark:hover:text-white"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50 dark:bg-slate-950">
        <div className="text-center py-2">
          <img src={chat.avatar} alt="" className="w-12 h-12 rounded-full mx-auto mb-1.5 object-cover shadow-xs" />
          <p className="font-bold text-xs text-slate-900 dark:text-white">{chat.name}</p>
          <p className="text-[10px] text-slate-500">{chat.department}</p>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 inline-block">
            End-to-End Encrypted (AES-256)
          </span>
        </div>

        {messages.map((m) => {
          const isMe = m.senderId === user?.id || m.senderId === 'me';

          return (
            <div key={m.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <img src={chat.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" />
              )}

              <div className="max-w-[80%]">
                {m.type === 'image' ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                    <img src={m.content} alt="Attachment" className="max-h-48 object-cover w-full" />
                  </div>
                ) : m.type === 'sticker' ? (
                  <div className="text-4xl py-1">{m.content}</div>
                ) : (
                  <div
                    className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'btn-bup-primary text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                    }`}
                  >
                    {m.content}
                  </div>
                )}
                <span className="text-[9px] text-slate-400 px-1 mt-0.5 block text-right font-mono">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji / Sticker Trays */}
      {showEmojiPicker && (
        <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around text-lg">
          {EMOJI_PRESETS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleSendMessage(emoji, 'text')}
              className="hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {showStickers && (
        <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around text-2xl">
          {STICKER_PRESETS.map((stk) => (
            <button
              key={stk.id}
              type="button"
              onClick={() => handleSendMessage(stk.emoji, 'sticker')}
              className="hover:scale-125 transition-transform p-1"
              title={stk.label}
            >
              {stk.emoji}
            </button>
          ))}
        </div>
      )}

      {/* 3. Input Toolbar: Plus, Photo, Sticker, Input "Aa", Thumbs Up */}
      <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-slate-500">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          id="chatbox-file-upload"
        />

        {/* Photo Upload Icon */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full hover:text-bup-700"
          title="Attach a photo"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Sticker Icon */}
        <button
          type="button"
          onClick={() => {
            setShowStickers(!showStickers);
            setShowEmojiPicker(false);
          }}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full hover:text-bup-700"
          title="Choose a sticker"
        >
          <span className="text-sm">👾</span>
        </button>

        {/* Text Input Field with Aa placeholder */}
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Aa"
            className="w-full pl-3 pr-8 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-bup-600"
          />

          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowStickers(false);
            }}
            className="absolute right-2.5 text-slate-400 hover:text-bup-700"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>

        {/* Send Arrow OR Facebook Thumbs Up */}
        {inputText.trim() ? (
          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="p-1.5 rounded-full btn-bup-primary text-white"
            title="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSendMessage('👍', 'sticker')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-blue-600 hover:scale-110 transition-transform"
            title="Send a Like"
          >
            <ThumbsUp className="w-4 h-4 fill-blue-600" />
          </button>
        )}
      </div>

      {/* Audio / Video Call Interface Modal */}
      <CallModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        callType={activeCallType}
        recipient={{
          id: chat.id,
          name: chat.name,
          avatar: chat.avatar,
          department: chat.department,
        }}
      />
    </div>
  );
};
