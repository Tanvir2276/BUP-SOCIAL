import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting 1,000 Users & Facebook-Style Media Seeding for BUP Social (BUPSoCo)...');

  // Clean existing tables
  try {
    await prisma.eventRegistration.deleteMany();
    await prisma.clubEvent.deleteMany();
    await prisma.favoriteClub.deleteMany();
    await prisma.club.deleteMany();
    await prisma.ridePassenger.deleteMany();
    await prisma.rideOffer.deleteMany();
    await prisma.lostFoundItem.deleteMany();
    await prisma.encryptedMessage.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.customReminder.deleteMany();
    await prisma.routineEntry.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.reaction.deleteMany();
    await prisma.savedPost.deleteMany();
    await prisma.post.deleteMany();
    await prisma.community.deleteMany();
    await prisma.facultyNotice.deleteMany();
    await prisma.courseSection.deleteMany();
    await prisma.courseEntity.deleteMany();
    await prisma.departmentEntity.deleteMany();
    await prisma.facultyEntity.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.otpRecord.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Cleaned existing tables.');
  } catch (e) {
    console.log('Clean notice:', e.message);
  }

  // Pre-hashed passwords
  const studentPass = await bcrypt.hash('bup123', 10);
  const facultyPass = await bcrypt.hash('faculty123', 10);
  const adminPass = await bcrypt.hash('admin123', 10);

  // 1. Create Faculties (from official BUP structure https://bup.edu.bd/)
  await prisma.facultyEntity.createMany({
    data: [
      { code: 'FST', name: 'Faculty of Science & Technology', description: 'Computing, Engineering, and Frontier Sciences. Departments: ICT, CSE.' },
      { code: 'FBS', name: 'Faculty of Business Studies', description: 'Management, Finance, Accounting, and Global Commerce. Departments: BBA, AIS, Finance.' },
      { code: 'FASS', name: 'Faculty of Arts & Social Sciences', description: 'Economics, Sociology, English, and Public Administration.' },
      { code: 'FSSS', name: 'Faculty of Security & Strategic Studies', description: 'International Relations, Strategic Studies, Law, and Peace & Conflict.' },
    ],
  });

  // 2. Create Departments (official BUP https://bup.edu.bd/)
  await prisma.departmentEntity.createMany({
    data: [
      { code: 'ICT', name: 'Department of Information & Communication Technology', facultyCode: 'FST', description: 'Leading frontier engineering in communication systems, networks, and advanced software.', coursesCount: 10, icon: 'Cpu' },
      { code: 'CSE', name: 'Department of Computer Science & Engineering', facultyCode: 'FST', description: 'Computing theory, artificial intelligence, algorithms, software engineering, and cybersecurity.', coursesCount: 10, icon: 'Code' },
      { code: 'BBA', name: 'Department of Business Administration', facultyCode: 'FBS', description: 'Finance, marketing, supply chain management, and organizational leadership.', coursesCount: 8, icon: 'Briefcase' },
      { code: 'ECON', name: 'Department of Economics', facultyCode: 'FASS', description: 'Macroeconomics, econometric modeling, fiscal policy, quantitative methods, and global trade.', coursesCount: 6, icon: 'TrendingUp' },
      { code: 'IR', name: 'Department of International Relations', facultyCode: 'FSSS', description: 'Strategic diplomacy, geopolitical analysis, defense policy, and international treaties.', coursesCount: 6, icon: 'Globe' },
      { code: 'LAW', name: 'Department of Law', facultyCode: 'FSSS', description: 'Constitutional law, criminal jurisprudence, cyber law, and international human rights.', coursesCount: 5, icon: 'Scale' },
    ],
  });

  // 3. Create Courses
  const coursesData = [
    { code: 'ICT-2201', title: 'Data Structures and Algorithms', departmentCode: 'ICT', departmentName: 'Department of ICT', credits: 3.0, semester: 'Spring 2026', description: 'Core linear & non-linear structures, Big-O asymptotic analysis, dynamic programming, and Dijkstra shortest path.' },
    { code: 'ICT-2202', title: 'Data Structures Laboratory', departmentCode: 'ICT', departmentName: 'Department of ICT', credits: 1.5, semester: 'Spring 2026', description: 'Hands-on C++/Java implementation of balanced search trees, graph traversals (BFS/DFS), and hash tables.' },
    { code: 'ICT-2203', title: 'Digital Electronics & Logic Design', departmentCode: 'ICT', departmentName: 'Department of ICT', credits: 3.0, semester: 'Spring 2026', description: 'Boolean algebra, Karnaugh maps, sequential logic, flip-flops, multiplexers, and FPGA basics.' },
    { code: 'CSE-3101', title: 'Database Management Systems', departmentCode: 'CSE', departmentName: 'Department of CSE', credits: 3.0, semester: 'Spring 2026', description: 'Relational algebra, SQL, normal forms (BCNF), transaction ACID properties, and indexing.' },
    { code: 'BBA-1101', title: 'Principles of Management', departmentCode: 'BBA', departmentName: 'Department of Business Administration', credits: 3.0, semester: 'Spring 2026', description: 'Managerial functions, strategic organizational planning, human resource dynamics, and business ethics.' },
    { code: 'ECON-2101', title: 'Intermediate Microeconomics', departmentCode: 'ECON', departmentName: 'Department of Economics', credits: 3.0, semester: 'Spring 2026', description: 'Consumer behavior, production theory, market equilibria, and game-theoretic models.' },
  ];

  for (const c of coursesData) {
    await prisma.courseEntity.create({ data: c });
  }

  // 4. Create Sections for Courses
  await prisma.courseSection.createMany({
    data: [
      { courseCode: 'ICT-2201', sectionName: 'Section A', instructorName: 'Assistant Professor Nazneen Akhter', instructorEmail: 'nazneen@bup.edu.bd', room: 'Academic Block 2, Room 402', schedule: 'Sun 10:30 AM - 12:00 PM, Tue 10:30 AM - 12:00 PM', capacity: 45, enrolledCount: 42 },
      { courseCode: 'ICT-2201', sectionName: 'Section B', instructorName: 'Assistant Professor Suman Saha', instructorEmail: 'sumansaha@bup.edu.bd', room: 'Academic Block 2, Room 405', schedule: 'Mon 09:00 AM - 10:30 AM, Wed 09:00 AM - 10:30 AM', capacity: 45, enrolledCount: 39 },
      { courseCode: 'ICT-2202', sectionName: 'Section A', instructorName: 'Assistant Professor Nazneen Akhter', instructorEmail: 'nazneen@bup.edu.bd', room: 'ICT Software Lab 1', schedule: 'Sun 02:00 PM - 04:30 PM', capacity: 45, enrolledCount: 42 },
      { courseCode: 'ICT-2202', sectionName: 'Section B', instructorName: 'Assistant Professor Suman Saha', instructorEmail: 'sumansaha@bup.edu.bd', room: 'ICT Software Lab 2', schedule: 'Mon 02:00 PM - 04:30 PM', capacity: 45, enrolledCount: 39 },
      { courseCode: 'ICT-2203', sectionName: 'Section A', instructorName: 'Assistant Professor Suman Saha', instructorEmail: 'sumansaha@bup.edu.bd', room: 'Block 2, Room 403', schedule: 'Sun 09:00 AM - 10:30 AM, Tue 09:00 AM - 10:30 AM', capacity: 45, enrolledCount: 41 },
      { courseCode: 'CSE-3101', sectionName: 'Section A', instructorName: 'Assistant Professor Dr. Kazi Abu Taher', instructorEmail: 'taher@bup.edu.bd', room: 'Block 1, Room 301', schedule: 'Mon 10:30 AM - 12:00 PM, Wed 10:30 AM - 12:00 PM', capacity: 50, enrolledCount: 48 },
    ],
  });

  // 5. Create Core Proposal Authors & Faculty Leaders
  const coreUsers = [
    {
      name: 'Safaytul Islam Rafi',
      email: 'rafi@bup.edu.bd',
      password: studentPass,
      role: 'STUDENT',
      studentId: '24549010064',
      designation: 'Student Researcher & Class Representative',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section A',
      isVerified: true,
      leadTimeMinutes: 15,
      deviceType: 'browser',
      soundEnabled: true,
      coursePreferences: JSON.stringify(['ICT-2201', 'ICT-2202', 'CSE-3101']),
      favoriteClubs: JSON.stringify(['BUP InfoTech Club (BUPITC)', 'BUP Robotics Club (BUPRC)']),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'BICE-2024 | Competitive Programmer, Algorithm Enthusiast & Section A Lead.',
    },
    {
      name: 'Mahim Ismail',
      email: 'mahim@bup.edu.bd',
      password: studentPass,
      role: 'STUDENT',
      studentId: '24549010134',
      designation: 'Student',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section A',
      isVerified: true,
      leadTimeMinutes: 30,
      deviceType: 'android_pwa',
      soundEnabled: true,
      coursePreferences: JSON.stringify(['ICT-2201', 'ICT-2203']),
      favoriteClubs: JSON.stringify(['BUP InfoTech Club (BUPITC)', 'BUP Career & Leadership Club (BCLC)']),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Front-end designer and tech explorer.',
    },
    {
      name: 'Sulayman Akhand Rahul',
      email: 'rahul@bup.edu.bd',
      password: studentPass,
      role: 'STUDENT',
      studentId: '23549009014',
      designation: 'Student',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section B',
      isVerified: true,
      leadTimeMinutes: 10,
      deviceType: 'browser',
      soundEnabled: false,
      coursePreferences: JSON.stringify(['ICT-2201', 'CSE-3101']),
      favoriteClubs: JSON.stringify(['BUP Debate Club (BUPDC)']),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      bio: 'Section B representative & BUP debate champion.',
    },
    {
      name: 'Munshi Tanvir Hossain',
      email: 'tanvir@bup.edu.bd',
      password: studentPass,
      role: 'STUDENT',
      studentId: '22549010076',
      designation: 'Student',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section A',
      isVerified: true,
      leadTimeMinutes: 15,
      deviceType: 'ios_pwa',
      soundEnabled: true,
      coursePreferences: JSON.stringify(['ICT-2201', 'ICT-2202', 'ICT-2203']),
      favoriteClubs: JSON.stringify(['BUP Robotics Club (BUPRC)', 'BUP Career & Leadership Club (BCLC)']),
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      bio: 'BUP Social Master Project Developer & Robotics enthusiast.',
    },
    {
      name: 'Assistant Professor Nazneen Akhter',
      email: 'nazneen@bup.edu.bd',
      password: facultyPass,
      role: 'FACULTY',
      facultyId: 'FAC-ICT-001',
      designation: 'Assistant Professor & Supervisor',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      bio: 'Assistant Professor, Department of ICT, FST, BUP.',
    },
    {
      name: 'Assistant Professor Suman Saha',
      email: 'sumansaha@bup.edu.bd',
      password: facultyPass,
      role: 'FACULTY',
      facultyId: 'FAC-ICT-002',
      designation: 'Assistant Professor & Co-Supervisor',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Assistant Professor, Dept of IT & RE, FCPSE.',
    },
    {
      name: 'Associate Professor Dr. Md. Sabir Hossain',
      email: 'sabir@bup.edu.bd',
      password: facultyPass,
      role: 'FACULTY',
      facultyId: 'FAC-CSE-001',
      designation: 'Associate Professor & Chairman',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'CSE',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      bio: 'Chairman, Department of Computer Science & Engineering, BUP.',
    },
    {
      name: 'BUP Central Administrator',
      email: 'admin@bup.edu.bd',
      password: adminPass,
      role: 'ADMIN',
      designation: 'Controller of Examinations & System Governance',
      facultyName: 'Central Governance',
      departmentCode: 'ADMIN',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bio: 'BUP Social Platform Administration & Governance.',
    },
  ];

  const createdCore = [];
  for (const u of coreUsers) {
    const user = await prisma.user.create({ data: u });
    createdCore.push(user);
  }

  const rafi = createdCore[0];
  const mahim = createdCore[1];
  const rahul = createdCore[2];
  const tanvir = createdCore[3];
  const profNazneen = createdCore[4];
  const profSaha = createdCore[5];

  // 6. Bulk Generate 1,000 Realistic BUP Students (User Requirement #3)
  console.log('⚡ Generating 1,000 realistic BUP user accounts in MySQL...');
  const firstNames = [
    'Anika', 'Tanvir', 'Fahim', 'Nusrat', 'Sadia', 'Mehzabin', 'Abrar', 'Safayat',
    'Zarin', 'Tasnim', 'Naimur', 'Shakil', 'Farhan', 'Raisa', 'Nafisa', 'Tamim',
    'Shabab', 'Rayhan', 'Fariha', 'Muntasir', 'Zubair', 'Jannatul', 'Lamia', 'Shadman',
    'Sazzad', 'Kazi', 'Rifat', 'Nabil', 'Samin', 'Israt', 'Nahian', 'Wasif',
    'Afsana', 'Tahmid', 'Sumaiya', 'Mushfiq', 'Arman', 'Adiba', 'Ashiq', 'Nazmul',
    'Mahir', 'Faiza', 'Towhid', 'Mithila', 'Shahriar', 'Sabrina', 'Zahid', 'Fatima',
  ];
  const lastNames = [
    'Rahman', 'Hossain', 'Ahmed', 'Islam', 'Hasan', 'Khan', 'Chowdhury', 'Akhand',
    'Ismail', 'Naeem', 'Haque', 'Sikder', 'Mahmud', 'Ali', 'Dewan', 'Bhuiyan',
    'Talukder', 'Sarker', 'Baqi', 'Uddin', 'Karim', 'Siddique', 'Munshi', 'Molla',
  ];
  const depts = [
    { code: 'ICT', prog: 'BICE', faculty: 'Faculty of Science & Technology (FST)' },
    { code: 'CSE', prog: 'B.Sc. in CSE', faculty: 'Faculty of Science & Technology (FST)' },
    { code: 'BBA', prog: 'BBA (General)', faculty: 'Faculty of Business Studies (FBS)' },
    { code: 'ECON', prog: 'BSS in Economics', faculty: 'Faculty of Arts & Social Sciences (FASS)' },
    { code: 'IR', prog: 'BSS in Int. Relations', faculty: 'Faculty of Security & Strategic Studies (FSSS)' },
  ];
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
  ];

  const bulkUsers = [];
  for (let i = 1; i <= 1000; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i * 3) % lastNames.length];
    const fullName = `${fName} ${lName}`;
    const rollSuffix = i.toString().padStart(4, '0');
    const roll = `2454901${rollSuffix}`;
    const email = `student${roll}@bup.edu.bd`;
    const dept = depts[i % depts.length];
    const sec = i % 2 === 0 ? 'Section A' : 'Section B';
    const batch = i % 4 === 0 ? 'BICE-2023' : 'BICE-2024';

    bulkUsers.push({
      name: fullName,
      email,
      password: studentPass,
      role: 'STUDENT',
      studentId: roll,
      designation: 'Undergraduate Student',
      facultyName: dept.faculty,
      departmentCode: dept.code,
      programName: dept.prog,
      batchName: batch,
      sectionName: sec,
      isVerified: true,
      leadTimeMinutes: (i % 3 === 0) ? 30 : 15,
      deviceType: i % 2 === 0 ? 'browser' : 'android_pwa',
      soundEnabled: true,
      avatar: avatars[i % avatars.length],
      bio: `BUPian | ${dept.prog} ${batch} | Passionate learner at BUP Mirpur Campus.`,
    });
  }

  // Insert in chunks of 250 for speed and stability
  for (let i = 0; i < bulkUsers.length; i += 250) {
    const chunk = bulkUsers.slice(i, i + 250);
    await prisma.user.createMany({ data: chunk, skipDuplicates: true });
  }
  console.log(`✅ 1,000 BUP users inserted into MySQL!`);

  // 7. Create Communities
  const commCampus = await prisma.community.create({
    data: { name: 'Campus General Forum', slug: 'campus-general', type: 'CAMPUS', target: 'General Campus', description: 'Central university discussion forum for all students and faculties.', isPublic: true, membersCount: 1008 },
  });
  const commCourse = await prisma.community.create({
    data: { name: 'ICT-2201 Course Group', slug: 'ict-2201-group', type: 'COURSE', target: 'ICT-2201 (Algorithms)', description: 'Academic discussion group for Data Structures & Algorithms.', isPublic: true, membersCount: 82 },
  });
  const commClub = await prisma.community.create({
    data: { name: 'BUP InfoTech Club Space', slug: 'bupitc-space', type: 'CLUB', target: 'BUP InfoTech Club (BUPITC)', description: 'Official community hub for tech enthusiasts, coders, and hackers.', isPublic: true, membersCount: 280 },
  });

  // 8. Create Facebook-Style Posts: Notes, Photos, Reels, and Videos (User Requirement #3)
  console.log('📸 Seeding Facebook-Style Posts (Notes, Photos, Reels, Videos)...');
  const samplePosts = [
    // Post 1: Hand-written Notes (Note/Document)
    {
      authorId: rafi.id,
      authorName: rafi.name,
      authorRole: rafi.role,
      authorAvatar: rafi.avatar,
      authorDepartment: rafi.departmentCode,
      authorBatch: rafi.batchName,
      authorStudentId: rafi.studentId,
      communityType: 'COURSE',
      communityTarget: 'ICT-2201 (Algorithms)',
      communityId: commCourse.id,
      mediaType: 'NOTE',
      attachmentName: 'ICT2201_Graph_Algorithms_Complete_Handwritten_Notes.pdf',
      attachmentUrl: 'https://bup.edu.bd/academic-calendar',
      title: '📚 Data Structures & Algorithms: Complete Handwritten Notes for Quiz 2 (Section A & B)',
      content: `Hey everyone! I have compiled my complete 28-page class lecture notes covering:\n• Graph Representations (Adjacency Matrix vs List)\n• Dijkstra's Shortest Path Algorithm (with Priority Queue heap dry-run)\n• Bellman-Ford Negative Cycle Detection\n• Topological Sort using Kahn's Algorithm.\n\nDownload the attached PDF note below! Feel free to ask questions in the comments if anything is unclear.`,
      tags: JSON.stringify(['#Notes', '#DataStructures', '#SectionA', '#Quiz2Prep']),
      likesCount: 142,
      commentsCount: 18,
      sharesCount: 34,
      viewsCount: 680,
    },
    // Post 2: Campus Photography (Photos)
    {
      authorId: mahim.id,
      authorName: mahim.name,
      authorRole: mahim.role,
      authorAvatar: mahim.avatar,
      authorDepartment: mahim.departmentCode,
      authorBatch: mahim.batchName,
      authorStudentId: mahim.studentId,
      communityType: 'CAMPUS',
      communityTarget: 'General Campus',
      communityId: commCampus.id,
      mediaType: 'IMAGE',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200',
      title: '🌅 Golden Hour over BUP Central Plaza & Academic Block 2',
      content: `Captured this breathtaking view right after our Digital Electronics lab this afternoon. The reflection on Mirpur lake and the peaceful campus vibes always recharge the mind after intense lecture sessions! 🇧🇩✨\n\nShot on iPhone 15 Pro • BUP Campus, Mirpur Cantonment.`,
      tags: JSON.stringify(['#BUPCampus', '#CampusVibes', '#Photography', '#MirpurCantonment']),
      likesCount: 289,
      commentsCount: 31,
      sharesCount: 52,
      viewsCount: 1240,
    },
    // Post 3: Campus Reel / Short Video (Reel)
    {
      authorId: tanvir.id,
      authorName: tanvir.name,
      authorRole: tanvir.role,
      authorAvatar: tanvir.avatar,
      authorDepartment: tanvir.departmentCode,
      authorBatch: tanvir.batchName,
      authorStudentId: tanvir.studentId,
      communityType: 'CLUB',
      communityTarget: 'BUP Robotics Club (BUPRC)',
      communityId: commClub.id,
      mediaType: 'REEL',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: '🤖 REEL: Autonomous Line-Follower & LiDAR Mapping Robot Testing at BUP Robotics Lab!',
      content: `Our BUPRC team successfully finished calibrating PID coefficients on our autonomous wheeled rover today! Achieving 2.1 m/s speed through 90-degree tight curves with zero drift. Watch the reel till the end to see the obstacle evasion demo! 🔥⚡`,
      tags: JSON.stringify(['#Reel', '#BUPRobotics', '#RoboticsLab', '#Engineering', '#TechInnovations']),
      likesCount: 340,
      commentsCount: 42,
      sharesCount: 78,
      viewsCount: 2450,
    },
    // Post 4: Tech Video (Video)
    {
      authorId: profNazneen.id,
      authorName: profNazneen.name,
      authorRole: 'FACULTY',
      authorAvatar: profNazneen.avatar,
      authorDepartment: 'ICT',
      communityType: 'COURSE',
      communityTarget: 'ICT-2201 (Algorithms)',
      communityId: commCourse.id,
      mediaType: 'VIDEO',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      title: '🎬 Lecture Video Summary: Asymptotic Analysis & Dynamic Programming Insights',
      content: `Dear students of Section A & Section B, for those who requested revision on 0/1 Knapsack sub-problem memoization, I have uploaded this recorded summary video. Please pay close attention to the bottom-up table formulation. We will review tricky corner cases during Tuesday tutorial.`,
      tags: JSON.stringify(['#FacultyLecture', '#Algorithms', '#DynamicProgramming', '#SectionA', '#SectionB']),
      likesCount: 215,
      commentsCount: 25,
      sharesCount: 41,
      viewsCount: 1890,
    },
    // Post 5: Exam Notice Notes
    {
      authorId: rahul.id,
      authorName: rahul.name,
      authorRole: rahul.role,
      authorAvatar: rahul.avatar,
      authorDepartment: rahul.departmentCode,
      authorBatch: rahul.batchName,
      authorStudentId: rahul.studentId,
      communityType: 'COURSE',
      communityTarget: 'CSE-3101 (DBMS)',
      mediaType: 'NOTE',
      attachmentName: 'DBMS_Normalization_BCNF_CheatSheet.pdf',
      attachmentUrl: 'https://bup.edu.bd/',
      title: '📑 DBMS: 1NF to BCNF Normalization Step-by-Step Solved Problems PDF',
      content: `Compiled 10 past midterm questions on functional dependency loss-less decomposition and dependency preservation. Highly recommended for CSE & ICT students preparing for next week's test! Download attached.`,
      tags: JSON.stringify(['#DBMS', '#Notes', '#BCNF', '#ExamPrep']),
      likesCount: 198,
      commentsCount: 19,
      sharesCount: 63,
      viewsCount: 890,
    },
    // Post 6: Hackathon Announcement Video
    {
      authorId: tanvir.id,
      authorName: tanvir.name,
      authorRole: tanvir.role,
      authorAvatar: tanvir.avatar,
      authorDepartment: tanvir.departmentCode,
      communityType: 'CLUB',
      communityTarget: 'BUP InfoTech Club (BUPITC)',
      communityId: commClub.id,
      mediaType: 'VIDEO',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      title: '🚀 Official Teaser: BUP Inter-Department Hackathon 2026 Trailer',
      content: `Get ready BUPians! 36 hours of non-stop innovation, mentorship from top industry leaders, prize pool of BDT 1,50,000, and institutional certificates from FST. Registration opens this Sunday on BUP Social portal!`,
      tags: JSON.stringify(['#Hackathon2026', '#BUPITC', '#CodingChallenge', '#Innovation']),
      likesCount: 412,
      commentsCount: 56,
      sharesCount: 110,
      viewsCount: 3820,
    },
  ];

  for (const p of samplePosts) {
    const post = await prisma.post.create({ data: p });

    // Seed realistic comments
    await prisma.comment.createMany({
      data: [
        {
          postId: post.id,
          authorId: mahim.id,
          authorName: mahim.name,
          authorRole: mahim.role,
          authorAvatar: mahim.avatar,
          content: 'This is brilliant! Exactly the resource we needed before examinations.',
        },
        {
          postId: post.id,
          authorId: profNazneen.id,
          authorName: profNazneen.name,
          authorRole: 'FACULTY',
          authorAvatar: profNazneen.avatar,
          content: 'Excellent effort. Make sure all batchmates review this carefully.',
        },
        {
          postId: post.id,
          authorId: rahul.id,
          authorName: rahul.name,
          authorRole: rahul.role,
          authorAvatar: rahul.avatar,
          content: 'Saved to my academic bookmarks! Thanks a lot.',
        },
      ],
    });
  }

  // 9. Create Official Faculty Notices
  await prisma.facultyNotice.createMany({
    data: [
      {
        title: 'Section A Only: Data Structures Quiz 2 Postponed to Tuesday',
        content: 'Dear Section A students, in view of the upcoming campus symposium, Quiz 2 on Graph Traversal and Dijkstra algorithm is rescheduled to Tuesday, 10:30 AM in Room 402. Please review BFS/DFS and adjacency lists.',
        category: 'EXAM',
        scope: 'SECTION',
        departmentCode: 'ICT',
        courseCode: 'ICT-2201',
        sectionName: 'Section A',
        urgency: 'URGENT',
        attachmentName: 'Quiz_2_Syllabus_SectionA.pdf',
        attachmentUrl: '#',
        authorId: profNazneen.id,
        authorName: profNazneen.name,
        authorRole: 'FACULTY',
        authorDesignation: profNazneen.designation,
      },
      {
        title: 'Section B Only: Lab Report 3 Submission Window Extended to Thursday',
        content: 'Section B students may submit their Binary Search Tree implementations until Thursday 11:59 PM on the portal. Late submissions after this deadline will incur a 10% penalty.',
        category: 'ASSIGNMENT',
        scope: 'SECTION',
        departmentCode: 'ICT',
        courseCode: 'ICT-2201',
        sectionName: 'Section B',
        urgency: 'IMPORTANT',
        attachmentName: 'BST_Rubric_SectionB.pdf',
        attachmentUrl: '#',
        authorId: profSaha.id,
        authorName: profSaha.name,
        authorRole: 'FACULTY',
        authorDesignation: profSaha.designation,
      },
      {
        title: 'Department of ICT: Tech Project Showcase & Research Paper Mentorship',
        content: 'All 2nd and 3rd year ICT students are invited to register their capstone and semester projects for the BUP ICT Showcase. Faculty mentors will review abstracts next Sunday.',
        category: 'GENERAL',
        scope: 'DEPARTMENT',
        departmentCode: 'ICT',
        courseCode: 'ALL',
        sectionName: 'ALL',
        urgency: 'NORMAL',
        authorId: profNazneen.id,
        authorName: profNazneen.name,
        authorRole: 'FACULTY',
        authorDesignation: profNazneen.designation,
      },
      {
        title: 'BUP Campus Notice: Midterm Routine Published for Spring 2026',
        content: 'The Controller of Examinations has published the synchronized Midterm Examination schedule for all faculties. Students are requested to check their individual department routines.',
        category: 'ROUTINE_CHANGE',
        scope: 'CAMPUS',
        departmentCode: 'ALL',
        courseCode: 'ALL',
        sectionName: 'ALL',
        urgency: 'IMPORTANT',
        authorId: createdCore[7].id,
        authorName: 'BUP Central Administration',
        authorRole: 'ADMIN',
        authorDesignation: 'Controller of Examinations',
      },
    ],
  });

  // 10. Create Clubs and Events
  const clubs = [
    { name: 'BUP InfoTech Club (BUPITC)', shortCode: 'BUPITC', category: 'Technology & Computing', description: 'The premier technology club of BUP fostering competitive programming, web development, cybersecurity, and hackathons.', advisor: 'Assistant Professor Nazneen Akhter', president: 'Safaytul Islam Rafi', membersCount: 380, upcomingEventsCount: 2, banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800' },
    { name: 'BUP Robotics Club (BUPRC)', shortCode: 'BUPRC', category: 'Hardware & Automation', description: 'Building autonomous line followers, IoT weather stations, robotic arms, and participating in national robo-wars.', advisor: 'Assistant Professor Suman Saha', president: 'Munshi Tanvir Hossain', membersCount: 290, upcomingEventsCount: 1, banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800' },
    { name: 'BUP Debate Club (BUPDC)', shortCode: 'BUPDC', category: 'Public Speaking & Logic', description: 'Developing critical discourse, national parliament debate champions, and inter-university public policy forums.', advisor: 'Faculty of Arts and Social Sciences', president: 'Sulayman Akhand Rahul', membersCount: 420, upcomingEventsCount: 1, banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800' },
    { name: 'BUP Career & Leadership Club (BCLC)', shortCode: 'BCLC', category: 'Professional Leadership', description: 'Bridging the corporate gap with mock interviews, resume bootcamps, and career summits.', advisor: 'Faculty of Business Studies', president: 'Mahim Ismail', membersCount: 520, upcomingEventsCount: 1, banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800' },
  ];

  for (const cl of clubs) {
    const club = await prisma.club.create({ data: cl });

    if (cl.shortCode === 'BUPITC') {
      await prisma.clubEvent.create({
        data: {
          clubId: club.id,
          clubName: club.name,
          title: 'BUP Inter-Department Hackathon 2026',
          description: '36-hour sprint to build innovative AI and campus productivity web apps. Exciting prize pool and certificate from FST!',
          date: '2026-11-15',
          time: '09:00 AM - 09:00 PM',
          venue: 'Bijoy Auditorium & ICT Lab',
          category: 'Hackathon',
          registeredCount: 45,
        },
      });
    }
  }

  // 11. Create Routines (Section A & Section B)
  await prisma.routineEntry.createMany({
    data: [
      { departmentCode: 'ICT', programName: 'BICE', batchName: 'BICE-2024', courseCode: 'ICT-2201', courseTitle: 'Data Structures & Algorithms', sectionName: 'Section A', instructorName: 'Asst. Prof Nazneen Akhter', dayOfWeek: 'Sunday', startTime: '10:30', endTime: '12:00', room: 'Block 2, Room 402' },
      { departmentCode: 'ICT', programName: 'BICE', batchName: 'BICE-2024', courseCode: 'ICT-2202', courseTitle: 'Data Structures Lab', sectionName: 'Section A', instructorName: 'Asst. Prof Nazneen Akhter', dayOfWeek: 'Sunday', startTime: '14:00', endTime: '16:30', room: 'Software Lab 1' },
      { departmentCode: 'ICT', programName: 'BICE', batchName: 'BICE-2024', courseCode: 'ICT-2203', courseTitle: 'Digital Electronics', sectionName: 'Section A', instructorName: 'Asst. Prof Suman Saha', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '10:30', room: 'Block 2, Room 403' },
      { departmentCode: 'ICT', programName: 'BICE', batchName: 'BICE-2024', courseCode: 'ICT-2201', courseTitle: 'Data Structures & Algorithms', sectionName: 'Section B', instructorName: 'Asst. Prof Suman Saha', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Block 2, Room 405' },
      { departmentCode: 'ICT', programName: 'BICE', batchName: 'BICE-2024', courseCode: 'ICT-2202', courseTitle: 'Data Structures Lab', sectionName: 'Section B', instructorName: 'Asst. Prof Suman Saha', dayOfWeek: 'Monday', startTime: '14:00', endTime: '16:30', room: 'Software Lab 2' },
    ],
  });

  // 12. Create Rides with Live BUP-GO Link
  await prisma.rideOffer.createMany({
    data: [
      {
        hostUserId: tanvir.id,
        hostName: tanvir.name,
        hostStudentId: tanvir.studentId,
        hostPhone: '01712345678',
        hostAvatar: tanvir.avatar,
        type: 'OFFER',
        origin: 'Mirpur 12 Metro Station',
        destination: 'BUP Campus, Mirpur Cantonment',
        pickupPoint: 'Pillar 242, Mirpur 12 Exit A',
        departureTime: '08:15 AM',
        rideDate: '2026-10-26',
        transportMode: 'Bike',
        seatsAvailable: 1,
        estimatedCost: 'Free / Campus Buddy',
        notes: 'Helmet available. Daily commute from Mirpur 12 to BUP Gate 1.',
        bupGoUrl: 'https://bup-go-project-8njl.vercel.app/',
        status: 'ACTIVE',
      },
      {
        hostUserId: mahim.id,
        hostName: mahim.name,
        hostStudentId: mahim.studentId,
        hostPhone: '01898765432',
        hostAvatar: mahim.avatar,
        type: 'OFFER',
        origin: 'Uttara Sector 7',
        destination: 'BUP Campus, Mirpur Cantonment',
        pickupPoint: 'House Building Foot-overbridge',
        departureTime: '07:45 AM',
        rideDate: '2026-10-26',
        transportMode: 'Car',
        seatsAvailable: 3,
        estimatedCost: 'Shared BDT 60/person',
        notes: 'AC Carpool via Mirpur DOHS flyover. AC will be on.',
        bupGoUrl: 'https://bup-go-project-8njl.vercel.app/',
        status: 'ACTIVE',
      },
    ],
  });

  // 13. Create Lost & Found listings
  await prisma.lostFoundItem.createMany({
    data: [
      {
        type: 'LOST',
        title: 'Scientific Calculator Casio fx-991EX (ClassWiz)',
        description: 'Left on the 3rd row desk of Room 402 after Digital Electronics class. Has a small blue sticker on the back cover.',
        location: 'Block 2, Room 402',
        dateReported: '2026-10-25',
        itemCategory: 'Electronics',
        status: 'OPEN',
        reportedByUserId: mahim.id,
        reportedByName: mahim.name,
        contactInfo: 'mahim@bup.edu.bd',
      },
      {
        type: 'FOUND',
        title: 'BUP Student ID Card in Cafeteria',
        description: 'Found near counter 2 during lunch hour. Handed over to Cafeteria Security Supervisor.',
        location: 'Ground Floor Cafeteria',
        dateReported: '2026-10-25',
        itemCategory: 'ID / Documents',
        status: 'OPEN',
        reportedByUserId: rafi.id,
        reportedByName: rafi.name,
        contactInfo: 'rafi@bup.edu.bd',
      },
    ],
  });

  console.log('🎉 Seeding successfully completed with 1,000+ Users, Facebook-Style Media Posts, Notes, Reels & Videos in MySQL!');
};

if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding error:', err);
      process.exit(1);
    });
}
