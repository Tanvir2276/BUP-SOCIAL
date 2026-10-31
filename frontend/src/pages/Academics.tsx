import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  Megaphone,
  PlusCircle,
  FileText,
  Clock,
  MapPin,
  UserCheck,
  AlertTriangle,
  Building,
  CheckCircle,
  ShieldCheck,
  Award,
  Users,
  Search,
  Download,
  Calendar,
  Calculator,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CreateNoticeModal } from '../components/CreateNoticeModal';

// Official BUP FST Faculty Directory (from https://bup.edu.bd/faculty_home/3)
const FST_FACULTY_LIST = [
  {
    name: 'Brigadier General Sufi Md Ataur Rahman, ndc, psc',
    role: 'Dean, Faculty of Science & Technology (FST)',
    dept: 'Faculty of Science & Technology',
    email: 'dean.fst@bup.edu.bd',
    specialty: 'Engineering Governance, Strategic Defense Technology & Research',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    room: 'Block 2, Dean Complex, Room 501',
    badge: 'Dean of Faculty',
  },
  {
    name: 'Associate Professor Dr. Md. Sabir Hossain',
    role: 'Chairman & Associate Professor',
    dept: 'Department of Computer Science & Engineering (CSE)',
    email: 'sabir@bup.edu.bd',
    specialty: 'Distributed Computing, Cloud Security & Computer Vision',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
    room: 'Block 1, Chairman Office, Room 401',
    badge: 'Dept Chairman',
  },
  {
    name: 'Assistant Professor Nazneen Akhter',
    role: 'Assistant Professor & Coordinator',
    dept: 'Department of Information & Communication Technology (ICT)',
    email: 'nazneen@bup.edu.bd',
    specialty: 'Data Structures, Software Architecture & High-Speed Networks',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    room: 'Block 2, Faculty Wing, Room 408',
    badge: 'Supervisor',
  },
  {
    name: 'Assistant Professor Suman Saha',
    role: 'Assistant Professor',
    dept: 'Department of Information & Communication Technology (ICT)',
    email: 'sumansaha@bup.edu.bd',
    specialty: 'Digital Electronics, Embedded IoT Systems & Microcontrollers',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    room: 'Block 2, Room 410',
    badge: 'Co-Supervisor',
  },
  {
    name: 'Assistant Professor Dr. Kazi Abu Taher',
    role: 'Assistant Professor',
    dept: 'Department of Computer Science & Engineering (CSE)',
    email: 'taher@bup.edu.bd',
    specialty: 'Relational Database Theory, Normalization & Cyber Threat Modeling',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    room: 'Block 1, Room 304',
    badge: 'Faculty',
  },
];

// Official FST Research Publications (Journal of FST - JFST)
const FST_RESEARCH_PAPERS = [
  {
    id: 'p1',
    title: 'Deep Convolutional Neural Networks for Automated Crop Disease Diagnosis in Deltaic Agriculture',
    authors: 'Dr. Md. Sabir Hossain, Asst. Prof. Nazneen Akhter, Safaytul Islam Rafi',
    journal: 'Journal of Faculty of Science and Technology (JFST), Vol. 4, Issue 2',
    date: 'Published 2026',
    doi: '10.5281/zenodo.bup.fst.2026.104',
    tags: ['Machine Learning', 'Computer Vision', 'Agriculture IoT'],
    downloadUrl: '#',
  },
  {
    id: 'p2',
    title: 'Zero-Knowledge Cryptographic Protocols for Decentralized University Academic Transcript Verification',
    authors: 'Munshi Tanvir Hossain, Asst. Prof. Suman Saha',
    journal: 'IEEE International Conference on Cyber Security & Trust (ICCST)',
    date: 'Published 2026',
    doi: '10.1109/ICCST.2026.982',
    tags: ['Cryptography', 'AES-GCM', 'Zero-Knowledge Proofs'],
    downloadUrl: '#',
  },
  {
    id: 'p3',
    title: 'Spatial Remote Sensing and IoT Water Quality Telemetry Along the Turag River Delta',
    authors: 'Sulayman Akhand Rahul, Dept of Environmental Science (FST)',
    journal: 'Journal of Environmental Management & Deltaic Studies',
    date: 'Published 2025',
    doi: '10.1016/j.envman.2025.109',
    tags: ['GIS & Remote Sensing', 'Water Quality', 'Environmental Modeling'],
    downloadUrl: '#',
  },
];

