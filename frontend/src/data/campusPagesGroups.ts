// Realistic BUP Campus Pages and Groups Data
// Fully interactive: Like/Follow, Join/Leave, Member tracking, and Posts

export interface CampusPage {
  id: string;
  name: string;
  handle: string;
  category: string;
  likesCount: number;
  followersCount: number;
  avatar: string;
  coverPhoto: string;
  isVerified: boolean;
  bio: string;
  contactEmail: string;
  location: string;
  recentPost: {
    title: string;
    date: string;
    content: string;
    image?: string;
  };
}

export interface CampusGroup {
  id: string;
  name: string;
  privacy: 'Public Group' | 'Private Campus Group';
  category: string;
  membersCount: number;
  avatar: string;
  coverPhoto: string;
  description: string;
  adminName: string;
  adminRole: string;
  pinnedNotice: string;
  isJoined?: boolean;
}

export const INITIAL_CAMPUS_PAGES: CampusPage[] = [
  {
    id: 'page-buprc',
    name: 'BUP Robotics Club (BUPRC)',
    handle: 'buprc.official',
    category: 'Technology & Robotics Society',
    likesCount: 4280,
    followersCount: 5120,
    avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200',
    isVerified: true,
    bio: 'Pioneering autonomous robotics, drone telemetry, and embedded hardware innovations at Bangladesh University of Professionals.',
    contactEmail: 'robotics.club@bup.edu.bd',
    location: 'Lab 402, Academic Building 1, BUP',
    recentPost: {
      title: 'Autonomous Rover Workshop Spring 2026',
      date: 'Yesterday at 4:30 PM',
      content: 'Hands-on session on ESP32 Microcontrollers, PID motor control, and ultrasonic navigation. Registration is live!',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
    },
  },
  {
    id: 'page-bupitc',
    name: 'BUP InfoTech Club (BUPITC)',
    handle: 'bupitc.fst',
    category: 'Software & Information Technology',
    likesCount: 5890,
    followersCount: 6940,
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200',
    isVerified: true,
    bio: 'The premier technology community at FST. Organizing BUP National Tech Fest, Inter-University Hackathons, and Cyber Security summits.',
    contactEmail: 'infotech.club@bup.edu.bd',
    location: 'FST ICT Department, BUP',
    recentPost: {
      title: 'BUP National Tech Fest 2026 Finalists Announced!',
      date: '2 days ago',
      content: 'Congratulations to top 10 Hackathon and Project Showcase finalists! Prepare your slides for the Grand Jury at Bijoy Auditorium.',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
    },
  },
  {
    id: 'page-bupcc',
    name: 'BUP Career Club (BUPCC)',
    handle: 'bupcc.corporate',
    category: 'Career & Professional Network',
    likesCount: 7150,
    followersCount: 8400,
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    isVerified: true,
    bio: 'Bridging the campus with corporate Bangladesh. Resume masterclasses, MNC recruitment drives, and leadership colloquiums.',
    contactEmail: 'career.club@bup.edu.bd',
    location: 'Faculty of Business Studies (FBS), BUP',
    recentPost: {
      title: 'Annual Corporate Grooming Session 2026',
      date: '3 days ago',
      content: 'HR Directors from leading telcos and tech conglomerates will be taking 1-on-1 mock interviews next Monday.',
    },
  },
  {
    id: 'page-cultural',
    name: 'BUP Cultural Forum',
    handle: 'bupculturalforum',
    category: 'Arts, Drama & Music Society',
    likesCount: 3950,
    followersCount: 4600,
    avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200',
    isVerified: true,
    bio: 'Celebrating Bangladeshi culture, music, theatrical productions, and national day galas with passionate student performers.',
    contactEmail: 'cultural@bup.edu.bd',
    location: 'Central Cafeteria & Bijoy Auditorium, BUP',
    recentPost: {
      title: 'Spring Acoustic Evening at Central Lakefront',
      date: '5 days ago',
      content: 'Gather by the lake this Thursday evening for acoustic unplugged covers and open mic poetry sessions.',
    },
  },
  {
    id: 'page-debating',
    name: 'BUP Literature & Debating Club (BUPDC)',
    handle: 'bupdc.champions',
    category: 'Parliamentary Debate & Oratory',
    likesCount: 3420,
    followersCount: 4100,
    avatar: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200',
    isVerified: true,
    bio: 'National Inter-University Parliamentary Debate Champions. Voice of critical reasoning and eloquence.',
    contactEmail: 'debating.club@bup.edu.bd',
    location: 'FASS Floor 5, BUP',
    recentPost: {
      title: 'Asian Parliamentary Debate Workshop',
      date: '1 week ago',
      content: 'Registration open for novice debaters across all 4 faculties. Free entry!',
    },
  },
];

