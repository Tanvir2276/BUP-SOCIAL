import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  RefreshCw,
  Layers,
  Download,
  Bell,
  CheckCircle2,
  Building,
  Sparkles,
  BookOpen,
  Edit3,
  PlusCircle,
  HelpCircle,
  Award,
  FileText,
  Printer,
  ChevronRight,
  Timer,
  X,
  Check,
  Volume2,
  Smartphone,
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Master Class Routine Database from the Official BUP Dept of ICT Schedule (July-Dec 2026)
export interface RoutineSlot {
  id: string;
  batch: string; // 'BICE-2024' | 'BICE-2025' | 'BICE-2026' | 'BICE-2023' | 'MICE-2026'
  section: string; // 'Section A' | 'Section B' | 'All'
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  timeSlot: string; // e.g. '08:30 - 10:00'
  room: string; // e.g. 'ST 504', 'LAB1 Annex', 'ML ST-605'
  courseCode: string;
  courseTitle: string;
  instructor: string;
  instructorEmail?: string;
  statusNote?: string;
}

const MASTER_ICT_ROUTINE: RoutineSlot[] = [
  // =================== SUNDAY ===================
  // BICE-2024 (3rd Year 2nd Sem)
  {
    id: 'sun-b24-1',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 503',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    instructor: 'Lec. Md. Istakiak Adnan Palash',
    instructorEmail: 'adnan@bup.edu.bd',
  },
  {
    id: 'sun-b24-2',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 504',
    courseCode: 'ICE-3207',
    courseTitle: 'Software and Requirement Engineering',
    instructor: 'Asst. Prof. Nazneen Akter',
    instructorEmail: 'nazneen@bup.edu.bd',
  },
  {
    id: 'sun-b24-3',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 503',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    instructor: 'Lec. Md. Istakiak Adnan Palash',
    instructorEmail: 'adnan@bup.edu.bd',
  },
  {
    id: 'sun-b24-4',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '10:15 - 01:15 PM',
    room: 'LAB1 Annex',
    courseCode: 'ICE-3208',
    courseTitle: 'Software and Requirement Engineering Laboratory',
    instructor: 'Asst. Prof. Nazneen Akhter + Asst. Prof. Suman Saha',
    instructorEmail: 'nazneen@bup.edu.bd',
  },
  {
    id: 'sun-b24-5',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '02:00 - 05:00 PM',
    room: 'LAB1 Annex',
    courseCode: 'ICE-3208',
    courseTitle: 'Software and Requirement Engineering Laboratory',
    instructor: 'Asst. Prof. Nazneen Akhter + Asst. Prof. Suman Saha',
    instructorEmail: 'nazneen@bup.edu.bd',
  },

  // BICE-2025 (2nd Year 2nd Sem)
  {
    id: 'sun-b25-1',
    batch: 'BICE-2025',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '08:45 - 11:45 AM',
    room: 'LAB2 Annex',
    courseCode: 'ICE-2204',
    courseTitle: 'Database Management System Laboratory',
    instructor: 'Asst. Prof. Aditya Rajbongshi + Lec Samia Ahmed',
    instructorEmail: 'samia@bup.edu.bd',
  },
  {
    id: 'sun-b25-2',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 504',
    courseCode: 'ICE-2207',
    courseTitle: 'Computer Network',
    instructor: 'Lec Sharmeen Jahan Seema',
    instructorEmail: 'sharmeen_seema@bup.edu.bd',
  },
  {
    id: 'sun-b25-3',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '12:00 - 01:30 PM',
    room: 'ST 501',
    courseCode: 'ICE-2203',
    courseTitle: 'Database Management System',
    instructor: 'Asst. Prof. Aditya Rajbongshi',
    instructorEmail: 'Aditya0001@uftb.ac.bd',
  },
  {
    id: 'sun-b25-4',
    batch: 'BICE-2025',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '12:00 - 01:30 PM',
    room: 'ST 504',
    courseCode: 'ICE-2207',
    courseTitle: 'Computer Network',
    instructor: 'Lec Sharmeen Jahan Seema',
    instructorEmail: 'sharmeen_seema@bup.edu.bd',
  },
  {
    id: 'sun-b25-5',
    batch: 'BICE-2025',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '02:00 - 03:30 PM',
    room: 'ST 501',
    courseCode: 'ICE-2203',
    courseTitle: 'Database Management System',
    instructor: 'Asst. Prof. Aditya Rajbongshi',
    instructorEmail: 'Aditya0001@uftb.ac.bd',
  },

  // BICE-2026 (1st Year 2nd Sem)
  {
    id: 'sun-b26-1',
    batch: 'BICE-2026',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 601',
    courseCode: 'ICE-1205',
    courseTitle: 'Structured Programming',
    instructor: 'Lec. Md. Appel Mahmud Pranto',
    instructorEmail: 'pranto@bup.edu.bd',
  },
  {
    id: 'sun-b26-2',
    batch: 'BICE-2026',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 602',
    courseCode: 'ICE-1207',
    courseTitle: 'Discrete Mathematics',
    instructor: 'Asso. Prof. Dr. Rashed Mazumder',
  },
  {
    id: 'sun-b26-3',
    batch: 'BICE-2026',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 601',
    courseCode: 'MATH-1205',
    courseTitle: 'Mathematics-II (Differential Equations)',
    instructor: 'Prof. Dr. Mohammed Nasir Uddin',
    instructorEmail: 'nasiruddin@bup.edu.bd',
  },
  {
    id: 'sun-b26-4',
    batch: 'BICE-2026',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 602',
    courseCode: 'ICE-1207',
    courseTitle: 'Discrete Mathematics',
    instructor: 'Asso. Prof. Dr. Rashed Mazumder',
  },
  {
    id: 'sun-b26-5',
    batch: 'BICE-2026',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '12:00 - 01:30 PM',
    room: 'ST 601',
    courseCode: 'MATH-1205',
    courseTitle: 'Mathematics-II (Differential Equations)',
    instructor: 'Prof. Dr. Mohammed Nasir Uddin',
    instructorEmail: 'nasiruddin@bup.edu.bd',
  },
  {
    id: 'sun-b26-6',
    batch: 'BICE-2026',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '12:00 - 01:30 PM',
    room: 'ST 602',
    courseCode: 'ICE-1205',
    courseTitle: 'Structured Programming',
    instructor: 'Lec. Md. Appel Mahmud Pranto',
    instructorEmail: 'pranto@bup.edu.bd',
  },

  // BICE-2023 (4th Year 1st Sem)
  {
    id: 'sun-b23-1',
    batch: 'BICE-2023',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 501',
    courseCode: 'ICE-4101',
    courseTitle: 'Software Testing and Maintenance',
    instructor: 'Prof. Dr. Fahima Tabassum',
    instructorEmail: 'fahima@bup.edu.bd',
  },
  {
    id: 'sun-b23-2',
    batch: 'BICE-2023',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 502',
    courseCode: 'ICE-4103',
    courseTitle: 'Information, Network and Software Security',
    instructor: 'Prof. Dr. Saeed Mahmud Ullah',
  },
  {
    id: 'sun-b23-3',
    batch: 'BICE-2023',
    section: 'Section B',
    day: 'Sunday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 501',
    courseCode: 'ICE-4101',
    courseTitle: 'Software Testing and Maintenance',
    instructor: 'Prof. Dr. Fahima Tabassum',
    instructorEmail: 'fahima@bup.edu.bd',
  },
  {
    id: 'sun-b23-4',
    batch: 'BICE-2023',
    section: 'Section A',
    day: 'Sunday',
    timeSlot: '12:00 - 03:00 PM',
    room: 'LAB2 Annex',
    courseCode: 'ICE-4102',
    courseTitle: 'Software Testing and Maintenance Laboratory',
    instructor: 'Prof. Dr. Fahima Tabassum + Lec. Md. Istakiak Adnan',
    instructorEmail: 'fahima@bup.edu.bd',
  },

  // MICE-2026 (Postgraduate)
  {
    id: 'sun-mice-1',
    batch: 'MICE-2026',
    section: 'All',
    day: 'Sunday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 603',
    courseCode: 'MICE-5103',
    courseTitle: 'Big Data Analytics and Design',
    instructor: 'Prof. Dr. Fazlul Hasan Siddiqui',
  },

  // =================== MONDAY ===================
  // BICE-2024
  {
    id: 'mon-b24-1',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Monday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 503',
    courseCode: 'ICE-3207',
    courseTitle: 'Software and Requirement Engineering',
    instructor: 'Asst. Prof. Nazneen Akter',
    instructorEmail: 'nazneen@bup.edu.bd',
  },
  {
    id: 'mon-b24-2',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Monday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 504',
    courseCode: 'ICE-3201',
    courseTitle: 'Microprocessor and Computer Architecture',
    instructor: 'Prof. Dr. Mosabber Uddin Ahmed',
  },
  {
    id: 'mon-b24-3',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Monday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 503',
    courseCode: 'ICE-3209',
    courseTitle: 'Statistics and Research Methodology',
    instructor: 'Prof. Dr. Md Hasinur Rahaman Khan',
  },
  {
    id: 'mon-b24-4',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Monday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 504',
    courseCode: 'ICE-3201',
    courseTitle: 'Microprocessor and Computer Architecture',
    instructor: 'Prof. Dr. Mosabber Uddin Ahmed',
  },
  {
    id: 'mon-b24-5',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Monday',
    timeSlot: '11:45 - 02:30 PM',
    room: 'ML ST-605',
    courseCode: 'ICE-3202',
    courseTitle: 'Microprocessor and Computer Architecture Laboratory',
    instructor: 'Prof. Dr. Mosabber Uddin Ahmed + Asst. Prof. Saiful Islam',
    instructorEmail: 'saifulislam@bup.edu.bd',
  },
  {
    id: 'mon-b24-6',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Monday',
    timeSlot: '02:50 - 05:40 PM',
    room: 'LAB1 Annex',
    courseCode: 'ICE-3206',
    courseTitle: 'Web Technologies Laboratory',
    instructor: 'Lec. Md. Istakiak Adnan + Lec Sharmeen Jahan Seema',
    instructorEmail: 'adnan@bup.edu.bd',
  },

  // BICE-2025
  {
    id: 'mon-b25-1',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Monday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 601',
    courseCode: 'MATH-2207',
    courseTitle: 'Mathematics-IV (Vector Analysis & Complex Variables)',
    instructor: 'Col Mohammed Omar Faruque, PhD (Chairman)',
    instructorEmail: 'chairman.ict@bup.edu.bd',
  },
  {
    id: 'mon-b25-2',
    batch: 'BICE-2025',
    section: 'Section B',
    day: 'Monday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 602',
    courseCode: 'ICE-2201',
    courseTitle: 'Data Structure',
    instructor: 'Lec Samia Ahmed',
    instructorEmail: 'samia@bup.edu.bd',
  },
  {
    id: 'mon-b25-3',
    batch: 'BICE-2025',
    section: 'Section B',
    day: 'Monday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 601',
    courseCode: 'MATH-2207',
    courseTitle: 'Mathematics-IV (Vector Analysis & Complex Variables)',
    instructor: 'Col Mohammed Omar Faruque, PhD (Chairman)',
    instructorEmail: 'chairman.ict@bup.edu.bd',
  },
  {
    id: 'mon-b25-4',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Monday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 602',
    courseCode: 'ICE-2201',
    courseTitle: 'Data Structure',
    instructor: 'Lec Samia Ahmed',
    instructorEmail: 'samia@bup.edu.bd',
  },
  {
    id: 'mon-b25-5',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Monday',
    timeSlot: '12:00 - 02:50 PM',
    room: 'LAB1 Annex',
    courseCode: 'ICE-2206',
    courseTitle: 'Object Oriented Design & Programming-II Lab',
    instructor: 'Lec. Jasiya Fairiz Raisa + Asst. Prof. Md. Shahariar Sarkar',
  },
  {
    id: 'mon-b25-6',
    batch: 'BICE-2025',
    section: 'Section B',
    day: 'Monday',
    timeSlot: '12:00 - 02:50 PM',
    room: 'LAB2 Annex',
    courseCode: 'ICE-2202',
    courseTitle: 'Data Structure Laboratory',
    instructor: 'Lec Samia Ahmed + Lec. Md. Appel Mahmud Pranto',
    instructorEmail: 'samia@bup.edu.bd',
  },

  // BICE-2026
  {
    id: 'mon-b26-1',
    batch: 'BICE-2026',
    section: 'Section B',
    day: 'Monday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 603',
    courseCode: 'ICE-1203',
    courseTitle: 'Electronic Devices and Circuit',
    instructor: 'Col Awal Uddin Ahmed, psc',
    instructorEmail: 'chairman.datascience@bup.edu.bd',
  },
  {
    id: 'mon-b26-2',
    batch: 'BICE-2026',
    section: 'Section A',
    day: 'Monday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 603',
    courseCode: 'ICE-1203',
    courseTitle: 'Electronic Devices and Circuit',
    instructor: 'Col Awal Uddin Ahmed, psc',
    instructorEmail: 'chairman.datascience@bup.edu.bd',
  },
  {
    id: 'mon-b26-3',
    batch: 'BICE-2026',
    section: 'Section B',
    day: 'Monday',
    timeSlot: '12:00 - 02:50 PM',
    room: 'ENT ST-805',
    courseCode: 'ICE-1204',
    courseTitle: 'Electronic Devices and Circuit Laboratory',
    instructor: 'Col Awal Uddin Ahmed, psc + Asst. Prof. Md. Maynul Islam',
  },
  {
    id: 'mon-b26-4',
    batch: 'BICE-2026',
    section: 'Section A',
    day: 'Monday',
    timeSlot: '02:30 - 05:30 PM',
    room: 'ST 603',
    courseCode: 'ENG-1202',
    courseTitle: 'Communicative English',
    instructor: 'Lec. Mohiuddin Ahmmad + Asst. Prof. Saiful Islam',
    instructorEmail: 'saifulislam@bup.edu.bd',
  },

  // =================== TUESDAY (Online / Hybrid) ===================
  {
    id: 'tue-b24-1',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Tuesday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 503',
    courseCode: 'ICE-3203',
    courseTitle: 'Microwave Engineering and Antenna',
    instructor: 'Prof. Dr. Md. Zulfiker Mahmud',
  },
  {
    id: 'tue-b24-2',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Tuesday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 503',
    courseCode: 'ICE-3203',
    courseTitle: 'Microwave Engineering and Antenna',
    instructor: 'Prof. Dr. Md. Zulfiker Mahmud',
  },
  {
    id: 'tue-b25-1',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Tuesday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 601',
    courseCode: 'ICE-2205',
    courseTitle: 'Signals and Systems',
    instructor: 'Asst. Prof. Saiful Islam',
    instructorEmail: 'saifulislam@bup.edu.bd',
  },
  {
    id: 'tue-b25-2',
    batch: 'BICE-2025',
    section: 'Section B',
    day: 'Tuesday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 601',
    courseCode: 'ICE-2205',
    courseTitle: 'Signals and Systems',
    instructor: 'Asst. Prof. Saiful Islam',
    instructorEmail: 'saifulislam@bup.edu.bd',
  },

  // =================== WEDNESDAY ===================
  {
    id: 'wed-b24-1',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Wednesday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 503',
    courseCode: 'ICE-3201',
    courseTitle: 'Microprocessor and Computer Architecture',
    instructor: 'Prof. Dr. Mosabber Uddin Ahmed',
  },
  {
    id: 'wed-b24-2',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Wednesday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 503',
    courseCode: 'ICE-3201',
    courseTitle: 'Microprocessor and Computer Architecture',
    instructor: 'Prof. Dr. Mosabber Uddin Ahmed',
  },
  {
    id: 'wed-b24-3',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Wednesday',
    timeSlot: '11:45 - 02:45 PM',
    room: 'ML ST-605',
    courseCode: 'ICE-3202',
    courseTitle: 'Microprocessor and Computer Architecture Laboratory',
    instructor: 'Prof. Dr. Mosabber Uddin Ahmed + Asst. Prof. Saiful Islam',
    instructorEmail: 'saifulislam@bup.edu.bd',
  },
  {
    id: 'wed-b24-4',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Wednesday',
    timeSlot: '02:00 - 05:00 PM',
    room: 'WML ST-703',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna Laboratory',
    instructor: 'Prof. Dr. Md. Zulfiker Mahmud + Asst. Prof. Md. Maynul Islam',
  },
  {
    id: 'wed-b25-1',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Wednesday',
    timeSlot: '12:00 - 03:00 PM',
    room: 'LAB1 Annex',
    courseCode: 'ICE-2202',
    courseTitle: 'Data Structure Laboratory',
    instructor: 'Lec. Samia Ahmed + Lec. Md. Appel Mahmud Pranto',
    instructorEmail: 'samia@bup.edu.bd',
  },

  // =================== THURSDAY ===================
  {
    id: 'thu-b24-1',
    batch: 'BICE-2024',
    section: 'Section B',
    day: 'Thursday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 501',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    instructor: 'Lec. Md. Istakiak Adnan Palash',
    instructorEmail: 'adnan@bup.edu.bd',
  },
  {
    id: 'thu-b24-2',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Thursday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 501',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    instructor: 'Lec. Md. Istakiak Adnan Palash',
    instructorEmail: 'adnan@bup.edu.bd',
  },
  {
    id: 'thu-b24-3',
    batch: 'BICE-2024',
    section: 'Section A',
    day: 'Thursday',
    timeSlot: '12:00 - 02:50 PM',
    room: 'LAB1 Annex',
    courseCode: 'ICE-3206',
    courseTitle: 'Web Technologies Laboratory',
    instructor: 'Lec. Md. Istakiak Adnan Palash + Lec Sharmeen Jahan Seema',
    instructorEmail: 'adnan@bup.edu.bd',
  },
  {
    id: 'thu-b25-1',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Thursday',
    timeSlot: '08:45 - 11:45 AM',
    room: 'LAB1 Annex',
    courseCode: 'ICE-2204',
    courseTitle: 'Database Management System Laboratory',
    instructor: 'Asst. Prof. Aditya Rajbongshi + Lec Samia Ahmed',
    instructorEmail: 'samia@bup.edu.bd',
  },
  {
    id: 'thu-b25-2',
    batch: 'BICE-2025',
    section: 'Section B',
    day: 'Thursday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 502',
    courseCode: 'ICE-2205',
    courseTitle: 'Signals and Systems',
    instructor: 'Asst. Prof. Saiful Islam',
    instructorEmail: 'saifulislam@bup.edu.bd',
  },
  {
    id: 'thu-b25-3',
    batch: 'BICE-2025',
    section: 'Section A',
    day: 'Thursday',
    timeSlot: '12:00 - 01:30 PM',
    room: 'ST 502',
    courseCode: 'ICE-2205',
    courseTitle: 'Signals and Systems',
    instructor: 'Asst. Prof. Saiful Islam',
    instructorEmail: 'saifulislam@bup.edu.bd',
  },
  {
    id: 'thu-b26-1',
    batch: 'BICE-2026',
    section: 'Section A',
    day: 'Thursday',
    timeSlot: '08:30 - 10:00 AM',
    room: 'ST 503',
    courseCode: 'MATH-1205',
    courseTitle: 'Mathematics-II (Differential Equations)',
    instructor: 'Col Mohammed Omar Faruque, PhD (Chairman)',
    instructorEmail: 'chairman.ict@bup.edu.bd',
  },
  {
    id: 'thu-b26-2',
    batch: 'BICE-2026',
    section: 'Section B',
    day: 'Thursday',
    timeSlot: '10:15 - 11:45 AM',
    room: 'ST 503',
    courseCode: 'MATH-1205',
    courseTitle: 'Mathematics-II (Differential Equations)',
    instructor: 'Col Mohammed Omar Faruque, PhD (Chairman)',
    instructorEmail: 'chairman.ict@bup.edu.bd',
  },
  {
    id: 'thu-b26-3',
    batch: 'BICE-2026',
    section: 'Section A',
    day: 'Thursday',
    timeSlot: '02:50 - 05:40 PM',
    room: 'LAB2 Annex',
    courseCode: 'ICE-1206',
    courseTitle: 'Structured Programming Laboratory',
    instructor: 'Lec Md. Appel Mahmud Pranto + Lec Sharmeen Jahan Seema',
    instructorEmail: 'pranto@bup.edu.bd',
  },
];

