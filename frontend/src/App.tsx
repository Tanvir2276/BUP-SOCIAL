import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Feed } from './pages/Feed';
import { Academics } from './pages/Academics';
import { Routines } from './pages/Routines';
import { RideShare } from './pages/RideShare';
import { ClubsEvents } from './pages/ClubsEvents';
import { Messages } from './pages/Messages';
import { LostFound } from './pages/LostFound';
import { ProfileSettings } from './pages/ProfileSettings';
import { CustomReminders } from './pages/CustomReminders';
import { FloatingMessengerChat } from './components/FloatingMessengerChat';
import { ChatThread } from './components/FacebookMessengerPopover';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('feed');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFloatingChat, setActiveFloatingChat] = useState<ChatThread | null>(null);
  const [viewingProfileUser, setViewingProfileUser] = useState<any | null>(null);

  const handleNavigateTab = (tab: string) => {
    if (tab === 'profile') {
      setViewingProfileUser(null);
    }
    setActiveTab(tab);
  };

  const handleViewProfile = (userObj: any) => {
    if (!userObj) return;
    setViewingProfileUser(userObj);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-bup-700 flex items-center justify-center text-bup-gold font-black text-2xl shadow-xl shadow-bup-700/30 animate-pulse">
            BUP
          </div>
          <p className="text-xs font-semibold text-slate-400">Loading BUP Social Platform (MySQL Engine)...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated screen
  if (!user) {
    if (authView === 'register') {
      return <Register onNavigateLogin={() => setAuthView('login')} />;
    }
    return <Login onNavigateRegister={() => setAuthView('register')} />;
  }

  // Authenticated Facebook-style Social Application Layout
  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-16 lg:pb-0">
      {/* Top Facebook-Style Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        onSelectChat={(chat) => setActiveFloatingChat(chat)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Collapsible Facebook-Style Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleNavigateTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Center Dynamic Content Area */}
        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 animate-in fade-in duration-200">
          {activeTab === 'feed' && (
            <Feed
              onViewProfile={handleViewProfile}
              onOpenChat={(chat) => setActiveFloatingChat(chat)}
            />
          )}
          {activeTab === 'academics' && <Academics onViewProfile={handleViewProfile} />}
          {activeTab === 'notices' && <Academics onViewProfile={handleViewProfile} />}
          {activeTab === 'communities' && (
            <Feed
              onViewProfile={handleViewProfile}
              onOpenChat={(chat) => setActiveFloatingChat(chat)}
            />
          )}
          {activeTab === 'routines' && <Routines />}
          {activeTab === 'reminders' && (
            <CustomReminders onNavigateRoutine={() => handleNavigateTab('routines')} />
          )}
          {activeTab === 'clubs' && <ClubsEvents />}
          {activeTab === 'rides' && <RideShare />}
          {activeTab === 'messages' && <Messages onViewProfile={handleViewProfile} />}
          {activeTab === 'lostfound' && (
            <LostFound
              onOpenChat={(chat) => setActiveFloatingChat(chat)}
              onNavigateTab={(tab) => handleNavigateTab(tab)}
              onViewProfile={handleViewProfile}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileSettings
              viewingUser={viewingProfileUser}
              onBack={() => {
                setViewingProfileUser(null);
                handleNavigateTab('feed');
              }}
              onOpenChat={(chat) => setActiveFloatingChat(chat)}
              onViewProfile={handleViewProfile}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={handleNavigateTab} />

      {/* Floating Messenger Chatbox Window (Facebook Style - User Screenshot Req) */}
      <FloatingMessengerChat
        chat={activeFloatingChat}
        onClose={() => setActiveFloatingChat(null)}
        onMaximize={() => {
          setActiveFloatingChat(null);
          handleNavigateTab('messages');
        }}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
};