export const INITIAL_CAMPUS_GROUPS: CampusGroup[] = [
  {
    id: 'grp-antorikkho22',
    name: 'FST Batch 22 Official (অন্তরীক্ষ-২২)',
    privacy: 'Private Campus Group',
    category: 'Batch Cohort & Alumni',
    membersCount: 284,
    avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80',
    description: 'Official community hub for FST Batch 2022. Announcements, batch fest memories, thesis discussions, and reunion updates.',
    adminName: 'Tanvir Naeem',
    adminRole: 'Batch 22 Scholar & Coordinator',
    pinnedNotice: '📌 Thesis defense schedules and batch photoshoot album have been uploaded to Drive. Check files tab!',
    isJoined: true,
  },
  {
    id: 'grp-ict24',
    name: 'Department of ICT - Batch 2024 (Section A & B)',
    privacy: 'Private Campus Group',
    category: 'Academic Coordination',
    membersCount: 142,
    avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200',
    description: 'Daily class schedule updates, assignment submission reminders, lecture slides, and CR announcements.',
    adminName: 'Safaytul Islam Rafi',
    adminRole: 'Section A Class Representative (CR)',
    pinnedNotice: '📌 Midterm exam routine draft published. Lab report 3 deadline extended to Saturday.',
    isJoined: true,
  },
  {
    id: 'grp-blood',
    name: 'BUP Blood Donation Emergency Network (রক্তের বন্ধন)',
    privacy: 'Public Group',
    category: 'Humanitarian & Emergency Support',
    membersCount: 1540,
    avatar: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200',
    description: 'Volunteer blood donors of BUP available for emergency transfusion in Dhaka CMH, Kurmitola General, and across Mirpur.',
    adminName: 'Ayman Sadiq',
    adminRole: 'Campus Volunteer Lead',
    pinnedNotice: '🩸 Emergency O+ and B- blood donor needed at Kurmitola General Hospital. DM immediately!',
    isJoined: false,
  },
  {
    id: 'grp-cp',
    name: 'BUP Competitive Programmers (ACM/ICPC Circle)',
    privacy: 'Public Group',
    category: 'Algorithm & Codeforces Circle',
    membersCount: 680,
    avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    description: 'Weekly virtual contests, Dynamic Programming problem discussions, and preliminary round coordination for ICPC Dhaka Regional.',
    adminName: 'Nabil Ahmed',
    adminRole: 'FST ICPC Finalist',
    pinnedNotice: '🏆 Practice contest live on VJudge tonight at 9:00 PM. Topic: Segment Trees & Graph Traversal.',
    isJoined: false,
  },
  {
    id: 'grp-thesis',
    name: 'BUP Thesis & Research Circle (IEEE & Scopus Publications)',
    privacy: 'Public Group',
    category: 'Academic Research & Capstone',
    membersCount: 420,
    avatar: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200',
    description: 'Paper writing guidelines, LaTeX templates, dataset sharing, and conference funding tips supervised by BUP faculty.',
    adminName: 'Associate Professor Dr. Md. Sabir Hossain',
    adminRole: 'FST Research Advisor',
    pinnedNotice: '📚 LaTeX Overleaf template for BUP Undergrad Thesis is updated for 2026. Download from resources!',
    isJoined: false,
  },
];