// Official Study Materials Available for Instant Download (User Req #4)
const OFFICIAL_STUDY_MATERIALS = [
  {
    id: 'mat-1',
    courseCode: 'ICE-3207',
    courseTitle: 'Software and Requirement Engineering',
    author: 'Asst. Prof. Nazneen Akter',
    fileTitle: 'IEEE 830-1998 Standard SRS Template & Agile User Story Guide.pdf',
    size: '3.4 MB',
    type: 'PDF Document',
    downloads: 412,
  },
  {
    id: 'mat-2',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    author: 'Lec. Md. Istakiak Adnan Palash',
    fileTitle: 'Session 4: Node.js Express REST API & MySQL Connection Pooling.pdf',
    size: '2.1 MB',
    type: 'PDF / Code Pack',
    downloads: 539,
  },
  {
    id: 'mat-3',
    courseCode: 'ICE-3201',
    courseTitle: 'Microprocessor and Computer Architecture',
    author: 'Prof. Dr. Mosabber Uddin Ahmed',
    fileTitle: 'Intel 8086 Instruction Set Architecture & Memory Segmentation Slides.pdf',
    size: '4.8 MB',
    type: 'PDF Lecture Slides',
    downloads: 388,
  },
  {
    id: 'mat-4',
    courseCode: 'ICE-2201',
    courseTitle: 'Data Structure',
    author: 'Lec Samia Ahmed',
    fileTitle: 'Graph Theory Algorithms: BFS, DFS, Dijkstra & Minimum Spanning Tree.pdf',
    size: '1.9 MB',
    type: 'Handwritten Cheat Sheet',
    downloads: 620,
  },
  {
    id: 'mat-5',
    courseCode: 'ICE-2203',
    courseTitle: 'Database Management System',
    author: 'Asst. Prof. Aditya Rajbongshi',
    fileTitle: 'Database Normalization (1NF, 2NF, 3NF, BCNF) & SQL Queries Handout.pdf',
    size: '2.7 MB',
    type: 'PDF Document',
    downloads: 472,
  },
  {
    id: 'mat-6',
    courseCode: 'MATH-2207',
    courseTitle: 'Mathematics-IV (Vector Analysis)',
    author: 'Col Mohammed Omar Faruque, PhD',
    fileTitle: 'Green\'s, Gauss Divergence & Stokes Theorem Formula Sheet.pdf',
    size: '1.5 MB',
    type: 'Formula Sheet',
    downloads: 580,
  },
];

