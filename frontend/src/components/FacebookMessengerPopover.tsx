import React, { useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Maximize2,
  Edit,
  Check,
  BellOff,
  Phone,
  Video,
  X,
  Smile,
  Image as ImageIcon,
  Send,
  ThumbsUp,
  Sparkles,
  Paperclip,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS_MAP } from '../context/AuthContext';

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isOngoingCall?: boolean;
  isMuted?: boolean;
  groupType?: 'direct' | 'group' | 'community';
}

interface FacebookMessengerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (thread: ChatThread) => void;
  onOpenFullMessenger: () => void;
}

export const INITIAL_MESSENGER_CHATS: ChatThread[] = [
  {
    id: 'c1',
    name: 'Safaytul Islam Rafi',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
    role: 'student',
    department: 'BICE-2024 CR',
    isOnline: true,
    lastMessage: 'You sent a photo. · 12m',
    timestamp: '12m',
    unread: true,
    isOngoingCall: false,
  },
  {
    id: 'c2',
    name: 'Asst. Prof. Nazneen Akter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    role: 'faculty',
    department: 'Faculty Supervisor',
    isOnline: true,
    lastMessage: 'Software Lab report submission deadline extended to Thursday.',
    timestamp: '23m',
    unread: true,
    isMuted: true,
  },
  {
    id: 'c3',
    name: 'BICE-2024 Section B (Official)',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300',
    role: 'student',
    department: 'Batch Community',
    isOnline: true,
    lastMessage: 'Munshi Tanvir reacted ❤️ to your message · 28m',
    timestamp: '28m',
    unread: true,
    isMuted: true,
    groupType: 'community',
  },
  {
    id: 'c4',
    name: 'BUP InfoTech Club (BUPITC)',
    avatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300',
    role: 'club_admin',
    department: 'Official Tech Club',
    isOnline: true,
    lastMessage: 'Hackathon team registration approved! Check email for team ID.',
    timestamp: '1h',
    unread: false,
    groupType: 'group',
  },
  {
    id: 'c5',
    name: 'Col Mohammed Omar Faruque, PhD',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    role: 'faculty',
    department: 'Chairman, Dept of ICT',
    isOnline: true,
    lastMessage: 'Routine reschedule notice posted for MATH-2207.',
    timestamp: '2h',
    unread: false,
  },
  {
    id: 'c6',
    name: 'Munshi Tanvir Hossain',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    role: 'student',
    department: 'Section B Lead',
    isOnline: true,
    lastMessage: 'Reacted 😂 to your message · 2h',
    timestamp: '2h',
    unread: false,
  },
  {
    id: 'c7',
    name: 'Prof. Dr. Fahima Tabassum',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300',
    role: 'faculty',
    department: 'Course Head (ICE-4101)',
    isOnline: false,
    lastMessage: 'QA testing slides uploaded to Course Notes Hub.',
    timestamp: '1d',
    unread: false,
  },
  {
    id: 'c8',
    name: 'Brig Gen Sufi Md Ataur Rahman',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    role: 'faculty',
    department: 'Dean, FST',
    isOnline: false,
    lastMessage: 'FST Dean Wing announcement regarding research grants.',
    timestamp: '2d',
    unread: false,
  },
];

export const FacebookMessengerPopover: React.FC<FacebookMessengerPopoverProps> = ({
  isOpen,
  onClose,
  onSelectChat,
  onOpenFullMessenger,
}) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Groups' | 'Communities'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatList, setChatList] = useState<ChatThread[]>(INITIAL_MESSENGER_CHATS);

  if (!isOpen) return null;

  // Search across existing chats + official BUP directory members
  const directoryMembers: ChatThread[] = Object.values(DEMO_USERS_MAP)
    .filter((u) => u.email !== user?.email)
    .map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
      role: u.role,
      department: u.department || 'BUP Member',
      isOnline: true,
      lastMessage: `Click to start conversation with ${u.role === 'faculty' ? 'Faculty' : 'Student'}`,
      timestamp: 'Active',
      unread: false,
    }));

  const allAvailableContacts = [...chatList];
  directoryMembers.forEach((dm) => {
    if (!allAvailableContacts.some((c) => c.name.toLowerCase() === dm.name.toLowerCase())) {
      allAvailableContacts.push(dm);
    }
  });

  const filteredChats = allAvailableContacts.filter((chat) => {
    // Tab filter
    if (activeFilter === 'Unread' && !chat.unread) return false;
    if (activeFilter === 'Groups' && chat.groupType !== 'group') return false;
    if (activeFilter === 'Communities' && chat.groupType !== 'community') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        chat.name.toLowerCase().includes(q) ||
        chat.department.toLowerCase().includes(q) ||
        chat.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-[#242526] text-white shadow-2xl border border-white/10 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
      {/* 1. Header: Chats + Options + Expand + Compose */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-white">Chats</h2>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] flex items-center justify-center transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFullMessenger();
            }}
            className="w-8 h-8 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] flex items-center justify-center transition-colors"
            title="Open in full screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('messenger-search-input');
              input?.focus();
            }}
            className="w-8 h-8 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] flex items-center justify-center transition-colors"
            title="New message"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Search Box: 'Search Messenger' (Facebook Pill) */}
      <div className="px-4 py-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#b0b3b8] absolute left-3 pointer-events-none" />
          <input
            id="messenger-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Messenger"
            className="w-full pl-9 pr-3 py-2 rounded-full bg-[#3a3b3c] text-white placeholder-[#b0b3b8] text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-[#b0b3b8] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Filter Pills: All, Unread, Groups, Communities */}
      <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
        {(['All', 'Unread', 'Groups', 'Communities'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-[#2d88ff]/20 text-[#2d88ff]'
                : 'bg-[#3a3b3c] text-[#e4e6eb] hover:bg-[#4e4f50]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4. Chat Thread List */}
      <div className="max-h-[380px] overflow-y-auto px-2 py-1 space-y-0.5">
        {filteredChats.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#b0b3b8]">
            No conversations found for "{searchQuery}".
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                onSelectChat(chat);
                onClose();
              }}
              className="p-2.5 rounded-xl hover:bg-[#3a3b3c] cursor-pointer flex items-center justify-between gap-3 transition-colors group relative"
            >
              {/* Avatar with Online Status Indicator */}
              <div className="relative shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/5"
                />
                {chat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#31a24c] ring-2 ring-[#242526]" />
                )}
              </div>

              {/* Contact Details & Last Message Preview */}
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-semibold text-sm text-[#e4e6eb] truncate group-hover:text-white">
                  {chat.name}
                </h4>

                <p className="text-xs text-[#b0b3b8] truncate mt-0.5">
                  {chat.isOngoingCall ? (
                    <span className="text-[#31a24c] font-semibold">Ongoing call</span>
                  ) : (
                    <span>{chat.lastMessage}</span>
                  )}
                </p>
              </div>

              {/* Right Side: Unread Dot / Mute Icon */}
              <div className="shrink-0 flex items-center gap-1.5">
                {chat.isMuted && <BellOff className="w-3.5 h-3.5 text-[#b0b3b8]" />}
                {chat.unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2d88ff] inline-block" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Footer: 'See all in Messenger' */}
      <div className="p-3 border-t border-white/10 text-center bg-[#242526]">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenFullMessenger();
          }}
          className="text-xs font-bold text-[#2d88ff] hover:underline"
        >
          See all in Messenger
        </button>
      </div>
    </div>
  );
};
