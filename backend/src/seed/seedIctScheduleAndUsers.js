import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';

async function seedIctScheduleAndUsers() {
  console.log('🚀 Seeding authentic BUP Department of ICT Schedule and Users into MySQL...');

  const facultyPass = await bcrypt.hash('faculty123', 10);
  const studentPass = await bcrypt.hash('bup123', 10);

  // 1. Official Faculty Accounts
  const facultyUsers = [
    {
      name: 'Col Mohammed Omar Faruque, PhD',
      email: 'chairman.ict@bup.edu.bd',
      role: 'FACULTY',
      facultyId: 'FAC-ICT-CHAIR-01',
      designation: 'Chairman, Department of ICT',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      bio: 'Chairman, Department of Information and Communication Engineering, FST, BUP.',
    },
    {
      name: 'Prof. Dr. Fahima Tabassum',
      email: 'fahima@bup.edu.bd',
      role: 'FACULTY',
      facultyId: 'FAC-ICT-FAHIMA-01',
      designation: 'Professor, Software Engineering',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300',
      bio: 'Course Head: Software Testing & Maintenance (ICE-4101).',
    },
    {
      name: 'Lecturer Md. Istakiak Adnan Palash',
      email: 'adnan@bup.edu.bd',
      role: 'FACULTY',
      facultyId: 'FAC-ICT-ADNAN-01',
      designation: 'Lecturer in Web Technologies',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      bio: 'Instructor: Web Technologies (ICE-3205) & Laboratory (ICE-3206).',
    },
    {
      name: 'Lecturer Samia Ahmed',
      email: 'samia@bup.edu.bd',
      role: 'FACULTY',
      facultyId: 'FAC-ICT-SAMIA-01',
      designation: 'Lecturer in Algorithms & Data Structures',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
      bio: 'Instructor: Data Structure (ICE-2201) & Laboratory (ICE-2202).',
    },
    {
      name: 'Assistant Professor Saiful Islam',
      email: 'saifulislam@bup.edu.bd',
      role: 'FACULTY',
      facultyId: 'FAC-ICT-SAIFUL-01',
      designation: 'Assistant Professor in Signals & Systems',
      departmentCode: 'ICT',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
      bio: 'Instructor: Signals and Systems (ICE-2205).',
    },
  ];

  for (const f of facultyUsers) {
    await prisma.user.upsert({
      where: { email: f.email },
      update: f,
      create: { ...f, password: facultyPass },
    });
  }

  // 2. Official Student Accounts
  const studentUsers = [
    {
      name: 'Anika Tahsin',
      email: 'anika@bup.edu.bd',
      role: 'STUDENT',
      studentId: '25549010042',
      departmentCode: 'ICT',
      batchName: 'BICE-2025',
      sectionName: 'Section A',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      bio: '2nd Year Student, Dept of ICT (Section A). Class Representative.',
    },
    {
      name: 'Sadia Rahman',
      email: 'sadia@bup.edu.bd',
      role: 'STUDENT',
      studentId: '26549010018',
      departmentCode: 'ICT',
      batchName: 'BICE-2026',
      sectionName: 'Section B',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      bio: '1st Year Freshman, Dept of ICT (Section B).',
    },
    {
      name: 'Fahim Al Farabi',
      email: 'fahim@bup.edu.bd',
      role: 'STUDENT',
      studentId: '5126010005',
      departmentCode: 'ICT',
      batchName: 'MICE-2026',
      sectionName: 'Section A',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'M.Sc. Postgraduate Student & Graduate Researcher in ICT.',
    },
  ];

  for (const s of studentUsers) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: s,
      create: { ...s, password: studentPass },
    });
  }

  console.log('✅ Users successfully seeded into MySQL!');

  // 3. Official Department of ICT Routine Entries
  const routines = [
    // Sunday BICE-2024
    {
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section B',
      dayOfWeek: 'Sunday',
      courseCode: 'ICE-3205',
      courseTitle: 'Web Technologies',
      startTime: '08:30 AM',
      endTime: '10:00 AM',
      room: 'ST 503',
      instructorName: 'Lec. Md. Istakiak Adnan Palash',
    },
    {
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section A',
      dayOfWeek: 'Sunday',
      courseCode: 'ICE-3207',
      courseTitle: 'Software and Requirement Engineering',
      startTime: '08:30 AM',
      endTime: '10:00 AM',
      room: 'ST 504',
      instructorName: 'Asst. Prof. Nazneen Akter',
    },
    {
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section A',
      dayOfWeek: 'Sunday',
      courseCode: 'ICE-3205',
      courseTitle: 'Web Technologies',
      startTime: '10:15 AM',
      endTime: '11:45 AM',
      room: 'ST 503',
      instructorName: 'Lec. Md. Istakiak Adnan Palash',
    },
    {
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section B',
      dayOfWeek: 'Sunday',
      courseCode: 'ICE-3208',
      courseTitle: 'Software and Requirement Engineering Laboratory',
      startTime: '10:15 AM',
      endTime: '01:15 PM',
      room: 'LAB1 Annex',
      instructorName: 'Asst. Prof. Nazneen Akhter + Asst. Prof. Suman Saha',
    },
    // Monday BICE-2024
    {
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section A',
      dayOfWeek: 'Monday',
      courseCode: 'ICE-3201',
      courseTitle: 'Microprocessor and Computer Architecture',
      startTime: '08:30 AM',
      endTime: '10:00 AM',
      room: 'ST 504',
      instructorName: 'Prof. Dr. Mosabber Uddin Ahmed',
    },
    {
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2024',
      sectionName: 'Section B',
      dayOfWeek: 'Monday',
      courseCode: 'ICE-3201',
      courseTitle: 'Microprocessor and Computer Architecture',
      startTime: '10:15 AM',
      endTime: '11:45 AM',
      room: 'ST 504',
      instructorName: 'Prof. Dr. Mosabber Uddin Ahmed',
    },
    // Monday BICE-2025
    {
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2025',
      sectionName: 'Section A',
      dayOfWeek: 'Monday',
      courseCode: 'MATH-2207',
      courseTitle: 'Mathematics-IV (Vector Analysis & Complex Variables)',
      startTime: '08:30 AM',
      endTime: '10:00 AM',
      room: 'ST 601',
      instructorName: 'Col Mohammed Omar Faruque, PhD (Chairman)',
    },
    {
      departmentCode: 'ICT',
      programName: 'BICE',
      batchName: 'BICE-2025',
      sectionName: 'Section B',
      dayOfWeek: 'Monday',
      courseCode: 'ICE-2201',
      courseTitle: 'Data Structure',
      startTime: '08:30 AM',
      endTime: '10:00 AM',
      room: 'ST 602',
      instructorName: 'Lec Samia Ahmed',
    },
  ];

  for (const r of routines) {
    const existing = await prisma.routineEntry.findFirst({
      where: {
        batchName: r.batchName,
        sectionName: r.sectionName,
        dayOfWeek: r.dayOfWeek,
        courseCode: r.courseCode,
      },
    });

    if (!existing) {
      await prisma.routineEntry.create({ data: r });
    }
  }

  console.log('✅ Routine entries successfully seeded into MySQL!');
  await prisma.$disconnect();
}

seedIctScheduleAndUsers().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