// Online Quizzes for Interactive Assessment (User Req #4)
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface OnlineQuiz {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  facultyName: string;
  durationMinutes: number;
  totalMarks: number;
  deadline: string;
  questions: QuizQuestion[];
}

const INITIAL_QUIZZES: OnlineQuiz[] = [
  {
    id: 'quiz-1',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    title: 'Class Assessment: REST APIs, JWT & Node.js Middleware',
    facultyName: 'Lec. Md. Istakiak Adnan Palash',
    durationMinutes: 10,
    totalMarks: 20,
    deadline: 'Tomorrow, 11:59 PM',
    questions: [
      {
        id: 1,
        question: 'Which HTTP method should be used to partially update an existing resource according to REST conventions?',
        options: ['POST', 'PUT', 'PATCH', 'OPTIONS'],
        correctIndex: 2,
        explanation: 'PATCH is intended for partial modifications to an existing resource, whereas PUT generally replaces the entire resource.',
      },
      {
        id: 2,
        question: 'What is the signature of standard Express.js middleware functions?',
        options: ['(req, res)', '(err, req, res)', '(req, res, next)', '(context, payload)'],
        correctIndex: 2,
        explanation: 'Standard Express middleware accepts three arguments: (req, res, next). Error-handling middleware accepts four: (err, req, res, next).',
      },
      {
        id: 3,
        question: 'In JWT (JSON Web Tokens), which component is cryptographically signed using the secret key?',
        options: ['Header only', 'Payload only', 'Header and Payload', 'Entire Token without Header'],
        correctIndex: 2,
        explanation: 'The signature is calculated by encoding Header + Payload and signing with HMAC-SHA256 or RSA.',
      },
      {
        id: 4,
        question: 'Which MySQL engine in relational databases provides ACID transaction compliance and foreign key constraints?',
        options: ['MyISAM', 'InnoDB', 'Memory', 'CSV'],
        correctIndex: 1,
        explanation: 'InnoDB is the standard ACID-compliant transaction-safe storage engine in MySQL with foreign key referential integrity.',
      },
    ],
  },
  {
    id: 'quiz-2',
    courseCode: 'ICE-3207',
    courseTitle: 'Software and Requirement Engineering',
    title: 'Sprint 2 Quiz: Functional Requirements & Use Case Modeling',
    facultyName: 'Asst. Prof. Nazneen Akter',
    durationMinutes: 15,
    totalMarks: 25,
    deadline: 'Nov 05, 05:00 PM',
    questions: [
      {
        id: 1,
        question: 'What is the standard format for an Agile User Story?',
        options: [
          'Given [Context], When [Action], Then [Result]',
          'As a [User], I want [Feature], So that [Benefit]',
          'Actor -> System -> State Change',
          'Input -> Processing -> Output',
        ],
        correctIndex: 1,
        explanation: 'The standard Agile template is: "As a [role], I want [goal] so that [benefit]."',
      },
      {
        id: 2,
        question: 'In UML Use Case diagrams, what does the <<include>> relationship represent?',
        options: [
          'An optional behavioral flow that executes conditionally',
          'A mandatory sub-task that always executes as part of the base use case',
          'Inheritance between two actors',
          'A hardware interface connection',
        ],
        correctIndex: 1,
        explanation: 'An <<include>> dependency indicates that the behavior of the included usecase is explicitly and always part of the base usecase.',
      },
      {
        id: 3,
        question: 'Which requirement is considered Non-Functional (NFR)?',
        options: [
          'User must be able to log in with BUP email and password',
          'System must respond to search queries within 200 milliseconds under 1,000 concurrent users',
          'User can upload PDF lecture notes up to 25MB',
          'Admin can assign faculty members to courses',
        ],
        correctIndex: 1,
        explanation: 'Response time, scalability, and latency under load are performance-based non-functional requirements.',
      },
    ],
  },
];