export const Academics: React.FC = () => {
  const { user } = useAuth();

  // Active top tab in Academics: 'courses' | 'faculty' | 'research' | 'admissions' | 'cgpa'
  const [academicTab, setAcademicTab] = useState<'courses' | 'faculty' | 'research' | 'admissions' | 'cgpa'>('courses');

  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState('ICT');
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('Section A');
  const [notices, setNotices] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingNotices, setLoadingNotices] = useState(true);

  // Notice modal
  const [createNoticeModalOpen, setCreateNoticeModalOpen] = useState(false);

  // CGPA Calculator State
  const [cgpaCourses, setCgpaCourses] = useState([
    { name: 'Data Structures (ICT-2201)', credit: 3.0, gradePoint: 4.0 },
    { name: 'Data Structures Lab (ICT-2202)', credit: 1.5, gradePoint: 4.0 },
    { name: 'Digital Electronics (ICT-2203)', credit: 3.0, gradePoint: 3.75 },
    { name: 'Database Systems (CSE-3101)', credit: 3.0, gradePoint: 3.75 },
    { name: 'Discrete Math (ICT-1201)', credit: 3.0, gradePoint: 4.0 },
  ]);

  const isFaculty = user?.role === 'faculty';
  const isAdmin = user?.role === 'admin';

  // 1. Fetch departments
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await apiFetch('/departments');
        if (res.success && res.departments.length > 0) {
          setDepartments(res.departments);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchDepts();
  }, []);

  // 2. Fetch courses for department
  const fetchCourses = async (deptCode: string) => {
    setLoadingCourses(true);
    try {
      const res = await apiFetch(`/departments/${deptCode}/courses`);
      if (res.success && res.courses.length > 0) {
        setCourses(res.courses);
        setSelectedCourse(res.courses[0]);
      } else {
        setCourses([]);
        setSelectedCourse(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses(selectedDept);
  }, [selectedDept]);

  // 3. Fetch segregated notices for current course & section
  const fetchNotices = async () => {
    setLoadingNotices(true);
    try {
      const courseQuery = selectedCourse ? `&courseCode=${selectedCourse.code}` : '';
      const res = await apiFetch(
        `/notices?departmentCode=${selectedDept}${courseQuery}&sectionName=${selectedSection}`
      );
      if (res.success) {
        setNotices(res.notices);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNotices(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [selectedDept, selectedCourse, selectedSection]);

  // Calculate CGPA
  const totalCredits = cgpaCourses.reduce((sum, c) => sum + c.credit, 0);
  const totalGradePoints = cgpaCourses.reduce((sum, c) => sum + c.credit * c.gradePoint, 0);
  const calculatedCgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-5">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
              FACULTY OF SCIENCE & TECHNOLOGY (FST)
            </span>
            <span className="text-xs text-slate-400 font-mono">Academic Portal • BUP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Academics, Notices & Research Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Official FST course catalogs, section-wise faculty notices, peer-reviewed research papers, and admission circulars.
          </p>
        </div>

        {/* Action button */}
        {(isFaculty || isAdmin) && (
          <button
            onClick={() => setCreateNoticeModalOpen(true)}
            className="btn-motion btn-bup-primary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 shadow-md shadow-bup-700/20"
          >
            <Megaphone className="w-4 h-4 text-amber-300" />
            <span>Publish Notice as Faculty</span>
          </button>
        )}
      </div>

      {/* 2. Top Academic Navigation Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'courses', label: 'Courses & Notices', icon: BookOpen },
          { id: 'faculty', label: 'FST Faculty Directory', icon: UserCheck },
          { id: 'research', label: 'Research & Publications', icon: FileText },
          { id: 'admissions', label: 'Admission Circulars', icon: GraduationCap },
          { id: 'cgpa', label: 'CGPA Calculator', icon: Calculator },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = academicTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAcademicTab(tab.id as any)}
              className={`btn-motion flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold whitespace-nowrap border transition-all ${
                active
                  ? 'btn-bup-primary text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-bup-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COURSES & SECTION NOTICES */}
      {academicTab === 'courses' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Department Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-bup-600" /> Select Academic Department:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { code: 'ICT', name: 'Dept of ICT (FST)' },
                { code: 'CSE', name: 'Dept of CSE (FST)' },
                { code: 'ENV', name: 'Dept of Environmental Science (FST)' },
                { code: 'DS', name: 'Dept of Data Science (FST)' },
                { code: 'BBA', name: 'Business Admin (FBS)' },
              ].map((dept) => (
                <button
                  key={dept.code}
                  onClick={() => setSelectedDept(dept.code)}
                  className={`btn-motion py-2 px-3.5 rounded-xl font-bold whitespace-nowrap border transition-all ${
                    selectedDept === dept.code
                      ? 'bg-bup-700 text-white border-bup-700 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Courses on Left (5 Cols), Course Detail & Section Notices on Right (7 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Department Courses */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                  {selectedDept} Course Offerings ({courses.length})
                </h3>
              </div>

              {loadingCourses ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="p-6 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  No courses found for this department.
                </div>
              ) : (
                <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                  {courses.map((course) => {
                    const isSelected = selectedCourse?.code === course.code;
                    return (
                      <div
                        key={course.code}
                        onClick={() => setSelectedCourse(course)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/90 dark:bg-blue-950/40 border-bup-600 ring-2 ring-bup-600/20 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black text-bup-700 dark:text-blue-400">
                            {course.code}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {course.credits} Credits
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1 leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {course.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Selected Course Info & Notices */}
            <div className="lg:col-span-7 space-y-4">
              {selectedCourse && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-bup-700 dark:text-blue-400">
                          {selectedCourse.code}
                        </span>
                        <span className="text-xs text-slate-400">• {selectedCourse.semester}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {selectedCourse.title}
                      </h3>
                    </div>

                    {/* Section Filter Switcher */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
                      {['Section A', 'Section B', 'ALL'].map((sec) => (
                        <button
                          key={sec}
                          onClick={() => setSelectedSection(sec)}
                          className={`btn-motion px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            selectedSection === sec
                              ? 'bg-bup-700 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {sec === 'ALL' ? 'All Sections' : sec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section Schedule & Instructor Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                        <Clock className="w-3.5 h-3.5 text-bup-600" />
                        <span className="font-semibold">Schedule:</span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {selectedSection === 'Section B' ? 'Mon & Wed 09:00 AM - 10:30 AM' : 'Sun & Tue 10:30 AM - 12:00 PM'}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-bup-600" />
                        <span className="font-semibold">Room & Location:</span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Academic Block 2, Room {selectedSection === 'Section B' ? '405' : '402'}
                      </p>
                    </div>
                  </div>

                  {/* Segregated Notices List */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Megaphone className="w-3.5 h-3.5 text-amber-500" />
                        <span>Notices for {selectedSection} ({notices.length})</span>
                      </h4>
                    </div>

                    {loadingNotices ? (
                      <div className="py-6 text-center text-xs text-slate-400">Loading notices...</div>
                    ) : notices.length === 0 ? (
                      <div className="py-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                        No active notices published for {selectedSection}.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notices.map((n) => (
                          <div
                            key={n._id}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  n.urgency === 'urgent'
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {n.category} • {n.urgency?.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Scope: {n.sectionName}
                              </span>
                            </div>

                            <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {n.title}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                              {n.content}
                            </p>

                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
                              <span>By: {n.authorName} ({n.authorDesignation || 'Faculty'})</span>
                              <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FST FACULTY DIRECTORY (Req 7) */}
      {academicTab === 'faculty' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Faculty of Science and Technology (FST) Leadership & Supervisors
            </h3>
            <span className="text-xs text-slate-400">Source: https://bup.edu.bd/faculty_home/3</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FST_FACULTY_LIST.map((fac, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-bup-500 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-bup-700 text-white font-bold overflow-hidden shrink-0 shadow-md">
                  <img src={fac.avatar} alt={fac.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {fac.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{fac.room}</span>
                  </div>

                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {fac.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-bup-700 dark:text-blue-400">
                    {fac.role}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    <strong>Specialization:</strong> {fac.specialty}
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono mt-1 truncate">
                    ✉️ {fac.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESEARCH & PUBLICATIONS (Req 7) */}
      {academicTab === 'research' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Journal of Faculty of Science and Technology (JFST) & Lab Papers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peer-reviewed research published by BUP FST faculty members & students.
              </p>
            </div>
            <a
              href="https://bup.edu.bd"
              target="_blank"
              rel="noreferrer"
              className="btn-motion btn-bup-gold text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
            >
              Call for Papers JFST Vol 5 ↗
            </a>
          </div>

          <div className="space-y-3">
            {FST_RESEARCH_PAPERS.map((paper) => (
              <div
                key={paper.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-bup-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {paper.journal} • {paper.date}
                  </span>
                  <span className="font-mono text-[9px] text-blue-600 dark:text-blue-400 font-semibold">
                    DOI: {paper.doi}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {paper.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <strong>Authors:</strong> {paper.authors}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {paper.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Opening PDF manuscript: ${paper.title}`)}
                    className="btn-motion px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-bup-50 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-bup-600" />
                    <span>Download Paper (PDF)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADMISSION CIRCULARS (Req 8) */}
      {academicTab === 'admissions' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Main Admission Showcase Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-bup-navy via-bup-900 to-blue-900 text-white shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white">
                LIVE ADMISSION CIRCULAR
              </span>
              <span className="text-xs text-blue-200">Session 2026-2027</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black">
              BUP Undergraduate Admission: Faculty of Science and Technology (FST)
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed max-w-2xl">
              Programs: B.Sc. in Information & Communication Technology (ICT), B.Sc. in Computer Science & Engineering (CSE), and B.Sc. in Environmental Science (ES).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                <span className="text-slate-300 block text-[10px]">Online Application Window</span>
                <strong className="text-white text-sm">15 Nov - 20 Dec 2026</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                <span className="text-slate-300 block text-[10px]">Written Test Date</span>
                <strong className="text-amber-300 text-sm">16 January 2027</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                <span className="text-slate-300 block text-[10px]">Exam Subjects</span>
                <strong className="text-white text-sm">Math, Physics, Chem, Eng</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://admission.bup.edu.bd"
                target="_blank"
                rel="noreferrer"
                className="btn-motion btn-bup-gold text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <span>Apply Online via admission.bup.edu.bd</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://bup.edu.bd"
                target="_blank"
                rel="noreferrer"
                className="btn-motion bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2"
              >
                <span>Download Prospectus</span>
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Postgraduate Admission Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-bup-600" />
              <span>Postgraduate Professional Masters Admission (Spring 2026 Intake)</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              FST offers specialized professional Masters for industry engineers and tech leaders:
              <br />
              • Master in Information and Communication Technology (MICT)
              <br />
              • Master in Computer Science and Engineering (MCSE)
              <br />
              • Master in Information Systems Security (MISS)
              <br />
              • M.Sc. in Environmental Science & Management (MESM)
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium">Application Deadline: 25 December 2026</span>
              <a
                href="https://bup.edu.bd"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-bup-700 dark:text-blue-400 hover:underline"
              >
                View Circular Details ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORKABLE INTERACTIVE CGPA CALCULATOR (User Req #4) */}
      {academicTab === 'cgpa' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-bup-600" />
                <span>BUP Semester GPA & Cumulative CGPA Calculator</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select official BUP department courses, adjust credits (0.75 - 4.0), and calculate exact grade points based on official BUP grading ordinance.
              </p>
            </div>

            {/* Calculated Result Card */}
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-bup-700 via-blue-700 to-indigo-800 text-white flex items-center gap-4 shadow-lg shadow-bup-700/20 shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold block text-blue-200">
                  Semester GPA
                </span>
                <span className="text-2xl sm:text-3xl font-black">{calculatedCgpa}</span>
                <span className="text-xs text-blue-200"> / 4.00</span>
              </div>
              <div className="border-l border-white/20 pl-3">
                <span className="text-[10px] uppercase tracking-wider font-bold block text-blue-200">Academic Standing</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 inline-block mt-0.5">
                  {Number(calculatedCgpa) >= 3.75
                    ? '🌟 First Class (Distinction)'
                    : Number(calculatedCgpa) >= 3.0
                    ? '✓ First Class'
                    : Number(calculatedCgpa) >= 2.5
                    ? 'Second Class'
                    : 'Passing'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Enrolled Course Roster ({cgpaCourses.length} Courses):
            </span>

            <button
              type="button"
              onClick={() => {
                setCgpaCourses([
                  ...cgpaCourses,
                  { name: 'ICE-3205: Web Technologies', credit: 3.0, gradePoint: 4.0 },
                ]);
              }}
              className="btn-motion btn-bup-primary px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
            >
              <span>+ Add Course</span>
            </button>
          </div>

          {/* Courses Dynamic Table */}
          <div className="space-y-2.5">
            {cgpaCourses.map((c, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:border-bup-400 transition-all"
              >
                {/* Course Name Selection or Custom Text */}
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Course Code & Title:</label>
                  <select
                    value={c.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Auto-suggest default credit if standard lab or theory
                      let defaultCr = c.credit;
                      if (val.includes('Laboratory') || val.includes('Lab')) {
                        defaultCr = val.includes('0.75') ? 0.75 : 1.5;
                      } else if (val.includes('Mathematics') || val.includes('ICE-') || val.includes('CSE-')) {
                        defaultCr = 3.0;
                      }
                      setCgpaCourses((prev) =>
                        prev.map((item, idx) => (idx === i ? { ...item, name: val, credit: defaultCr } : item))
                      );
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="ICE-3201: Microprocessor and Computer Architecture">ICE-3201: Microprocessor and Computer Architecture (3.0 Cr)</option>
                    <option value="ICE-3202: Microprocessor and Computer Architecture Lab">ICE-3202: Microprocessor and Computer Architecture Lab (1.5 Cr)</option>
                    <option value="ICE-3203: Microwave Engineering and Antenna">ICE-3203: Microwave Engineering and Antenna (3.0 Cr)</option>
                    <option value="ICE-3204: Microwave Engineering and Antenna Lab">ICE-3204: Microwave Engineering and Antenna Lab (0.75 Cr)</option>
                    <option value="ICE-3205: Web Technologies">ICE-3205: Web Technologies (3.0 Cr)</option>
                    <option value="ICE-3206: Web Technologies Laboratory">ICE-3206: Web Technologies Laboratory (1.5 Cr)</option>
                    <option value="ICE-3207: Software and Requirement Engineering">ICE-3207: Software and Requirement Engineering (3.0 Cr)</option>
                    <option value="ICE-3208: Software and Requirement Engineering Lab">ICE-3208: Software and Requirement Engineering Lab (1.5 Cr)</option>
                    <option value="ICE-3209: Statistics and Research Methodology">ICE-3209: Statistics and Research Methodology (1.5 Cr)</option>
                    <option value="ICE-2201: Data Structure">ICE-2201: Data Structure (3.0 Cr)</option>
                    <option value="ICE-2202: Data Structure Laboratory">ICE-2202: Data Structure Laboratory (1.5 Cr)</option>
                    <option value="ICE-2203: Database Management System">ICE-2203: Database Management System (3.0 Cr)</option>
                    <option value="ICE-2204: Database Management System Lab">ICE-2204: Database Management System Lab (1.5 Cr)</option>
                    <option value="ICE-2205: Signals and Systems">ICE-2205: Signals and Systems (3.0 Cr)</option>
                    <option value="ICE-2206: Object Oriented Design & Programming-II Lab">ICE-2206: Object Oriented Design & Programming-II Lab (1.5 Cr)</option>
                    <option value="MATH-2207: Mathematics-IV (Vector Analysis & Complex Variables)">MATH-2207: Mathematics-IV (Vector Analysis) (3.0 Cr)</option>
                    <option value="ICE-2207: Computer Network">ICE-2207: Computer Network (3.0 Cr)</option>
                    <option value="ICE-2208: Computer Network Laboratory">ICE-2208: Computer Network Laboratory (0.75 Cr)</option>
                    <option value="ICE-1203: Electronic Devices and Circuit">ICE-1203: Electronic Devices and Circuit (3.0 Cr)</option>
                    <option value="ICE-1204: Electronic Devices and Circuit Lab">ICE-1204: Electronic Devices and Circuit Lab (1.5 Cr)</option>
                    <option value="ICE-1205: Structured Programming">ICE-1205: Structured Programming (3.0 Cr)</option>
                    <option value="ICE-1206: Structured Programming Lab">ICE-1206: Structured Programming Lab (1.5 Cr)</option>
                    <option value="MATH-1205: Mathematics-II (Differential Equations)">MATH-1205: Mathematics-II (Differential Equations) (3.0 Cr)</option>
                    <option value="ENG-1202: Communicative English">ENG-1202: Communicative English (1.5 Cr)</option>
                    <option value="ICE-1207: Discrete Mathematics">ICE-1207: Discrete Mathematics (3.0 Cr)</option>
                    <option value="GED-1203: Statistics and Probability">GED-1203: Statistics and Probability (3.0 Cr)</option>
                    <option value="MICE-5101: Advanced Machine Learning">MICE-5101: Advanced Machine Learning (3.0 Cr)</option>
                    <option value="MICE-5102: Information and Cyber Security">MICE-5102: Information and Cyber Security (3.0 Cr)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  {/* Credit Selector */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Credit Value:</label>
                    <select
                      value={c.credit}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCgpaCourses((prev) =>
                          prev.map((item, idx) => (idx === i ? { ...item, credit: val } : item))
                        );
                      }}
                      className="px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold font-mono outline-none"
                    >
                      <option value={0.75}>0.75 Cr</option>
                      <option value={1.0}>1.00 Cr</option>
                      <option value={1.5}>1.50 Cr</option>
                      <option value={2.0}>2.00 Cr</option>
                      <option value={3.0}>3.00 Cr</option>
                      <option value={4.0}>4.00 Cr</option>
                    </select>
                  </div>

                  {/* Grade Point Selector */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Earned Grade:</label>
                    <select
                      value={c.gradePoint}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCgpaCourses((prev) =>
                          prev.map((item, idx) => (idx === i ? { ...item, gradePoint: val } : item))
                        );
                      }}
                      className="px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold font-mono outline-none"
                    >
                      <option value={4.00}>A+ (4.00) 80%+</option>
                      <option value={3.75}>A (3.75) 75-79%</option>
                      <option value={3.50}>A- (3.50) 70-74%</option>
                      <option value={3.25}>B+ (3.25) 65-69%</option>
                      <option value={3.00}>B (3.00) 60-64%</option>
                      <option value={2.75}>B- (2.75) 55-59%</option>
                      <option value={2.50}>C+ (2.50) 50-54%</option>
                      <option value={2.25}>C (2.25) 45-49%</option>
                      <option value={2.00}>D (2.00) 40-44%</option>
                      <option value={0.00}>F (0.00) Below 40%</option>
                    </select>
                  </div>

                  {/* Delete Course Row */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (cgpaCourses.length <= 1) {
                          alert('At least one course is required in semester GPA calculator.');
                          return;
                        }
                        setCgpaCourses((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                      title="Remove Course"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-950 dark:text-blue-200">
            <div>
              Total Enrolled Credits: <strong className="font-mono text-sm">{totalCredits.toFixed(2)}</strong> | Total Grade Points: <strong className="font-mono text-sm">{totalGradePoints.toFixed(2)}</strong>
            </div>

            <button
              type="button"
              onClick={() => {
                setCgpaCourses([
                  { name: 'ICE-3201: Microprocessor and Computer Architecture', credit: 3.0, gradePoint: 4.0 },
                  { name: 'ICE-3202: Microprocessor and Computer Architecture Lab', credit: 1.5, gradePoint: 4.0 },
                  { name: 'ICE-3205: Web Technologies', credit: 3.0, gradePoint: 3.75 },
                  { name: 'ICE-3206: Web Technologies Laboratory', credit: 1.5, gradePoint: 4.0 },
                  { name: 'ICE-3207: Software and Requirement Engineering', credit: 3.0, gradePoint: 3.75 },
                  { name: 'ICE-3208: Software and Requirement Engineering Lab', credit: 1.5, gradePoint: 4.0 },
                ]);
              }}
              className="text-bup-700 dark:text-blue-400 font-bold hover:underline"
            >
              Reset to Standard BICE Semester Courses ↺
            </button>
          </div>
        </div>
      )}

      {/* Notice Creation Modal for Faculty */}
      <CreateNoticeModal
        isOpen={createNoticeModalOpen}
        onClose={() => setCreateNoticeModalOpen(false)}
        onNoticeCreated={fetchNotices}
      />
    </div>
  );
};
