import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🏛️ Seeding Official BUP FST Ecosystem from https://bup.edu.bd/faculty_home/3 ...');

  const studentPass = await bcrypt.hash('bup123', 10);
  const facultyPass = await bcrypt.hash('faculty123', 10);
  const adminPass = await bcrypt.hash('admin123', 10);

  // 1. Ensure Official FST Departments exist
  const departmentsData = [
    {
      code: 'ICT',
      name: 'Department of Information and Communication Technology',
      facultyCode: 'FST',
      description: 'Undergraduate B.Sc. in ICT, Masters in ICE (MICE), MICT, and Information Systems Security (MISS).',
      coursesCount: 14,
      icon: 'Cpu',
    },
    {
      code: 'CSE',
      name: 'Department of Computer Science and Engineering',
      facultyCode: 'FST',
      description: 'B.Sc. in CSE, Master of Computer Science & Engineering (MCSE), and Master in Cyber Security (MCS).',
      coursesCount: 12,
      icon: 'Code',
    },
    {
      code: 'ENV',
      name: 'Department of Environmental Science',
      facultyCode: 'FST',
      description: 'B.Sc. in Environmental Science, Master in ES (MES), and M.Sc. in Environmental Science & Management (MESM).',
      coursesCount: 8,
      icon: 'TreePine',
    },
    {
      code: 'DS',
      name: 'Department of Data Science',
      facultyCode: 'FST',
      description: 'Data analytics, big data architecture, predictive modeling, statistical learning, and AI informatics.',
      coursesCount: 6,
      icon: 'Database',
    },
  ];

  for (const dept of departmentsData) {
    await prisma.departmentEntity.upsert({
      where: { code: dept.code },
      update: dept,
      create: dept,
    });
  }
  console.log('✅ Departments updated.');

  // 2. Official Faculty & Dean Accounts (Real BUP Leadership)
  const facultyMembers = [
    {
      name: 'Brigadier General Sufi Md Ataur Rahman, ndc, psc',
      email: 'dean.fst@bup.edu.bd',
      password: facultyPass,
      role: 'FACULTY',
      facultyId: 'DEAN-FST-001',
      designation: 'Dean, Faculty of Science and Technology (FST)',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Dean, Faculty of Science and Technology (FST), Bangladesh University of Professionals. Leading engineering excellence, high-impact research, and defense technology.',
    },
    {
      name: 'Associate Professor Dr. Md. Sabir Hossain',
      email: 'sabir@bup.edu.bd',
      password: facultyPass,
      role: 'FACULTY',
      facultyId: 'FAC-CSE-001',
      designation: 'Associate Professor & Chairman, Dept of CSE',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'CSE',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300',
      bio: 'Chairman, Department of Computer Science & Engineering, FST, BUP. Research: Distributed algorithms, cloud security, and computer vision.',
    },
    {
      name: 'Assistant Professor Nazneen Akhter',
      email: 'nazneen@bup.edu.bd',
      password: facultyPass,
      role: 'FACULTY',
      facultyId: 'FAC-ICT-001',
      designation: 'Assistant Professor & Coordinator, Dept of ICT',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      bio: 'Assistant Professor, Department of ICT, FST, BUP. Supervisor for BUP Social (BUPSoCo) capstone project. Specialization: Data Structures, OOP, and Networks.',
    },
    {
      name: 'Assistant Professor Suman Saha',
      email: 'sumansaha@bup.edu.bd',
      password: facultyPass,
      role: 'FACULTY',
      facultyId: 'FAC-ICT-002',
      designation: 'Assistant Professor & Co-Supervisor, Dept of ICT',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      bio: 'Assistant Professor, Department of ICT, BUP. Co-supervisor for BUP Social research initiative. Research: Digital Electronics, embedded IoT, and signal processing.',
    },
    {
      name: 'Assistant Professor Dr. Kazi Abu Taher',
      email: 'taher@bup.edu.bd',
      password: facultyPass,
      role: 'FACULTY',
      facultyId: 'FAC-CSE-002',
      designation: 'Assistant Professor, Dept of CSE',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'CSE',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      bio: 'Assistant Professor, Dept of CSE. Research: Relational database theory, cyber threat intelligence, and machine learning.',
    },
  ];

  for (const f of facultyMembers) {
    await prisma.user.upsert({
      where: { email: f.email },
      update: f,
      create: f,
    });
  }
  console.log('✅ Faculty and Dean accounts created.');

  // 3. Official Core Student Representatives (Proposal Authors)
  const students = [
    {
      name: 'Safaytul Islam Rafi',
      email: 'rafi@bup.edu.bd',
      password: studentPass,
      role: 'STUDENT',
      studentId: '24549010064',
      designation: 'Student CR',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      programName: 'B.Sc. in ICT',
      batchName: 'ICT-2024',
      sectionName: 'Section A',
      isVerified: true,
      leadTimeMinutes: 15,
      deviceType: 'browser',
      soundEnabled: true,
      coursePreferences: JSON.stringify(['ICT-1101', 'ICT-2201', 'ICT-2202', 'ICT-2203', 'CSE-3101']),
      favoriteClubs: JSON.stringify(['BUP InfoTech Club (BUPITC)', 'BUP Robotics Club (BUPRC)']),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      bio: 'Class Representative, Department of ICT (FST Batch 2024, Section A). Core author of BUP Social project proposal.',
    },
    {
      name: 'Munshi Tanvir Hossain',
      email: 'tanvir@bup.edu.bd',
      password: studentPass,
      role: 'STUDENT',
      studentId: '22549010076',
      designation: 'Section B Lead',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ICT',
      programName: 'B.Sc. in ICT',
      batchName: 'ICT-2024',
      sectionName: 'Section B',
      isVerified: true,
      leadTimeMinutes: 10,
      deviceType: 'android_pwa',
      soundEnabled: true,
      coursePreferences: JSON.stringify(['ICT-2201', 'ICT-2202', 'ICT-3101', 'ICT-4103']),
      favoriteClubs: JSON.stringify(['BUP Robotics Club (BUPRC)', 'BUP IEEE Student Branch']),
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
      bio: 'Lead Developer & Student Researcher, Dept of ICT, FST, BUP. Full-stack architect & robotics enthusiast.',
    },
    {
      name: 'Mahim Ismail',
      email: 'mahim@bup.edu.bd',
      password: studentPass,
      role: 'STUDENT',
      studentId: '24549010045',
      designation: 'Student',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'CSE',
      programName: 'B.Sc. in CSE',
      batchName: 'CSE-2024',
      sectionName: 'Section A',
      isVerified: true,
      leadTimeMinutes: 15,
      deviceType: 'browser',
      soundEnabled: true,
      coursePreferences: JSON.stringify(['CSE-1101', 'CSE-2103', 'CSE-3101']),
      favoriteClubs: JSON.stringify(['BUP InfoTech Club (BUPITC)', 'BUP Career & Leadership Club (BCLC)']),
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
      bio: 'CSE Batch 2024 researcher. Co-author of BUP Social research study on academic collaboration.',
    },
    {
      name: 'Sulayman Akhand Rahul',
      email: 'rahul@bup.edu.bd',
      password: studentPass,
      role: 'STUDENT',
      studentId: '23549009014',
      designation: 'Student',
      facultyName: 'Faculty of Science & Technology (FST)',
      departmentCode: 'ENV',
      programName: 'B.Sc. in Environmental Science',
      batchName: 'ENV-2024',
      sectionName: 'Section B',
      isVerified: true,
      leadTimeMinutes: 20,
      deviceType: 'browser',
      soundEnabled: true,
      coursePreferences: JSON.stringify(['ENV-1101', 'ENV-2101', 'ENV-3101']),
      favoriteClubs: JSON.stringify(['BUP Environmental Club (BUPEC)', 'BUP Debate Club (BUPDC)']),
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300',
      bio: 'Department of Environmental Science, FST. Active debater and campus green initiative lead.',
    },
  ];

  for (const s of students) {
    const existing = await prisma.user.findUnique({ where: { email: s.email } });
    if (existing) {
      await prisma.user.update({
        where: { email: s.email },
        data: {
          name: s.name,
          designation: s.designation,
          facultyName: s.facultyName,
          departmentCode: s.departmentCode,
          programName: s.programName,
          batchName: s.batchName,
          sectionName: s.sectionName,
          coursePreferences: s.coursePreferences,
          favoriteClubs: s.favoriteClubs,
          bio: s.bio,
          avatar: s.avatar,
        },
      });
    } else {
      await prisma.user.create({ data: s });
    }
  }
  console.log('✅ Student accounts updated.');

  // 4. Seed Official Admission Notices & Academic Notices (Req 7 & 8)
  const deanUser = await prisma.user.findUnique({ where: { email: 'dean.fst@bup.edu.bd' } });
  const nazneenUser = await prisma.user.findUnique({ where: { email: 'nazneen@bup.edu.bd' } });

  const notices = [
    {
      title: 'BUP Undergraduate Admission Circular Session 2026-2027 (Faculty of Science & Technology)',
      content: `Official notice for all prospective candidates:
Applications are invited from eligible candidates for admission into Undergraduate Programs under the Faculty of Science and Technology (FST) for the Academic Session 2026-2027:
- B.Sc. in Information and Communication Technology (ICT)
- B.Sc. in Computer Science and Engineering (CSE)
- B.Sc. in Environmental Science (ES)

1. Online Application Window: 15 November 2026 to 20 December 2026 (via https://admission.bup.edu.bd).
2. Written Admission Test Date: Saturday, 16 January 2027 from 10:00 AM to 11:30 AM at BUP Mirpur Cantonment Campus.
3. Test Subjects: Mathematics (30 marks), Physics (30 marks), Chemistry (20 marks), English (20 marks).
4. Minimum Eligibility: Candidates must have passed SSC and HSC or equivalent in Science group with a minimum GPA of 4.50 in both exams.

Direct Portal: https://admission.bup.edu.bd`,
      category: 'GENERAL',
      scope: 'CAMPUS',
      departmentCode: 'ALL',
      courseCode: 'ALL',
      sectionName: 'ALL',
      urgency: 'IMPORTANT',
      attachmentName: 'BUP_Undergraduate_Admission_Circular_2026_27_FST.pdf',
      attachmentUrl: 'https://admission.bup.edu.bd',
      authorId: deanUser.id,
      authorName: deanUser.name,
      authorRole: 'FACULTY',
      authorDesignation: 'Dean, Faculty of Science and Technology',
    },
    {
      title: 'Postgraduate Professional Masters Admission: MICT, MCSE, MISS & MESM Spring 2026 Intake',
      content: `The Faculty of Science and Technology (FST) invites applications for self-financed Professional Masters Programs:
- Master in Information & Communication Technology (MICT)
- Master in Computer Science & Engineering (MCSE)
- Master in Information Systems Security (MISS)
- M.Sc. in Environmental Science & Management (MESM)

Application Deadline: 25 December 2026.
Classes commence on Friday & Saturday (Executive weekend schedule). Apply online at https://bup.edu.bd.`,
      category: 'GENERAL',
      scope: 'DEPARTMENT',
      departmentCode: 'ICT',
      courseCode: 'ALL',
      sectionName: 'ALL',
      urgency: 'NORMAL',
      attachmentName: 'FST_Professional_Masters_Circular_Spring2026.pdf',
      attachmentUrl: 'https://bup.edu.bd',
      authorId: deanUser.id,
      authorName: deanUser.name,
      authorRole: 'FACULTY',
      authorDesignation: 'Dean, Faculty of Science and Technology',
    },
    {
      title: 'Call for Research Papers: Journal of Faculty of Science and Technology (JFST) Vol. 5',
      content: `Faculty members, researchers, and graduate students are invited to submit original, unpublished research manuscripts for the upcoming issue of the peer-reviewed Journal of Faculty of Science and Technology (JFST), Volume 5, Issue 1.
Tracks:
- Track A: Artificial Intelligence, Deep Learning & Cyber Defense (ICT & CSE)
- Track B: River Basin Modeling, Climate Risk & Environmental Engineering (ENV)
- Track C: Quantum Information & High-Performance Distributed Computing (DS)

Submission Deadline: 10 January 2027. Manuscripts must adhere to IEEE double-column format.`,
      category: 'GENERAL',
      scope: 'CAMPUS',
      departmentCode: 'ALL',
      courseCode: 'ALL',
      sectionName: 'ALL',
      urgency: 'IMPORTANT',
      attachmentName: 'JFST_Call_For_Papers_Vol5_Guidelines.pdf',
      attachmentUrl: 'https://bup.edu.bd',
      authorId: deanUser.id,
      authorName: deanUser.name,
      authorRole: 'FACULTY',
      authorDesignation: 'Dean, Faculty of Science and Technology',
    },
    {
      title: 'ICT-2201 Data Structures Midterm Examination & Laboratory Viva Schedule (Section A)',
      content: `Dear Section A students,
The Spring 2026 Midterm Examination for ICT-2201 (Data Structures and Algorithms) will be held on Tuesday, 10 November 2026 at Academic Block 2, Room 402 from 10:30 AM to 12:00 PM.
Syllabus:
- Asymptotic Notation & Complexity Analysis
- Balanced Binary Search Trees (AVL Rotations)
- Dijkstra's Shortest Path & Prim's MST
Bring your university ID card and scientific calculator.`,
      category: 'EXAM',
      scope: 'SECTION',
      departmentCode: 'ICT',
      courseCode: 'ICT-2201',
      sectionName: 'Section A',
      urgency: 'IMPORTANT',
      attachmentName: 'ICT2201_Midterm_Syllabus_SectionA.pdf',
      attachmentUrl: 'https://bup.edu.bd',
      authorId: nazneenUser.id,
      authorName: nazneenUser.name,
      authorRole: 'FACULTY',
      authorDesignation: 'Assistant Professor, Dept of ICT',
    },
    {
      title: 'ICT-2201 Data Structures Midterm Examination (Section B)',
      content: `Dear Section B students,
The Midterm assessment for ICT-2201 Section B will be conducted on Wednesday, 11 November 2026 in Academic Block 2, Room 405 from 09:00 AM to 10:30 AM.
Please review Hash Tables (Chaining vs Open Addressing) and Graph Traversals (BFS/DFS).`,
      category: 'EXAM',
      scope: 'SECTION',
      departmentCode: 'ICT',
      courseCode: 'ICT-2201',
      sectionName: 'Section B',
      urgency: 'IMPORTANT',
      attachmentName: 'ICT2201_Midterm_Syllabus_SectionB.pdf',
      attachmentUrl: 'https://bup.edu.bd',
      authorId: nazneenUser.id,
      authorName: nazneenUser.name,
      authorRole: 'FACULTY',
      authorDesignation: 'Assistant Professor, Dept of ICT',
    },
  ];

  for (const n of notices) {
    // Check if duplicate title exists
    const existing = await prisma.facultyNotice.findFirst({ where: { title: n.title } });
    if (!existing) {
      await prisma.facultyNotice.create({ data: n });
    }
  }
  console.log('✅ Admission & Academic Notices seeded.');

  console.log('🎉 Successfully seeded BUP FST Ecosystem!');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