export const Routines: React.FC = () => {
  const { user } = useAuth();

  // Active view tab: 'ROUTINE' | 'MATERIALS' | 'QUIZ'
  const [activeTab, setActiveTab] = useState<'ROUTINE' | 'MATERIALS' | 'QUIZ'>('ROUTINE');

  // Routine Filters
  const [selectedBatch, setSelectedBatch] = useState<string>('BICE-2024');
  const [selectedSection, setSelectedSection] = useState<string>(user?.section || 'Section A');
  const [selectedDay, setSelectedDay] = useState<'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'>('Sunday');

  // Master routine state + overrides stored in localStorage
  const [routineList, setRoutineList] = useState<RoutineSlot[]>(MASTER_ICT_ROUTINE);
  const [reminderSet, setReminderSet] = useState<Record<string, boolean>>({});
  const [alarmModalSlot, setAlarmModalSlot] = useState<RoutineSlot | null>(null);
  const [alarmMinutes, setAlarmMinutes] = useState<number>(15);
  const [alarmSound, setAlarmSound] = useState<boolean>(true);
  const [alarmBrowserNotification, setAlarmBrowserNotification] = useState<boolean>(true);
  const [alarmInApp, setAlarmInApp] = useState<boolean>(true);
  const [alarmSuccessMsg, setAlarmSuccessMsg] = useState<string | null>(null);

  // Load saved alarms from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bupsoc_routine_alarms');
      if (stored) {
        setReminderSet(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // Faculty Routine Edit Modal State
  const [editingSlot, setEditingSlot] = useState<RoutineSlot | null>(null);
  const [editRoom, setEditRoom] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editStatusNote, setEditStatusNote] = useState('');

  // Online Quiz State
  const [quizzes, setQuizzes] = useState<OnlineQuiz[]>(INITIAL_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState<OnlineQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds

  // Faculty Create Quiz Modal State
  const [createQuizModalOpen, setCreateQuizModalOpen] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizCourse, setNewQuizCourse] = useState('ICE-3205');
  const [newQuizDuration, setNewQuizDuration] = useState(15);
  const [newQuizTotalMarks, setNewQuizTotalMarks] = useState(20);
  const [newQText, setNewQText] = useState('');
  const [newOpt0, setNewOpt0] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newOpt3, setNewOpt3] = useState('');
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);

  const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday')[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
  ];

  // Load saved routine overrides from localStorage on mount
  useEffect(() => {
    try {
      const overrides = localStorage.getItem('bupsoc_routine_overrides');
      if (overrides) {
        const savedOverrides: Record<string, Partial<RoutineSlot>> = JSON.parse(overrides);
        setRoutineList((prev) =>
          prev.map((slot) => {
            if (savedOverrides[slot.id]) {
              return { ...slot, ...savedOverrides[slot.id] };
            }
            return slot;
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Filter routines by batch, section, and day
  const filteredRoutines = routineList.filter((r) => {
    const matchBatch = r.batch === selectedBatch;
    const matchSection = r.section === selectedSection || r.section === 'All';
    const matchDay = r.day === selectedDay;
    return matchBatch && matchSection && matchDay;
  });

  // Check if current user is faculty of the course or admin
  const isFacultyUser = user?.role === 'faculty' || user?.role === 'admin';

  const canEditSlot = (slot: RoutineSlot) => {
    if (!isFacultyUser) return false;
    // Dean & Chairman can edit all slots
    if (user?.email === 'chairman.ict@bup.edu.bd' || user?.email === 'dean.fst@bup.edu.bd') return true;
    // Specific faculty member matching instructor name or email or preferences
    if (slot.instructorEmail && user?.email === slot.instructorEmail) return true;
    if (user?.name && slot.instructor.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])) return true;
    if (user?.coursePreferences?.includes(slot.courseCode)) return true;
    return false;
  };

  const handleOpenEditSlot = (slot: RoutineSlot) => {
    setEditingSlot(slot);
    setEditRoom(slot.room);
    setEditTimeSlot(slot.timeSlot);
    setEditStatusNote(slot.statusNote || '');
  };

  const handleSaveSlotEdit = () => {
    if (!editingSlot) return;

    const updatedList = routineList.map((slot) => {
      if (slot.id === editingSlot.id) {
        return {
          ...slot,
          room: editRoom,
          timeSlot: editTimeSlot,
          statusNote: editStatusNote.trim() || undefined,
        };
      }
      return slot;
    });

    setRoutineList(updatedList);

    // Save to localStorage
    try {
      const overrides = localStorage.getItem('bupsoc_routine_overrides');
      const savedMap = overrides ? JSON.parse(overrides) : {};
      savedMap[editingSlot.id] = {
        room: editRoom,
        timeSlot: editTimeSlot,
        statusNote: editStatusNote.trim() || undefined,
      };
      localStorage.setItem('bupsoc_routine_overrides', JSON.stringify(savedMap));
    } catch (e) {}

    setEditingSlot(null);
  };

  const playAlarmChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.error('Audio chime error:', e);
    }
  };

  const openAlarmModal = (slot: RoutineSlot) => {
    setAlarmModalSlot(slot);
    setAlarmSuccessMsg(null);
  };

  const handleSaveAlarm = () => {
    if (!alarmModalSlot) return;

    const slotId = alarmModalSlot.id;
    const isNowActive = !reminderSet[slotId];
    const updated = { ...reminderSet, [slotId]: isNowActive };
    setReminderSet(updated);
    localStorage.setItem('bupsoc_routine_alarms', JSON.stringify(updated));

    if (isNowActive) {
      if (alarmSound) playAlarmChime();

      if (alarmBrowserNotification && 'Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      // Add to notifications center storage
      try {
        const storedNotifs = localStorage.getItem('bupsoc_notifications');
        const notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
        notifs.unshift({
          id: `alarm_${slotId}_${Date.now()}`,
          category: 'Classes',
          title: `Class Reminder: ${alarmModalSlot.courseCode}`,
          description: `${alarmModalSlot.courseTitle} scheduled for ${alarmModalSlot.day} at ${alarmModalSlot.timeSlot} in Room ${alarmModalSlot.room}. Reminder set ${alarmMinutes} mins before class.`,
          time: 'Just now',
          unread: true,
          actionLabel: 'View Routine',
        });
        localStorage.setItem('bupsoc_notifications', JSON.stringify(notifs.slice(0, 30)));
      } catch (e) {}

      setAlarmSuccessMsg(`Alarm active! You will be reminded ${alarmMinutes} minutes before class.`);
      setTimeout(() => {
        setAlarmModalSlot(null);
        setAlarmSuccessMsg(null);
      }, 1500);
    } else {
      setAlarmModalSlot(null);
    }
  };

  const handlePrintRoutine = () => {
    window.print();
  };

  // Quiz Timer countdown
  useEffect(() => {
    if (!activeQuiz || quizSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuiz, quizSubmitted]);

  const handleStartQuiz = (quiz: OnlineQuiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setTimeLeft(quiz.durationMinutes * 60);
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let earned = 0;
    const perQ = activeQuiz.totalMarks / activeQuiz.questions.length;

    activeQuiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        earned += perQ;
      }
    });

    setQuizScore(Math.round(earned));
    setQuizSubmitted(true);
  };

  const handleCreateNewQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim() || !newQText.trim()) return;

    const newQuiz: OnlineQuiz = {
      id: 'quiz-' + Date.now(),
      courseCode: newQuizCourse,
      courseTitle: newQuizCourse === 'ICE-3205' ? 'Web Technologies' : 'Software Engineering',
      title: newQuizTitle,
      facultyName: user?.name || 'Course Instructor',
      durationMinutes: Number(newQuizDuration) || 15,
      totalMarks: Number(newQuizTotalMarks) || 20,
      deadline: 'Available Now',
      questions: [
        {
          id: 1,
          question: newQText,
          options: [newOpt0 || 'Option A', newOpt1 || 'Option B', newOpt2 || 'Option C', newOpt3 || 'Option D'],
          correctIndex: newCorrectIdx,
          explanation: 'Official explanation verified by course instructor.',
        },
      ],
    };

    setQuizzes([newQuiz, ...quizzes]);
    setCreateQuizModalOpen(false);
    setNewQuizTitle('');
    setNewQText('');
    alert('Online Quiz created & published successfully to student routine dashboard!');
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40">
              OFFICIAL BUP ICT TIMETABLE
            </span>
            <span className="text-xs text-slate-400 font-mono">July - December 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Routine & Online Assessment Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Department of Information & Communication Technology • Complete batch-wise class schedule, lecture materials & online quiz center.
          </p>
        </div>

        {/* Action Controls: Routine PDF Download & Print */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintRoutine}
            className="btn-motion text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-bup-500"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Schedule</span>
          </button>

          <a
            href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            download="BUP_ICT_Class_Routine_2026.pdf"
            className="btn-motion btn-bup-primary text-xs font-bold text-white flex items-center gap-1.5 px-4 py-2.5 rounded-2xl shadow-md shadow-bup-700/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Routine (PDF)</span>
          </a>
        </div>
      </div>

      {/* 2. Top Main Feature Tabs (User Requirement #4) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'ROUTINE', label: 'Department Class Routine', icon: Calendar },
          { id: 'MATERIALS', label: 'Course Notes & Lecture Materials Hub', icon: BookOpen },
          { id: 'QUIZ', label: 'Faculty Online Quizzes & Class Tests', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn-motion flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-bup-700 text-white border-bup-700 shadow-md shadow-bup-700/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-bup-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: BUP CLASS ROUTINE STREAM WITH FACULTY EDIT & ALARMS    */}
      {/* ============================================================== */}
      {activeTab === 'ROUTINE' && (
        <div className="space-y-4">
          {/* Batch & Section Selectors */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Batch Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="font-bold text-slate-500 shrink-0 mr-1">Batch:</span>
                {[
                  { id: 'BICE-2024', label: 'BICE-2024 (3rd Yr)' },
                  { id: 'BICE-2025', label: 'BICE-2025 (2nd Yr)' },
                  { id: 'BICE-2026', label: 'BICE-2026 (1st Yr)' },
                  { id: 'BICE-2023', label: 'BICE-2023 (4th Yr)' },
                  { id: 'MICE-2026', label: 'MICE-2026 (M.Sc.)' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBatch(b.id)}
                    className={`btn-motion px-3.5 py-1.5 rounded-xl font-bold transition-all border ${
                      selectedBatch === b.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* Section Selector */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 border border-slate-200 dark:border-slate-700">
                {['Section A', 'Section B'].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setSelectedSection(sec)}
                    className={`btn-motion px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSection === sec
                        ? 'btn-bup-primary text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {/* Days Tabs */}
            <div className="flex gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`btn-motion py-2 px-4 rounded-xl font-bold whitespace-nowrap transition-all border ${
                    selectedDay === day
                      ? 'btn-bup-primary text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-bup-500'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Schedule Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-bup-600" />
                <span>
                  {selectedDay} Schedule • {selectedBatch} ({selectedSection})
                </span>
              </h3>
              <span className="text-xs text-slate-400">{filteredRoutines.length} classes scheduled</span>
            </div>

            {filteredRoutines.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 bg-white dark:bg-slate-900">
                No classes scheduled for {selectedDay} ({selectedBatch} {selectedSection}). Free day for laboratory research & project work!
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRoutines.map((slot) => {
                  const hasAlarm = reminderSet[slot.id];
                  const userCanEdit = canEditSlot(slot);

                  return (
                    <div
                      key={slot.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-bup-500 transition-all"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-blue-100 text-bup-900 dark:bg-blue-950 dark:text-blue-300">
                            {slot.courseCode}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">• {slot.section}</span>

                          {slot.statusNote && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                              📢 {slot.statusNote}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                          {slot.courseTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                            <Clock className="w-3.5 h-3.5 text-bup-600" />
                            {slot.timeSlot}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            {slot.room}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {slot.instructor}
                          </span>
                        </div>
                      </div>

                      {/* Right Action Controls: Faculty Edit & Class Alarm */}
                      <div className="flex items-center gap-2 shrink-0">
                        {userCanEdit && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditSlot(slot)}
                            className="btn-motion py-2.5 px-3.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 transition-all"
                            title="Faculty Course Modification"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit Routine</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openAlarmModal(slot)}
                          className={`btn-motion py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            hasAlarm
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-800'
                          }`}
                        >
                          <Bell className={`w-3.5 h-3.5 ${hasAlarm ? 'fill-amber-500 text-amber-500 animate-pulse' : 'text-slate-400'}`} />
                          <span>{hasAlarm ? 'Alarm Active ✓' : 'Set Alarm'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Campus Room & Academic Block 2 Guide */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-bup-600" />
              <span>FST Department of ICT Laboratory Guide</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300 pt-1">
              <div>• <strong>LAB1 & LAB2 Annex:</strong> Software Testing & DB Lab</div>
              <div>• <strong>ML (ST-605):</strong> Microprocessor & Computer Architecture</div>
              <div>• <strong>WML (ST-703):</strong> Wireless & Microwave Engineering Lab</div>
              <div>• <strong>CL (ST-704):</strong> Communication Engineering Lab</div>
              <div>• <strong>ENT (ST-805):</strong> Electronics & Circuit Lab</div>
              <div>• <strong>ST 501 - 504:</strong> Departmental Smart Classrooms</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: COURSE NOTES & LECTURE MATERIALS DOWNLOAD HUB          */}
      {/* ============================================================== */}
      {activeTab === 'MATERIALS' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Official Course Notes & Lecture Materials Hub
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download verified lecture slides, lab manuals, and handwritten study guides uploaded by BUP faculty members.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
              {OFFICIAL_STUDY_MATERIALS.length} Materials Available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OFFICIAL_STUDY_MATERIALS.map((mat) => (
              <div
                key={mat.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-bup-500 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {mat.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{mat.type}</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                    {mat.fileTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Course: <strong className="text-slate-700 dark:text-slate-300">{mat.courseTitle}</strong>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Faculty: <span>{mat.author}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400">{mat.size} • {mat.downloads} downloads</span>

                  <a
                    href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    download={mat.fileTitle}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-motion btn-bup-gold px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Note</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: FACULTY ONLINE QUIZZES & CLASS TESTS (CT) SYSTEM       */}
      {/* ============================================================== */}
      {activeTab === 'QUIZ' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Online Quizzes & Class Tests (CT) Engine</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Faculty-published MCQ assessments, real-time timer, instant automated grading & feedback.
              </p>
            </div>

            {isFacultyUser && (
              <button
                type="button"
                onClick={() => setCreateQuizModalOpen(true)}
                className="btn-motion btn-bup-primary px-4 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-bup-700/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish New Online Quiz</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-bup-500 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-blue-100 text-bup-900 dark:bg-blue-950 dark:text-blue-300">
                      {quiz.courseCode}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-300/40">
                      Deadline: {quiz.deadline}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Course: <strong>{quiz.courseTitle}</strong> • Instructor: <span>{quiz.facultyName}</span>
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Timer className="w-3.5 h-3.5 text-bup-600" />
                      {quiz.durationMinutes} Minutes
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                      {quiz.questions.length} MCQs ({quiz.totalMarks} Marks)
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Automated Grading</span>
                  <button
                    type="button"
                    onClick={() => handleStartQuiz(quiz)}
                    className="btn-motion btn-bup-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Take Online Quiz</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: FACULTY ROUTINE EDIT MODAL                           */}
      {/* ============================================================== */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setEditingSlot(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Faculty Reschedule & Modification
                </h3>
                <p className="text-xs text-slate-500">{editingSlot.courseCode} • {editingSlot.courseTitle}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Room / Laboratory
                </label>
                <input
                  type="text"
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  placeholder="e.g. LAB1 Annex or ST 504"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class Time Slot
                </label>
                <input
                  type="text"
                  value={editTimeSlot}
                  onChange={(e) => setEditTimeSlot(e.target.value)}
                  placeholder="e.g. 10:15 - 11:45 AM"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Special Status Note / Student Notice
                </label>
                <input
                  type="text"
                  value={editStatusNote}
                  onChange={(e) => setEditStatusNote(e.target.value)}
                  placeholder="e.g. Rescheduled to Lab 2 / Makeup class on Saturday"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSlotEdit}
                  className="btn-motion btn-bup-primary px-5 py-2.5 rounded-xl text-white font-bold shadow-md shadow-bup-700/20"
                >
                  Save Routine Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: INTERACTIVE STUDENT ONLINE QUIZ RUNNER                */}
      {/* ============================================================== */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveQuiz(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Quiz Header & Live Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-bup-800 dark:bg-blue-950 dark:text-blue-300">
                  {activeQuiz.courseCode}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {activeQuiz.title}
                </h3>
                <p className="text-xs text-slate-500">Instructor: {activeQuiz.facultyName}</p>
              </div>

              {!quizSubmitted ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-900 dark:text-amber-200 shrink-0 font-mono font-bold text-sm">
                  <Timer className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} Left
                  </span>
                </div>
              ) : (
                <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-900 dark:text-emerald-200 shrink-0 font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>
                    Score: {quizScore} / {activeQuiz.totalMarks} (
                    {Math.round((quizScore / activeQuiz.totalMarks) * 100)}%)
                  </span>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6 text-xs">
              {activeQuiz.questions.map((q, idx) => {
                const userPick = quizAnswers[q.id];
                const isCorrect = userPick === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      Q{idx + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const selected = userPick === optIdx;
                        let optStyle =
                          'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                        if (selected && !quizSubmitted) {
                          optStyle = 'bg-bup-50 border-bup-600 text-bup-900 dark:bg-bup-950/60 dark:text-bup-200';
                        } else if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optStyle =
                              'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200';
                          } else if (selected && !isCorrect) {
                            optStyle = 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full p-3 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${optStyle}`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {quizSubmitted && optIdx === q.correctIndex && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit or Close */}
              <div className="pt-4 flex items-center justify-end gap-3">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="btn-motion btn-bup-primary px-6 py-2.5 rounded-xl font-bold text-white text-xs shadow-md shadow-bup-700/20"
                  >
                    Submit Quiz Answers
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveQuiz(null)}
                    className="btn-motion bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs"
                  >
                    Done & Exit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: FACULTY PUBLISH NEW ONLINE QUIZ                       */}
      {/* ============================================================== */}
      {createQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCreateQuizModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-bup-100 dark:bg-bup-900/40 text-bup-700 dark:text-bup-300 flex items-center justify-center">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Publish Online Quiz / Assessment
                </h3>
                <p className="text-xs text-slate-500">Create timed MCQs for BUP ICT students</p>
              </div>
            </div>

            <form onSubmit={handleCreateNewQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quiz Title / Topic
                </label>
                <input
                  type="text"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="e.g. Class Test 1: Data Structures Graph Algorithms"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Course</label>
                  <select
                    value={newQuizCourse}
                    onChange={(e) => setNewQuizCourse(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="ICE-3205">ICE-3205</option>
                    <option value="ICE-3207">ICE-3207</option>
                    <option value="ICE-3201">ICE-3201</option>
                    <option value="ICE-2201">ICE-2201</option>
                    <option value="ICE-2203">ICE-2203</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    value={newQuizDuration}
                    onChange={(e) => setNewQuizDuration(Number(e.target.value))}
                    min={5}
                    max={60}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={newQuizTotalMarks}
                    onChange={(e) => setNewQuizTotalMarks(Number(e.target.value))}
                    min={10}
                    max={100}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200">
                  MCQ Question 1
                </label>
                <input
                  type="text"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Question statement..."
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    value={newOpt0}
                    onChange={(e) => setNewOpt0(e.target.value)}
                    placeholder="Option A"
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newOpt1}
                    onChange={(e) => setNewOpt1(e.target.value)}
                    placeholder="Option B"
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newOpt2}
                    onChange={(e) => setNewOpt2(e.target.value)}
                    placeholder="Option C"
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newOpt3}
                    onChange={(e) => setNewOpt3(e.target.value)}
                    placeholder="Option D"
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="pt-1">
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Select Correct Answer:
                  </label>
                  <select
                    value={newCorrectIdx}
                    onChange={(e) => setNewCorrectIdx(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateQuizModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-motion btn-bup-primary px-5 py-2.5 rounded-xl text-white font-bold shadow-md shadow-bup-700/20"
                >
                  Publish Quiz to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Class Alarm & Notification Reminder Modal */}
      {alarmModalSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
                  <Bell className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Class Reminder & Sound Alarm
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">BUP Timetable Alert Engine</p>
                </div>
              </div>
              <button
                onClick={() => setAlarmModalSlot(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Class Snapshot */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-bup-700 dark:text-blue-400 text-sm">
                  {alarmModalSlot.courseCode}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Room: {alarmModalSlot.room}
                </span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white leading-tight">
                {alarmModalSlot.courseTitle}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {alarmModalSlot.day} • {alarmModalSlot.timeSlot}
                </span>
              </div>
            </div>

            {/* Reminder Lead Time Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Remind Me Before Class:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 30].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAlarmMinutes(m)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      alarmMinutes === m
                        ? 'btn-bup-primary text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Channels */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  <span>Audible Campus Chime Beep</span>
                </span>
                <input
                  type="checkbox"
                  checked={alarmSound}
                  onChange={(e) => setAlarmSound(e.target.checked)}
                  className="rounded text-bup-600 focus:ring-bup-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>Browser & Desktop Push Alert</span>
                </span>
                <input
                  type="checkbox"
                  checked={alarmBrowserNotification}
                  onChange={(e) => setAlarmBrowserNotification(e.target.checked)}
                  className="rounded text-bup-600 focus:ring-bup-500"
                />
              </label>
            </div>

            {/* Sound Chime Test Button */}
            <button
              type="button"
              onClick={playAlarmChime}
              className="w-full py-2 rounded-xl border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Preview Alarm Audio Chime</span>
            </button>

            {/* Success Message */}
            {alarmSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center animate-fadeIn">
                ✓ {alarmSuccessMsg}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAlarmModalSlot(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAlarm}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all ${
                  reminderSet[alarmModalSlot.id]
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'
                    : 'btn-bup-primary shadow-bup-700/20'
                }`}
              >
                {reminderSet[alarmModalSlot.id] ? 'Deactivate Alarm' : 'Save & Activate Alarm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};