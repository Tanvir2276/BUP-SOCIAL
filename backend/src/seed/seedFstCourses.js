import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFstCourses() {
  console.log('🚀 Populating comprehensive BUP FST courses from https://bup.edu.bd/ ...');

  // Comprehensive FST courses
  const fstCourses = [
    // ICT Department
    {
      code: 'ICT-1101',
      title: 'Structured Programming Language (C)',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'C programming, memory layout, pointers, recursion, data representation, file handling, and algorithms.',
    },
    {
      code: 'ICT-1102',
      title: 'Structured Programming Language Sessional',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 1.5,
      semester: 'Spring 2026',
      description: 'Hands-on programming assignments, pointer arithmetic, dynamic memory allocation in Linux/GCC environment.',
    },
    {
      code: 'ICT-1201',
      title: 'Discrete Mathematics',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Propositional logic, predicate calculus, set theory, induction, relations, functions, graph theory.',
    },
    {
      code: 'ICT-2101',
      title: 'Object-Oriented Programming (OOP with Java & C++)',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Encapsulation, inheritance, polymorphism, abstract classes, design patterns, generics, multi-threading.',
    },
    {
      code: 'ICT-2102',
      title: 'Object-Oriented Programming Sessional',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 1.5,
      semester: 'Spring 2026',
      description: 'JavaFX GUI projects, multithreaded socket chat systems, and OOP system architecture.',
    },
    {
      code: 'ICT-2201',
      title: 'Data Structures and Algorithms',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Arrays, linked lists, stacks, queues, trees, balanced AVL trees, hashing, graph algorithms, asymptotic analysis.',
    },
    {
      code: 'ICT-2202',
      title: 'Data Structures Laboratory',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 1.5,
      semester: 'Spring 2026',
      description: 'Implementation of Dijkstra shortest paths, Minimum Spanning Trees (Kruskal/Prim), and binary search trees.',
    },
    {
      code: 'ICT-2203',
      title: 'Digital Electronics & Logic Design',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Boolean algebra, Karnaugh maps, sequential logic, flip-flops, multiplexers, counters, and FPGA basics.',
    },
    {
      code: 'ICT-3101',
      title: 'Database Management Systems (DBMS)',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Relational algebra, SQL, normal forms (1NF-BCNF), transaction ACID properties, concurrency control, B+ trees.',
    },
    {
      code: 'ICT-3102',
      title: 'Database Management Systems Sessional',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 1.5,
      semester: 'Spring 2026',
      description: 'MySQL schema design, indexing benchmarks, stored procedures, triggers, and full-stack DB integration.',
    },
    {
      code: 'ICT-3103',
      title: 'Data Communication & Computer Networks',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'OSI 7 layers, TCP/IP protocol suite, subnetting, routing algorithms (OSPF, BGP), Wireshark analysis.',
    },
    {
      code: 'ICT-3201',
      title: 'Software Engineering & Information System Design',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'SDLC, Agile Scrum methodologies, UML architectural models, automated testing, CI/CD pipelines.',
    },
    {
      code: 'ICT-4101',
      title: 'Artificial Intelligence & Machine Learning',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Search algorithms, heuristic A*, supervised & unsupervised ML, deep neural networks, computer vision.',
    },
    {
      code: 'ICT-4103',
      title: 'Cryptography and Network Security',
      departmentCode: 'ICT',
      departmentName: 'Department of ICT',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Symmetric/Asymmetric encryption, AES, RSA, ECC, cryptographic hashes, digital signatures, E2EE protocol.',
    },

    // CSE Department
    {
      code: 'CSE-1101',
      title: 'Introduction to Computer Systems & C',
      departmentCode: 'CSE',
      departmentName: 'Department of CSE',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Foundations of computation, binary logic, von Neumann architecture, algorithmic problem solving in C.',
    },
    {
      code: 'CSE-2103',
      title: 'Digital Logic Design (DLD)',
      departmentCode: 'CSE',
      departmentName: 'Department of CSE',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Combinational logic synthesis, registers, ALU design, state machines, hardware description languages (Verilog).',
    },
    {
      code: 'CSE-2201',
      title: 'Computer Architecture & Organization',
      departmentCode: 'CSE',
      departmentName: 'Department of CSE',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Instruction set architectures (RISC-V/MIPS), pipelining, cache memory hierarchies, superscalar execution.',
    },
    {
      code: 'CSE-3101',
      title: 'Database Management Systems',
      departmentCode: 'CSE',
      departmentName: 'Department of CSE',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Relational database theory, SQL optimization, schema normalization, locking mechanisms, distributed DBs.',
    },
    {
      code: 'CSE-3105',
      title: 'Operating Systems & System Programming',
      departmentCode: 'CSE',
      departmentName: 'Department of CSE',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Processes, CPU scheduling, synchronization primitives, deadlocks, virtual memory paging, ext4 filesystem.',
    },
    {
      code: 'CSE-3203',
      title: 'Microprocessors and Embedded Systems',
      departmentCode: 'CSE',
      departmentName: 'Department of CSE',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'ARM Cortex/x86 architectures, assembly language, interrupt handlers, I/O interfacing, sensor IoT networks.',
    },
    {
      code: 'CSE-4105',
      title: 'Distributed Cloud Computing',
      departmentCode: 'CSE',
      departmentName: 'Department of CSE',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Virtualization, Docker containers, Kubernetes orchestration, serverless microservices, CAP theorem.',
    },
    {
      code: 'CSE-4107',
      title: 'Machine Learning & Pattern Recognition',
      departmentCode: 'CSE',
      departmentName: 'Department of CSE',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Regression, classification, support vector machines, decision trees, clustering, reinforcement learning.',
    },

    // Environmental Science Department (FST)
    {
      code: 'ENV-1101',
      title: 'Introduction to Environmental Science',
      departmentCode: 'ENV',
      departmentName: 'Department of Environmental Science',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Atmosphere, hydrosphere, lithosphere, biosphere interactions, biogeochemical cycles, sustainable ecology.',
    },
    {
      code: 'ENV-2101',
      title: 'Environmental Chemistry & Ecology',
      departmentCode: 'ENV',
      departmentName: 'Department of Environmental Science',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Aquatic chemistry, atmospheric pollutants, heavy metal toxicology, biodiversity conservation in Bangladesh.',
    },
    {
      code: 'ENV-3101',
      title: 'Climate Change, GIS & Disaster Management',
      departmentCode: 'ENV',
      departmentName: 'Department of Environmental Science',
      credits: 3.0,
      semester: 'Spring 2026',
      description: 'Global warming modeling, satellite remote sensing, flood mitigation, Cyclone early warning systems in Delta regions.',
    },
  ];

  // 1. Ensure ENV department exists
  await prisma.departmentEntity.upsert({
    where: { code: 'ENV' },
    update: { coursesCount: 3 },
    create: {
      code: 'ENV',
      name: 'Department of Environmental Science',
      facultyCode: 'FST',
      description: 'Climate modeling, environmental technology, ecology, disaster risk reduction, and green energy.',
      coursesCount: 3,
      icon: 'TreePine',
    },
  });

  // 2. Upsert each course
  for (const course of fstCourses) {
    await prisma.courseEntity.upsert({
      where: { code: course.code },
      update: {
        title: course.title,
        departmentCode: course.departmentCode,
        departmentName: course.departmentName,
        credits: course.credits,
        semester: course.semester,
        description: course.description,
      },
      create: course,
    });
  }
  console.log(`✅ Upserted ${fstCourses.length} FST courses.`);

  // 3. Create/Upsert Sections for all FST courses
  const instructors = [
    { name: 'Assistant Professor Nazneen Akhter', email: 'nazneen@bup.edu.bd' },
    { name: 'Assistant Professor Suman Saha', email: 'sumansaha@bup.edu.bd' },
    { name: 'Associate Professor Dr. Md. Sabir Hossain', email: 'sabir@bup.edu.bd' },
    { name: 'Assistant Professor Dr. Kazi Abu Taher', email: 'taher@bup.edu.bd' },
  ];

  for (let i = 0; i < fstCourses.length; i++) {
    const c = fstCourses[i];
    const instA = instructors[i % instructors.length];
    const instB = instructors[(i + 1) % instructors.length];

    // Check if sections already exist
    const existingSections = await prisma.courseSection.findMany({
      where: { courseCode: c.code },
    });

    if (existingSections.length === 0) {
      await prisma.courseSection.createMany({
        data: [
          {
            courseCode: c.code,
            sectionName: 'Section A',
            instructorName: instA.name,
            instructorEmail: instA.email,
            room: `Academic Block 2, Room ${401 + (i % 8)}`,
            schedule: 'Sun 10:30 AM - 12:00 PM, Tue 10:30 AM - 12:00 PM',
            capacity: 45,
            enrolledCount: 42,
          },
          {
            courseCode: c.code,
            sectionName: 'Section B',
            instructorName: instB.name,
            instructorEmail: instB.email,
            room: `Academic Block 2, Room ${402 + (i % 8)}`,
            schedule: 'Mon 09:00 AM - 10:30 AM, Wed 09:00 AM - 10:30 AM',
            capacity: 45,
            enrolledCount: 39,
          },
        ],
      });
    }
  }
  console.log('✅ Created Section A and Section B for all FST courses.');

  // 4. Enroll core demo accounts and bulk students into these FST courses
  const allFstCodes = fstCourses.map((c) => c.code);
  const coreStudentFstCourses = allFstCodes.slice(0, 8); // Top 8 semester courses
  const coursePrefsJson = JSON.stringify(coreStudentFstCourses);

  // Enroll Rafi (Section A)
  await prisma.user.updateMany({
    where: { email: 'rafi@bup.edu.bd' },
    data: {
      coursePreferences: coursePrefsJson,
      departmentCode: 'ICT',
      facultyName: 'Faculty of Science & Technology (FST)',
      sectionName: 'Section A',
    },
  });

  // Enroll Tanvir (Section B Lead)
  await prisma.user.updateMany({
    where: { email: 'tanvir@bup.edu.bd' },
    data: {
      coursePreferences: coursePrefsJson,
      departmentCode: 'ICT',
      facultyName: 'Faculty of Science & Technology (FST)',
      sectionName: 'Section B',
    },
  });

  // Enroll bulk students as well
  await prisma.user.updateMany({
    where: { role: 'STUDENT', departmentCode: 'ICT' },
    data: {
      coursePreferences: coursePrefsJson,
      facultyName: 'Faculty of Science & Technology (FST)',
    },
  });

  console.log('🎉 Successfully enrolled students in FST courses from https://bup.edu.bd/!');
  await prisma.$disconnect();
}

seedFstCourses().catch((err) => {
  console.error('Error seeding FST courses:', err);
  process.exit(1);
});
