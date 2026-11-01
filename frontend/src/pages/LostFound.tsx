import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  CheckCircle2,
  Tag,
  Phone,
  Mail,
  X,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface LostFoundProps {
  onOpenChat?: (chat: any) => void;
  onNavigateTab?: (tab: string) => void;
  onViewProfile?: (user: any) => void;
}

export const LostFound: React.FC<LostFoundProps> = ({ onOpenChat, onNavigateTab, onViewProfile }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Contact Owner Modal
  const [contactModalItem, setContactModalItem] = useState<any | null>(null);
  const [copiedContact, setCopiedContact] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<'Lost' | 'Found'>('Lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Academic Block 2, Lab 402');
  const [contact, setContact] = useState(user?.email || '');
  const [category, setCategory] = useState('Electronics');
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const query = filterType !== 'All' ? `?type=${filterType}` : '';
      const res = await apiFetch(`/lost-found${query}`);
      if (res.success && res.items.length > 0) {
        const normalized = res.items.map((i: any) => ({
          ...i,
          contact: i.contact || i.reportedBy?.contact || i.contactInfo || 'tanvir@bup.edu.bd',
          reporterName: i.reporterName || i.reportedBy?.name || i.reportedByName || 'BUP Student/Faculty',
          reporterId: i.reporterId || i.reportedBy?.id || i.reportedByUserId,
        }));
        setItems(normalized);
      } else {
        // High-quality campus preset items (10 Lost, 10 Found)
        setItems([
          // 10 Lost Items
          {
            _id: 'lf-lost-1',
            type: 'Lost',
            title: 'Casio Scientific Calculator fx-991EX ClassWiz',
            description: 'Left on desk 4 in ICT Software Lab 1 after Data Structures laboratory session.',
            location: 'Academic Block 2, Room 402',
            contact: 'tanvir@bup.edu.bd',
            reporterName: 'Munshi Tanvir Hossain',
            reporterRole: 'Student (ICT-2024)',
            createdAt: new Date().toISOString(),
            status: 'OPEN',
            category: 'Electronics',
          },
          {
            _id: 'lf-lost-2',
            type: 'Lost',
            title: 'BUP Student RFID Identity Card & Navy Lanyard (Roll: 24549010064)',
            description: 'Misplaced somewhere between Vista Cafeteria and Central Library 2nd floor.',
            location: 'Vista Cafeteria / Library',
            contact: 'rafi@bup.edu.bd',
            reporterName: 'Safaytul Islam Rafi',
            reporterRole: 'Student (CSE)',
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            status: 'OPEN',
            category: 'Cards & ID',
          },
          {
            _id: 'lf-lost-3',
            type: 'Lost',
            title: 'Lenovo Legion 135W USB-C Slim Laptop Charger',
            description: 'Forgotten plugged in near presentation podium after FST seminar presentation.',
            location: 'ICT Seminar Room 304',
            contact: 'nishi.ict@bup.edu.bd',
            reporterName: 'Nusrat Jahan Nishi',
            reporterRole: 'Student (ICT-2025)',
            createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
            status: 'OPEN',
            category: 'Electronics',
          },
          {
            _id: 'lf-lost-4',
            type: 'Lost',
            title: 'Apple AirPods Pro (2nd Gen) in White MagSafe Case',
            description: 'Left near locker row 3 before evening badminton practice session.',
            location: 'FST Indoor Sports Complex',
            contact: 'mahir.faisal@bup.edu.bd',
            reporterName: 'Mahir Faisal',
            reporterRole: 'Student (ICT-2024)',
            createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
            status: 'OPEN',
            category: 'Accessories',
          },
          {
            _id: 'lf-lost-5',
            type: 'Lost',
            title: 'Spiral Bound SRE & Data Communication Handwritten Lecture Note Khata',
            description: 'Black cover notebook with all midterm diagrams and IEEE ethics notes.',
            location: 'Lakeview Gazebo Bench 3',
            contact: 'sadia.rahman@bup.edu.bd',
            reporterName: 'Sadia Rahman',
            reporterRole: 'Student (BICE-2024)',
            createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
            status: 'OPEN',
            category: 'Documents',
          },
          {
            _id: 'lf-lost-6',
            type: 'Lost',
            title: 'Titan Classic Quartz Watch with Brown Leather Strap',
            description: 'Slipped off during stage rehearsal for cultural week.',
            location: 'Bijoy Auditorium Dressing Room',
            contact: 'anika.tahsin@bup.edu.bd',
            reporterName: 'Anika Tahsin',
            reporterRole: 'Student (BICE-2025)',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            status: 'OPEN',
            category: 'Accessories',
          },
          {
            _id: 'lf-lost-7',
            type: 'Lost',
            title: 'BUP Campus Keyring with 3 Dormitory Keys & Access Fob',
            description: 'Brass keyring with green BUP crest fob and 3 room keys.',
            location: 'Academic Block 1 Ground Floor Lobby',
            contact: 'tahmid.hasan@bup.edu.bd',
            reporterName: 'Tahmid Hasan',
            reporterRole: 'Student (CSE-2024)',
            createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
            status: 'OPEN',
            category: 'Keys',
          },
          {
            _id: 'lf-lost-8',
            type: 'Lost',
            title: 'Logitech MX Master 3S Wireless Mouse (Space Gray)',
            description: 'Left on station 12 after digital signal processing filter simulation.',
            location: 'Digital Signal Processing Lab 408',
            contact: 'farhan.ahmed@bup.edu.bd',
            reporterName: 'Farhan Ahmed',
            reporterRole: 'Student (ICT)',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: 'OPEN',
            category: 'Electronics',
          },
          {
            _id: 'lf-lost-9',
            type: 'Lost',
            title: 'Blue Fastrack Anti-Glare Reading Glasses in Black Hard Case',
            description: 'Left near shelf 4 in the ablution prayer area.',
            location: 'BUP Central Mosque Ablution Area',
            contact: 'kazi.fahim@bup.edu.bd',
            reporterName: 'Kazi Fahim',
            reporterRole: 'Student (ES-2024)',
            createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString(),
            status: 'OPEN',
            category: 'Accessories',
          },
          {
            _id: 'lf-lost-10',
            type: 'Lost',
            title: 'Sandisk Extreme 128GB USB 3.2 Dual Flash Drive',
            description: 'Silver-black dual USB-C/A drive containing operating system lab code.',
            location: 'Computer Center Lab 2',
            contact: 'sakib.hasan@bup.edu.bd',
            reporterName: 'Sakib Hasan',
            reporterRole: 'Student (ICT-2024)',
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            status: 'OPEN',
            category: 'Electronics',
          },

          // 10 Found Items
          {
            _id: 'lf-found-1',
            type: 'Found',
            title: 'Wireless Bluetooth Earbuds Case (Navy Blue Baseus)',
            description: 'Handed over to Security Post near Main Gate after evening sports session.',
            location: 'Main Gate Security Office',
            contact: 'security@bup.edu.bd',
            reporterName: 'Campus Security Desk',
            reporterRole: 'Security Officer',
            createdAt: new Date().toISOString(),
            status: 'RESOLVED',
            category: 'Accessories',
          },
          {
            _id: 'lf-found-2',
            type: 'Found',
            title: 'Parker Stainless Steel Fountain Pen with Silver Clip',
            description: 'Found on faculty podium after morning Web Technologies lecture.',
            location: 'Academic Block 2, Room 502',
            contact: 'sumansaha@bup.edu.bd',
            reporterName: 'Assistant Professor Suman Saha',
            reporterRole: 'Faculty (ICT)',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            status: 'OPEN',
            category: 'Stationery',
          },
          {
            _id: 'lf-found-3',
            type: 'Found',
            title: 'HP Pavilion 65W Blue-Pin Laptop AC Power Adapter',
            description: 'Found plugged into wall socket at reading desk 14.',
            location: 'Central Library 3rd Floor Study Cubicle 14',
            contact: 'library@bup.edu.bd',
            reporterName: 'Central Library Helpdesk',
            reporterRole: 'Library Staff',
            createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
            status: 'OPEN',
            category: 'Electronics',
          },
          {
            _id: 'lf-found-4',
            type: 'Found',
            title: 'Student Wallet containing BUP Smart Card & Bus Pass (Name: Abrar Fahim)',
            description: 'Deposited at cafeteria counter by student volunteer. Please claim with ID proof.',
            location: 'Vista Cafeteria Counter 2',
            contact: 'cafeteria@bup.edu.bd',
            reporterName: 'Vista Cafeteria Manager',
            reporterRole: 'Campus Service',
            createdAt: new Date(Date.now() - 3600000 * 11).toISOString(),
            status: 'OPEN',
            category: 'Cards & ID',
          },
          {
            _id: 'lf-found-5',
            type: 'Found',
            title: 'Texas Instruments TI-84 Plus CE Graphing Calculator',
            description: 'Found under bench seat in row 4 after ICE lecture.',
            location: 'FST Lecture Theater 1',
            contact: 'nazneen@bup.edu.bd',
            reporterName: 'Assistant Professor Nazneen Akhter',
            reporterRole: 'Faculty (ICT)',
            createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
            status: 'OPEN',
            category: 'Electronics',
          },
          {
            _id: 'lf-found-6',
            type: 'Found',
            title: 'Matte Black Metal Umbrella with BUP Insignia',
            description: 'Kept in stand near east staircase entrance on rainy morning.',
            location: 'Academic Block 1 East Staircase',
            contact: 'admin.office@bup.edu.bd',
            reporterName: 'FST Administrative Office',
            reporterRole: 'Administration',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            status: 'OPEN',
            category: 'Accessories',
          },
          {
            _id: 'lf-found-7',
            type: 'Found',
            title: 'Sony WH-CH520 Wireless Over-Ear Headphones (Beige)',
            description: 'Found left behind on armrest after National Seminar concluded.',
            location: 'Bijoy Auditorium Row F Seat 12',
            contact: 'auditorium@bup.edu.bd',
            reporterName: 'Bijoy Auditorium Caretaker',
            reporterRole: 'Facilities Staff',
            createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
            status: 'OPEN',
            category: 'Electronics',
          },
          {
            _id: 'lf-found-8',
            type: 'Found',
            title: 'Black Leather Cardholder with Dutch-Bangla Bank Nexus Card',
            description: 'Found beside the basketball court perimeter bench.',
            location: 'BUP Basketball Ground Bench',
            contact: 'sports.council@bup.edu.bd',
            reporterName: 'Physical Education Office',
            reporterRole: 'Sports Officer',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: 'OPEN',
            category: 'Cards & ID',
          },
          {
            _id: 'lf-found-9',
            type: 'Found',
            title: 'Green Hydro Flask Water Bottle (Insulated 750ml)',
            description: 'Found on windowsill of 4th floor corridor near faculty lounge.',
            location: 'FST Academic Block 2, Corridor 4th Floor',
            contact: 'care.desk@bup.edu.bd',
            reporterName: 'Floor Maintenance Supervisor',
            reporterRole: 'Support Staff',
            createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString(),
            status: 'OPEN',
            category: 'Accessories',
          },
          {
            _id: 'lf-found-10',
            type: 'Found',
            title: 'Microcontroller Kit (Arduino Uno R3 + Breadboard in Box)',
            description: 'Found on worktable 6 after Robotics Club training workshop.',
            location: 'Hardware & Robotics Lab 405',
            contact: 'robotics.club@bup.edu.bd',
            reporterName: 'BUP Robotics Club President',
            reporterRole: 'Club Executive',
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            status: 'OPEN',
            category: 'Electronics',
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filterType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await apiFetch('/lost-found', {
        method: 'POST',
        body: JSON.stringify({ type, title, description, location, contact, itemCategory: category }),
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartChatWithContact = (item: any) => {
    const contactInfo = {
      id: item.reporterId || item._id,
      name: item.reporterName || 'Item Owner',
      role: item.type === 'Found' ? 'Item Finder' : 'Item Owner',
      department: item.location || 'BUP Campus',
      avatar: item.reporterAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
      lastMessage: `Regarding Lost & Found: ${item.title}`,
      time: 'Now',
      active: true,
    };

    if (onOpenChat) {
      onOpenChat(contactInfo);
    } else if (onNavigateTab) {
      onNavigateTab('messages');
    } else {
      // Fallback: copy and open mailto
      window.location.href = `mailto:${item.contact}?subject=BUP Social Lost & Found: ${encodeURIComponent(item.title)}`;
    }
    setContactModalItem(null);
  };

  const handleCopyContact = (info: string) => {
    navigator.clipboard.writeText(info);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
              CAMPUS SECURITY & RECOVERY
            </span>
            <span className="text-xs text-slate-400 font-mono">BUP Lost & Found Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Campus Lost & Found Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Report misplaced campus belongings, calculators, ID cards, and verify recovered items.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-motion btn-bup-primary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 shadow-md shadow-bup-700/20"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>Report Item (Lost or Found)</span>
        </button>
      </div>

      {/* 2. Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {['All', 'Lost', 'Found'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`btn-motion px-4 py-2 rounded-xl font-bold transition-all border ${
                filterType === t
                  ? 'btn-bup-primary text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              {t === 'All' ? 'All Items' : `${t} Items`}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, location..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* 3. Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-bup-600" />
            <span>Reported Items Registry ({filteredItems.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Direct peer communication via Chatbox</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading registry...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No items currently recorded in this category.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isLost = item.type === 'Lost';
              const isResolved = item.status === 'RESOLVED';

              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-bup-500 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          isLost
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {item.type?.toUpperCase()} ITEM
                      </span>

                      {isResolved && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                          ✓ RECOVERED
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-bup-600" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-blue-600 dark:text-blue-400">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {item.contact}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setContactModalItem(item)}
                    className="btn-motion btn-bup-primary px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 text-center flex items-center justify-center gap-1.5 shadow-md shadow-bup-700/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Contact Finder / Owner</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Contact Owner Modal (Fixes Non-working Contact Button) */}
      {contactModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-bup-100 dark:bg-bup-950 flex items-center justify-center text-bup-700 dark:text-bup-300">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Contact {contactModalItem.type === 'Found' ? 'Finder' : 'Owner'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-[220px]">
                    {contactModalItem.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setContactModalItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Owner Info Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  {contactModalItem.reporterName || 'BUP Campus Member'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-bup-100 dark:bg-bup-950 text-bup-800 dark:text-bup-300">
                  {contactModalItem.reporterRole || 'Registered Member'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-bup-600 shrink-0" />
                <span>{contactModalItem.location}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/50">
                <span className="font-mono text-blue-600 dark:text-blue-400 text-[11px] truncate mr-2">
                  {contactModalItem.contact}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyContact(contactModalItem.contact)}
                  className="p-1 px-2 rounded-lg bg-white dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-200 hover:text-bup-700 flex items-center gap-1 shadow-xs border border-slate-200 dark:border-slate-600 shrink-0"
                >
                  {copiedContact ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedContact ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Direct Communication Channels */}
            <div className="space-y-2 pt-1">
              {/* Option 0: View Campus Profile */}
              {onViewProfile && (
                <button
                  type="button"
                  onClick={() => {
                    const reporter = {
                      name: contactModalItem.reporterName || 'BUP Member',
                      role: contactModalItem.reporterRole || 'student',
                      department: 'BUP Campus Member',
                    };
                    setContactModalItem(null);
                    onViewProfile(reporter);
                  }}
                  className="w-full btn-motion p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-bup-500 shadow-xs"
                >
                  <ExternalLink className="w-4 h-4 text-bup-600" />
                  <span>View Member's Campus Profile</span>
                </button>
              )}

              {/* Option 1: Live Chat via BUP Chatbox */}
              <button
                type="button"
                onClick={() => handleStartChatWithContact(contactModalItem)}
                className="w-full btn-motion btn-bup-primary p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-bup-700/20"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>Chat Instantly via BUP Chatbox</span>
              </button>

              {/* Option 2: Send Email */}
              <a
                href={`mailto:${contactModalItem.contact}?subject=${encodeURIComponent(
                  `BUP Social Lost & Found: Inquiry regarding "${contactModalItem.title}"`
                )}&body=${encodeURIComponent(
                  `Salam ${contactModalItem.reporterName || ''},\n\nI am contacting you regarding your BUP Lost & Found report for: "${contactModalItem.title}" (Location: ${contactModalItem.location}).\n\nPlease let me know if this item is still available.\n\nThank you!`
                )}`}
                className="w-full btn-motion p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Open in Email Application</span>
              </a>

              {/* Option 3: Phone / SMS if contact has digits */}
              {/\d{5,}/.test(contactModalItem.contact) && (
                <a
                  href={`tel:${contactModalItem.contact.replace(/[^\d+]/g, '')}`}
                  className="w-full btn-motion p-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call / Direct SMS ({contactModalItem.contact})</span>
                </a>
              )}
            </div>

            <p className="text-[10px] text-center text-slate-400 pt-1">
              BUP Campus Security: Always meet in public campus zones like Academic Block or Vista Cafeteria.
            </p>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Report Belonging to BUP Registry
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="flex gap-2">
                {['Lost', 'Found'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t as any)}
                    className={`btn-motion flex-1 py-2 rounded-xl font-bold transition-all border ${
                      type === t
                        ? t === 'Lost'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    I {t} Something
                  </button>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Item Title / Model</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Casio Calculator, ID Card, Notebook..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Details & Clues</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe color, stickers, distinct markings..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Campus Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Block 2, Lab 402"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Email / Phone</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. student@bup.edu.bd"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-motion btn-bup-primary px-5 py-2 rounded-xl text-white font-bold disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post to Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
