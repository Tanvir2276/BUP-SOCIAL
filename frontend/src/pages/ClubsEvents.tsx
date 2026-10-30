import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Heart,
  Star,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
  Award,
  Flame,
  Search,
  Filter,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Real authentic club visual banners and attributes
const CLUB_METADATA: Record<string, { banner: string; category: string; motto: string }> = {
  'BUP InfoTech Club (BUPITC)': {
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
    category: 'FST Tech & Engineering',
    motto: 'Empowering Next-Gen Software Architects & Ethical Hackers',
  },
  'BUP Robotics Club (BUPRC)': {
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
    category: 'FST Tech & Engineering',
    motto: 'Innovating Autonomous Systems, Drones & Microcontrollers',
  },
  'BUP IEEE Student Branch': {
    banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600',
    category: 'Global Engineering Chapter',
    motto: 'Advancing Technology for Humanity & International Research',
  },
  'BUP Career & Leadership Club (BCLC)': {
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
    category: 'Leadership & Career',
    motto: 'Bridging Corporate Academia & Professional Placement',
  },
  'BUP Debate Club (BUPDC)': {
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600',
    category: 'Oratory & Diplomacy',
    motto: 'Championing Parliamentary Eloquence & Strategic Arguments',
  },
  'BUP Environmental Club (BUPEC)': {
    banner: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
    category: 'FST Earth & Ecology',
    motto: 'Sustainability, Delta Ecology & Climate Risk Awareness',
  },
};

export const ClubsEvents: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchClubsAndEvents = async () => {
    setLoading(true);
    try {
      const [cRes, eRes] = await Promise.all([apiFetch('/clubs'), apiFetch('/clubs/events')]);
      if (cRes.success) setClubs(cRes.clubs);
      if (eRes.success) setEvents(eRes.events);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubsAndEvents();
  }, []);

  const handleToggleFavorite = async (clubName: string) => {
    try {
      const res = await apiFetch(`/clubs/${encodeURIComponent(clubName)}/favorite`, {
        method: 'POST',
      });
      if (res.success) {
        await refreshUser();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle favorite club');
    }
  };

  const handleRegisterEvent = async (eventId: string) => {
    try {
      const res = await apiFetch(`/clubs/events/${eventId}/register`, {
        method: 'POST',
      });
      if (res.success) {
        fetchClubsAndEvents();
      }
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    }
  };

  // Filter clubs by category and search query
  const filteredClubs = clubs.filter((club) => {
    const meta = CLUB_METADATA[club.name] || { category: 'Campus Organization' };
    const matchesCategory =
      filterCategory === 'ALL' ||
      (filterCategory === 'TECH' && meta.category.includes('Tech')) ||
      (filterCategory === 'LEADERSHIP' && meta.category.includes('Leadership')) ||
      (filterCategory === 'FAVORITES' && user?.favoriteClubs?.includes(club.name));

    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
              CAMPUS ORGANIZATIONS & SOCIETIES
            </span>
            <span className="text-xs text-slate-400 font-mono">BUP Student Affairs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Clubs, Chapters & Flagship Events
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Join verified BUP student societies, personalize your academic feed with favorite clubs, and register for workshops.
          </p>
        </div>

        {/* Favorite count pill */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="font-bold text-amber-900 dark:text-amber-200">
            {user?.favoriteClubs?.length || 0} Favorite Clubs Selected
          </span>
        </div>
      </div>

      {/* 2. Category & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Organizations' },
            { id: 'FAVORITES', label: '⭐ My Favorites' },
            { id: 'TECH', label: '💻 FST Tech & Robotics' },
            { id: 'LEADERSHIP', label: '🏆 Leadership & Debate' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`btn-motion px-3.5 py-2 rounded-xl font-bold whitespace-nowrap border transition-all ${
                filterCategory === cat.id
                  ? 'btn-bup-primary text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clubs or events..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* 3. Clubs Catalog Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-bup-600" />
            <span>Verified University Clubs ({filteredClubs.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Click heart to add to your personalized feed</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading verified clubs...</div>
        ) : filteredClubs.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No clubs found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClubs.map((club) => {
              const isFavorite = user?.favoriteClubs?.includes(club.name);
              const meta = CLUB_METADATA[club.name] || {
                banner: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
                category: 'Campus Organization',
                motto: 'Leadership, Knowledge & Excellence',
              };

              return (
                <div
                  key={club._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-bup-500 transition-all hover:shadow-lg group"
                >
                  {/* Club Real Banner */}
                  <div className="h-32 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={meta.banner}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Short Code Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-white/90 text-bup-900 shadow">
                        {club.shortCode}
                      </span>
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(club.name)}
                      className={`btn-motion absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
                        isFavorite
                          ? 'bg-rose-600 text-white shadow-lg'
                          : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
                      }`}
                      title={isFavorite ? 'Remove from favorites' : 'Set as favorite club'}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                    </button>

                    {/* Category Label on Banner */}
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-[10px] font-bold text-amber-300 drop-shadow truncate">{meta.category}</p>
                      <h4 className="font-extrabold text-sm text-white drop-shadow truncate">{club.name}</h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {club.description}
                      </p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold italic mt-1.5">
                        "{meta.motto}"
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Advisor: {club.advisor?.split(' ')[0] || 'Faculty'}...</span>
                      <span className="font-bold text-bup-700 dark:text-blue-400">
                        {club.membersCount} Members
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Upcoming Flagship Campus Events Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-bup-600" />
            <span>Upcoming Workshops, Hackathons & Seminars ({events.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Online 1-click registration</span>
        </div>

        <div className="space-y-3">
          {events.map((evt) => {
            const isRegistered = evt.registeredParticipants?.some((p: any) => p.userId === user?.id);

            return (
              <div
                key={evt._id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-bup-500 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                      {evt.clubName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {evt.category || 'Workshop'}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{evt.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-bup-600" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {evt.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {evt.venue}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      👥 {evt.registeredParticipants?.length || 0} Registered
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRegisterEvent(evt._id)}
                  disabled={isRegistered}
                  className={`btn-motion py-2.5 px-5 rounded-xl font-bold text-xs shrink-0 transition-all ${
                    isRegistered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                      : 'btn-bup-primary text-white shadow-md shadow-bup-700/20'
                  }`}
                >
                  {isRegistered ? '✓ Registered' : 'Register for Event'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
