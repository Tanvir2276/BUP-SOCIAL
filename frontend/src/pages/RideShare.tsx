import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  Navigation,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { BupGoModal } from '../components/BupGoModal';

export const RideShare: React.FC = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [bupGoModalOpen, setBupGoModalOpen] = useState(false);

  // New ride form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [origin, setOrigin] = useState('Mirpur 12 Metro Station');
  const [destination, setDestination] = useState('BUP Campus, Mirpur Cantonment');
  const [departureTime, setDepartureTime] = useState('08:15 AM');
  const [transportMode, setTransportMode] = useState('Bike');
  const [seats, setSeats] = useState(1);
  const [cost, setCost] = useState('Free / Campus Buddy');
  const [notes, setNotes] = useState('Helmet available. Daily commute.');
  const [creating, setCreating] = useState(false);

  const bupGoUrl = localStorage.getItem('bupgo_custom_url') || 'https://bup-go-project-8njl.vercel.app/';

  const fetchRides = async () => {
    setLoading(true);
    try {
      const query = filterType !== 'All' ? `?type=${filterType}` : '';
      const res = await apiFetch(`/rides${query}`);
      if (res.success) {
        setRides(res.rides);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [filterType]);

  const handleLaunchBupGo = () => {
    window.open(bupGoUrl, '_blank', 'noopener,noreferrer');
  };

  const handleJoinRide = async (rideId: string) => {
    try {
      const res = await apiFetch(`/rides/${rideId}/join`, { method: 'POST' });
      if (res.success) {
        fetchRides();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to join ride');
    }
  };

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiFetch('/rides', {
        method: 'POST',
        body: JSON.stringify({
          origin,
          destination,
          departureTime,
          transportMode,
          seatsAvailable: seats,
          estimatedCost: cost,
          notes,
          type: 'Offer',
        }),
      });
      setShowCreateModal(false);
      fetchRides();
    } catch (err: any) {
      alert(err.message || 'Failed to post ride');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* User Requirement: BUP-GO Connection Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Integrated Campus Mobility Bridge</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            BUP-GO Ride System Integration
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Need an instant bike, carpool, or shared commute? Jump straight to your existing{' '}
            <strong className="text-white">BUP-GO</strong> application with single-click authentication!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleLaunchBupGo}
              className="py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 group hover:scale-102"
            >
              <span>Launch BUP-GO Now</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={() => setBupGoModalOpen(true)}
              className="py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl text-xs transition-colors backdrop-blur-md border border-white/20"
            >
              Bridge Settings ({bupGoUrl})
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-15 pointer-events-none">
          <Car className="w-64 h-64 text-emerald-400" />
        </div>
      </div>

      {/* Local Campus Commute Sharing Feed */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Campus RideShare & Commute Partners</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Find fellow students commuting from your neighbourhood to BUP Mirpur Campus.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto py-2.5 px-4 bg-bup-700 hover:bg-bup-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-bup-700/20 flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Offer a Ride</span>
          </button>
        </div>
      </div>

      {/* Ride Cards List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading campus ride opportunities...</div>
      ) : rides.length === 0 ? (
        <div className="p-8 text-center glass-panel rounded-3xl text-xs text-slate-400">
          No active ride offers right now. Be the first to share your route!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rides.map((ride) => {
            const hasJoined = ride.passengers?.some((p: any) => p.userId === user?.id);
            const isHost = ride.hostUser?.userId === user?.id;

            return (
              <div
                key={ride._id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:border-emerald-500"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {ride.transportMode}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {ride.seatsAvailable} seats available
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {ride.estimatedCost}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>From: <strong>{ride.origin}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>To: <strong>{ride.destination}</strong></span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-4">
                    "{ride.notes || 'Commuting to campus together.'}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{ride.hostUser?.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Departure: <strong className="text-slate-700 dark:text-slate-300">{ride.departureTime}</strong>
                    </p>
                  </div>

                  {!isHost && (
                    <button
                      onClick={() => handleJoinRide(ride._id)}
                      disabled={hasJoined || ride.seatsAvailable === 0}
                      className={`py-2 px-3.5 rounded-xl font-bold text-xs transition-all ${
                        hasJoined
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-40'
                      }`}
                    >
                      {hasJoined ? 'Joined ✓' : 'Join Ride'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Offer Ride Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Offer Campus Commute Share</h3>
            <form onSubmit={handleCreateRide} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Starting Point</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Vehicle Mode</label>
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Bike">Motorbike</option>
                    <option value="Car">Carpool (AC)</option>
                    <option value="CNG Share">CNG Share</option>
                    <option value="Rickshaw Share">Rickshaw Share</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Notes / Pickup instructions</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {creating ? 'Posting...' : 'Publish Commute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUP-GO Connector Modal */}
      <BupGoModal isOpen={bupGoModalOpen} onClose={() => setBupGoModalOpen(false)} />
    </div>
  );
};
