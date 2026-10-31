import React, { useState } from 'react';
import {
  Flag,
  Users,
  Plus,
  CheckCircle2,
  ThumbsUp,
  Share2,
  Lock,
  Globe,
  Bell,
  Sparkles,
  Search,
  MessageSquare,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { INITIAL_CAMPUS_PAGES, INITIAL_CAMPUS_GROUPS, CampusPage, CampusGroup } from '../data/campusPagesGroups';
import { useAuth } from '../context/AuthContext';

export const PagesGroups: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'PAGES' | 'GROUPS'>('PAGES');
  const [pages, setPages] = useState<CampusPage[]>(() => {
    const saved = localStorage.getItem('bupsoc_campus_pages');
    return saved ? JSON.parse(saved) : INITIAL_CAMPUS_PAGES;
  });
  const [groups, setGroups] = useState<CampusGroup[]>(() => {
    const saved = localStorage.getItem('bupsoc_campus_groups');
    return saved ? JSON.parse(saved) : INITIAL_CAMPUS_GROUPS;
  });

  const [followedPages, setFollowedPages] = useState<Record<string, boolean>>({});
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({
    'grp-antorikkho22': true,
    'grp-ict24': true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [createModalType, setCreateModalType] = useState<'PAGE' | 'GROUP' | null>(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFollow = (pageId: string) => {
    setFollowedPages((prev) => {
      const isNowFollowed = !prev[pageId];
      const page = pages.find((p) => p.id === pageId);
      showToast(isNowFollowed ? `Following ${page?.name}` : `Unfollowed ${page?.name}`);
      return { ...prev, [pageId]: isNowFollowed };
    });
  };

  const handleToggleJoin = (groupId: string) => {
    setJoinedGroups((prev) => {
      const isNowJoined = !prev[groupId];
      const group = groups.find((g) => g.id === groupId);
      showToast(isNowJoined ? `Joined group: ${group?.name}` : `Left group: ${group?.name}`);

      setGroups((grpList) =>
        grpList.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              membersCount: isNowJoined ? g.membersCount + 1 : Math.max(1, g.membersCount - 1),
            };
          }
          return g;
        })
      );

      return { ...prev, [groupId]: isNowJoined };
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (createModalType === 'PAGE') {
      const newPage: CampusPage = {
        id: `page-${Date.now()}`,
        name: newName,
        handle: newName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        category: newCategory || 'Campus Society',
        likesCount: 1,
        followersCount: 1,
        avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200',
        isVerified: true,
        bio: newDescription || `Official student-led community page at BUP created by ${user?.name}.`,
        contactEmail: `${user?.email || 'admin@bup.edu.bd'}`,
        location: 'BUP Campus, Mirpur Cantonment',
        recentPost: {
          title: `Welcome to ${newName}!`,
          date: 'Just now',
          content: 'Excited to launch our official page on BUP Social. Stay tuned for events and updates!',
        },
      };
      const updated = [newPage, ...pages];
      setPages(updated);
      localStorage.setItem('bupsoc_campus_pages', JSON.stringify(updated));
      showToast(`Created page "${newName}" successfully!`);
    } else {
      const newGrp: CampusGroup = {
        id: `grp-${Date.now()}`,
        name: newName,
        privacy: 'Public Group',
        category: newCategory || 'Study & Cohort Circle',
        membersCount: 1,
        avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200',
        coverPhoto: '/assets/bup_antorikkho_batch22.jpg',
        description: newDescription || `Official discussion circle founded by ${user?.name}.`,
        adminName: user?.name || 'Munshi Tanvir Hossain',
        adminRole: 'Group Founder',
        pinnedNotice: '📌 Welcome all new members to our official BUP discussion group!',
        isJoined: true,
      };
      const updated = [newGrp, ...groups];
      setGroups(updated);
      setJoinedGroups((prev) => ({ ...prev, [newGrp.id]: true }));
      localStorage.setItem('bupsoc_campus_groups', JSON.stringify(updated));
      showToast(`Created group "${newName}" successfully!`);
    }

    setCreateModalType(null);
    setNewName('');
    setNewCategory('');
    setNewDescription('');
  };

  const filteredPages = pages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-bup-navy via-bup-900 to-[#0c3164] text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900 uppercase tracking-wider">
              Campus Communities
            </span>
            <span className="text-xs text-blue-200">BUP Social Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Official BUP Pages & Cohort Groups</h1>
          <p className="text-xs text-blue-200/90 mt-1 max-w-xl">
            Explore verified university societies, department clubs, batch communities, and research study circles connected to the campus MySQL database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalType('PAGE')}
            className="btn-motion px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Page</span>
          </button>
          <button
            onClick={() => setCreateModalType('GROUP')}
            className="btn-motion px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md"
          >
            <Users className="w-4 h-4" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('PAGES')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'PAGES'
                ? 'bg-bup-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Campus Pages ({pages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('GROUPS')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'GROUPS'
                ? 'bg-bup-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Campus Groups ({groups.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-bup-500"
          />
        </div>
      </div>

      {/* TAB 1: PAGES */}
      {activeTab === 'PAGES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPages.map((page) => {
            const isFollowed = followedPages[page.id];
            return (
              <div
                key={page.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Cover Banner */}
                <div className="h-28 relative overflow-hidden bg-slate-800">
                  <img src={page.coverPhoto} alt="" className="w-full h-full object-cover opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <div className="absolute bottom-2 left-4 flex items-center gap-1.5 text-white text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                      {page.category}
                    </span>
                  </div>
                </div>

                {/* Page Info Header */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 -mt-10 rounded-2xl border-2 border-white dark:border-slate-900 shadow-lg overflow-hidden bg-slate-800 shrink-0">
                        <img src={page.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {page.name}
                          </h3>
                          {page.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          @{page.handle} • {page.followersCount.toLocaleString()} followers
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleFollow(page.id)}
                      className={`btn-motion px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
                        isFollowed
                          ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'btn-bup-primary text-white shadow-sm'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isFollowed ? 'Followed ✓' : 'Follow'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {page.bio}
                  </p>

                  {/* Recent Post snippet */}
                  {page.recentPost && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                        <span>Latest Update</span>
                        <span>{page.recentPost.date}</span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {page.recentPost.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-[11px]">
                        {page.recentPost.content}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{page.location}</span>
                    <a href={`mailto:${page.contactEmail}`} className="text-bup-600 dark:text-bup-400 font-bold hover:underline">
                      {page.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: GROUPS */}
      {activeTab === 'GROUPS' && (
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const isJoined = joinedGroups[group.id];
            return (
              <div
                key={group.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img src={group.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                          {group.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          {group.privacy === 'Public Group' ? <Globe className="w-3 h-3 text-emerald-500" /> : <Lock className="w-3 h-3 text-amber-500" />}
                          <span>{group.privacy}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {group.category} • <strong className="text-emerald-600 dark:text-emerald-400">{group.membersCount.toLocaleString()} members</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Admin: <span className="font-bold text-slate-700 dark:text-slate-300">{group.adminName}</span> ({group.adminRole})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={() => handleToggleJoin(group.id)}
                      className={`btn-motion px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shadow-sm ${
                        isJoined
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400'
                          : 'btn-bup-primary text-white shadow-bup-700/20'
                      }`}
                    >
                      {isJoined ? 'Joined Group ✓' : '+ Join Group'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {group.description}
                </p>

                {group.pinnedNotice && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
                    <span className="font-medium">{group.pinnedNotice}</span>
                    <span className="text-[10px] font-black uppercase text-amber-600 shrink-0">Pinned</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      {createModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Create New {createModalType === 'PAGE' ? 'Campus Page' : 'Discussion Group'}
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {createModalType === 'PAGE' ? 'Page Name / Club Title:' : 'Group Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={createModalType === 'PAGE' ? 'e.g., BUP AI Research Society' : 'e.g., FST Web Lab Discussion Batch 24'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category / Tag:</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g., Academic Club, Technology, Sports, Study Circle"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description & Purpose:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain the purpose of this community for fellow BUPians..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-motion btn-bup-primary px-4 py-2 rounded-xl text-white font-bold shadow-md"
                >
                  Create & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
