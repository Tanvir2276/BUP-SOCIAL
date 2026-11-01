import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  FolderOpen,
  Eye,
  X,
  Code,
  Radio,
  Cpu,
  ShieldCheck,
  Check,
  GraduationCap,
} from 'lucide-react';
import {
  BUP_3_1_NOTES_CATALOG,
  SRE_HANDWRITTEN_NOTES,
  AcademicNoteItem,
} from '../data/bupNotesCatalog';

export { SRE_HANDWRITTEN_NOTES };

// 2. Complete Catalog of 3.2 Mid-Term Notes from user folders
export const BUP_MIDTERM_NOTES_CATALOG: AcademicNoteItem[] = [
  // ==================== SRE (Software & Requirement Engineering - ICE 3201) ====================
  {
    id: 'sre-1',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter / Asst. Prof. Suman Saha',
    title: 'Lecture 1: Software Development Life Cycle (SDLC) Overview',
    filename: 'Lec_1SDLC.pdf',
    url: '/notes/SRE/Lec_1SDLC.pdf',
    size: '502 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-2',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'Lecture 1: The History and Evolution of Software Engineering',
    filename: 'Lec_1TheHistoryofSoftware.pdf',
    url: '/notes/SRE/Lec_1TheHistoryofSoftware.pdf',
    size: '151 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-3',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'Lecture 2: SDLC Models (Waterfall, Spiral, V-Model & Agile)',
    filename: 'Lec_2SDLC.pdf',
    url: '/notes/SRE/Lec_2SDLC.pdf',
    size: '452 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-4',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'Lecture 3: Software Requirements Specification (SRS) Standards',
    filename: 'Lec_3Requiremnet.pdf',
    url: '/notes/SRE/Lec_3Requiremnet.pdf',
    size: '371 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-5',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'Lecture 4: Requirements Engineering Process & Elicitation',
    filename: 'Lec_4RequirementsEngineeringProcess.pdf',
    url: '/notes/SRE/Lec_4RequirementsEngineeringProcess.pdf',
    size: '311 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-6',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'Lecture 6: User Stories, Acceptance Criteria & Backlog Grooming',
    filename: 'Lec_6User_Stories.pdf',
    url: '/notes/SRE/Lec_6User_Stories.pdf',
    size: '127 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-7',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'Lecture 10: Software Testing, Verification & Validation',
    filename: 'Lec_10.pdf',
    url: '/notes/SRE/Lec_10.pdf',
    size: '122 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-8',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'Functional and Non-Functional Requirements Complete Handbook',
    filename: 'FunctionalNon-FunctionalRequirement.pdf',
    url: '/notes/SRE/FunctionalNon-FunctionalRequirement.pdf',
    size: '491 KB',
    format: 'PDF',
    category: 'Handwritten Note',
  },
  {
    id: 'sre-9',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'IEEE-CS / ACM Software Engineering Code of Ethics',
    filename: 'SoftwareEngineeringCodeofEthics.pdf',
    url: '/notes/SRE/SoftwareEngineeringCodeofEthics.pdf',
    size: '71 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-10',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'Classroom Activity & Case Studies on Requirements Elicitation',
    filename: 'ClassroomActivity.pdf',
    url: '/notes/SRE/ClassroomActivity.pdf',
    size: '51 KB',
    format: 'PDF',
    category: 'Practice Question',
  },
  {
    id: 'sre-11',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'Project Planning & Feasibility Study (Practical Example)',
    filename: 'Planning-Example.pdf',
    url: '/notes/SRE/Planning-Example.pdf',
    size: '78 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-12',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'Library Management System Questionnaire for Stakeholder Interviews',
    filename: 'Questionaries_LibraryManagementSystem.pdf',
    url: '/notes/SRE/Questionaries_LibraryManagementSystem.pdf',
    size: '136 KB',
    format: 'PDF',
    category: 'Practice Question',
  },
  {
    id: 'sre-13',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'Comprehensive Types of Software Requirements Classification',
    filename: 'TypesofRequirements.pdf',
    url: '/notes/SRE/TypesofRequirements.pdf',
    size: '70 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'sre-14',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'UML Activity Diagram Specifications & Case Studies',
    filename: 'Activity Diagram.docx',
    url: '/notes/SRE/Activity%20Diagram.docx',
    size: '177 KB',
    format: 'DOCX',
    category: 'Diagram',
  },
  {
    id: 'sre-15',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'UML Class Diagram Design Patterns & Relationships',
    filename: 'Class Diagram.docx',
    url: '/notes/SRE/Class%20Diagram.docx',
    size: '220 KB',
    format: 'DOCX',
    category: 'Diagram',
  },
  {
    id: 'sre-16',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'Data Flow Diagram (DFD Level 0, 1 & 2) Architecture',
    filename: 'Data_Flow_Diagram.docx',
    url: '/notes/SRE/Data_Flow_Diagram.docx',
    size: '480 KB',
    format: 'DOCX',
    category: 'Diagram',
  },
  {
    id: 'sre-17',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'UML Use Case Diagram & System Boundary Modeling',
    filename: 'Use Case Diagram.docx',
    url: '/notes/SRE/Use%20Case%20Diagram.docx',
    size: '180 KB',
    format: 'DOCX',
    category: 'Diagram',
  },
  {
    id: 'sre-18',
    course: 'SRE',
    courseCode: 'ICE-3201',
    courseTitle: 'Software and Requirement Engineering',
    faculty: 'Asst. Prof. Nazneen Akhter',
    title: 'SRE Mid-Term Exam Suggestions & Important Question List',
    filename: 'suggestions.txt',
    url: '/notes/SRE/suggestions.txt',
    size: '1 KB',
    format: 'TXT',
    category: 'Practice Question',
  },

  // ==================== WT (Web Technology - ICE 3205) ====================
  {
    id: 'wt-1',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash / Asst. Prof. Suman Saha',
    title: 'Lecture 1: Introduction to Internet Architecture, Protocols & HTTP/HTTPS',
    filename: '1.IntroductiontoInternetandHTTP.pdf',
    url: '/notes/WT/1.IntroductiontoInternetandHTTP.pdf',
    size: '1.5 MB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'wt-2',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash',
    title: 'Lecture 2: Introduction to HTML5, Document Structure & Semantics',
    filename: '2.IntroductiontoHTML.pdf',
    url: '/notes/WT/2.IntroductiontoHTML.pdf',
    size: '771 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'wt-3',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash',
    title: 'Lecture 3: HTML Tables, Ordered/Unordered Lists and Form Controls',
    filename: '3.HTMLTableListsForms.pdf',
    url: '/notes/WT/3.HTMLTableListsForms.pdf',
    size: '1.0 MB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'wt-4',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'Lecture 4: Introduction to CSS (Selectors, Cascade, Specificity & Colors)',
    filename: '4.IntroductiontoCSS.pdf',
    url: '/notes/WT/4.IntroductiontoCSS.pdf',
    size: '686 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'wt-5',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash',
    title: 'Lecture 5: CSS Box Model, Flexbox, Responsive Grid & Media Queries',
    filename: '5.CSS.pdf',
    url: '/notes/WT/5.CSS.pdf',
    size: '901 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'wt-6',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash',
    title: 'Class Test 1 (CT-1) Official Question Paper & Model Solution',
    filename: 'CT-1.pdf',
    url: '/notes/WT/CT-1.pdf',
    size: '165 KB',
    format: 'PDF',
    category: 'Practice Question',
  },
  {
    id: 'wt-7',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash',
    title: 'Class Test 2 (CT-2) Official Question Paper & Evaluation Scheme',
    filename: 'CT-2 .pdf',
    url: '/notes/WT/CT-2%20.pdf',
    size: '118 KB',
    format: 'PDF',
    category: 'Practice Question',
  },
  {
    id: 'wt-8',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'Practice HTML-CSS Lab Problems with Code Samples',
    filename: 'Practice HTML-CSS.pdf',
    url: '/notes/WT/Practice%20HTML-CSS.pdf',
    size: '118 KB',
    format: 'PDF',
    category: 'Practice Question',
  },
  {
    id: 'wt-9',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash',
    title: 'Web Technologies Mid-Term Exam Practice Problems Set A',
    filename: 'Practice Problems.pdf',
    url: '/notes/WT/Practice%20Problems.pdf',
    size: '129 KB',
    format: 'PDF',
    category: 'Practice Question',
  },
  {
    id: 'wt-10',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Asst. Prof. Suman Saha',
    title: 'Comprehensive Web Technologies Practice Problem Set B',
    filename: 'PracticeProblems.pdf',
    url: '/notes/WT/PracticeProblems.pdf',
    size: '144 KB',
    format: 'PDF',
    category: 'Practice Question',
  },
  {
    id: 'wt-11',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash',
    title: 'HTML & CSS Layout Sheet 1: Semantic Navigation & Header',
    filename: 'HTML (1).png',
    url: '/notes/WT/HTML%20(1).png',
    size: '2.8 MB',
    format: 'IMAGE',
    category: 'Diagram',
  },
  {
    id: 'wt-12',
    course: 'WT',
    courseCode: 'ICE-3205',
    courseTitle: 'Web Technologies',
    faculty: 'Lec. Md. Istakiak Adnan Palash',
    title: 'HTML & CSS Layout Sheet 2: Form Elements & Validation',
    filename: 'HTML (2).png',
    url: '/notes/WT/HTML%20(2).png',
    size: '2.7 MB',
    format: 'IMAGE',
    category: 'Diagram',
  },

  // ==================== MCA (Microprocessor & Computer Architecture - ICE 3203) ====================
  {
    id: 'mca-1',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 1 Part 1: Microprocessor Architecture & 8086 Block Diagram',
    filename: 'ICE 3203_Lecture1_part1.pdf',
    url: '/notes/MCA/ICE%203203_Lecture1_part1.pdf',
    size: '639 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-2',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 1 Part 2: Bus Interface Unit (BIU) & Execution Unit (EU)',
    filename: 'ICE 3203_Lecture1_part2.pdf',
    url: '/notes/MCA/ICE%203203_Lecture1_part2.pdf',
    size: '607 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-3',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 1 Part 3: General Purpose Registers & Flag Register',
    filename: 'ICE 3203_Lecture1_part3.pdf',
    url: '/notes/MCA/ICE%203203_Lecture1_part3.pdf',
    size: '243 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-4',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 2: 8086 Addressing Modes & Operand Fetching',
    filename: 'ICE 3203_Lecture2.pdf',
    url: '/notes/MCA/ICE%203203_Lecture2.pdf',
    size: '245 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-5',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 3: 8086 Instruction Set (Data Transfer & Arithmetic)',
    filename: 'ICE 3203_Lecture3.pdf',
    url: '/notes/MCA/ICE%203203_Lecture3.pdf',
    size: '163 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-6',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 4: Logical, Shift, Rotate & Branching Instructions',
    filename: 'ICE 3203_Lecture4.pdf',
    url: '/notes/MCA/ICE%203203_Lecture4.pdf',
    size: '205 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-7',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 5: Assembly Language Programming Subroutines & Macros',
    filename: 'ICE 3203_Lecture5.pdf',
    url: '/notes/MCA/ICE%203203_Lecture5.pdf',
    size: '170 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-8',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 7: 8086 Hardware Specifications, Pin Diagram & Signals',
    filename: 'ICE3203_Lecture7.pdf',
    url: '/notes/MCA/ICE3203_Lecture7.pdf',
    size: '210 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-9',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 8: Memory Interfacing & Address Decoding Logic',
    filename: 'ICE3203_Lecture8.pdf',
    url: '/notes/MCA/ICE3203_Lecture8.pdf',
    size: '200 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-10',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 9: Programmable Peripheral Interface (8255 PPI)',
    filename: 'ICE3203_Lecture9.pdf',
    url: '/notes/MCA/ICE3203_Lecture9.pdf',
    size: '176 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mca-11',
    course: 'MCA',
    courseCode: 'ICE-3203',
    courseTitle: 'Microprocessor and Computer Architecture',
    faculty: 'Prof. Dr. Mosabber Uddin Ahmed',
    title: 'ICE 3203 Lecture 10: 8254 Programmable Interval Timer & 8259 PIC',
    filename: 'ICE3203_Lecture10.pdf',
    url: '/notes/MCA/ICE3203_Lecture10.pdf',
    size: '141 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },

  // ==================== MEA (Microwave Engineering & Antenna - ICE 3204) ====================
  {
    id: 'mea-1',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Prof. Dr. Md. Zulfiker Mahmud / Asst. Prof. Md. Maynul Islam',
    title: 'Microwave Engineering Lecture 01: High Frequency Transmission Lines',
    filename: '01. MicroEngg Lec 01.pdf',
    url: '/notes/MEA/01.%20MicroEngg%20Lec%2001.pdf',
    size: '588 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mea-2',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Prof. Dr. Md. Zulfiker Mahmud',
    title: 'Microwave Engineering Lecture 02: Wave Propagation & Maxwell Equations',
    filename: '02. MicroEngg Lec 02.pdf',
    url: '/notes/MEA/02.%20MicroEngg%20Lec%2002.pdf',
    size: '668 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mea-3',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Prof. Dr. Md. Zulfiker Mahmud',
    title: 'Microwave Engineering Lecture 03: Rectangular Waveguides & Cutoff Frequency',
    filename: '03. MicroEngg Lec 03.pdf',
    url: '/notes/MEA/03.%20MicroEngg%20Lec%2003.pdf',
    size: '623 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mea-4',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Asst. Prof. Md. Maynul Islam',
    title: 'Microwave Engineering Lecture 04: TE and TM Modes in Waveguides',
    filename: '04. MicroEngg Lec 04.pdf',
    url: '/notes/MEA/04.%20MicroEngg%20Lec%2004.pdf',
    size: '698 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mea-5',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Prof. Dr. Md. Zulfiker Mahmud',
    title: 'Microwave Engineering Lecture 05: S-Parameters & Microwave Scattering Matrix',
    filename: '05. MicroEngg Lec 05.pdf',
    url: '/notes/MEA/05.%20MicroEngg%20Lec%2005.pdf',
    size: '787 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mea-6',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Asst. Prof. Md. Maynul Islam',
    title: 'Microwave Engineering Lecture 06: Antenna Radiation Pattern, Gain & Directivity',
    filename: '06. MicroEngg Lec 06.pdf',
    url: '/notes/MEA/06.%20MicroEngg%20Lec%2006.pdf',
    size: '646 KB',
    format: 'PDF',
    category: 'Lecture Slide',
  },
  {
    id: 'mea-7',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Prof. Dr. Md. Zulfiker Mahmud',
    title: 'Complete MEA Comprehensive Handwritten Class Note (Up to Mid-Term)',
    filename: 'MEA note (upto mid).pdf',
    url: '/notes/MEA/MEA%20note%20(upto%20mid).pdf',
    size: '11.5 MB',
    format: 'PDF',
    category: 'Handwritten Note',
  },
  {
    id: 'mea-8',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Asst. Prof. Md. Maynul Islam',
    title: 'Microwave Engineering Math Problems & Formula Solved Compilation',
    filename: 'PuuuMEA.pdf',
    url: '/notes/MEA/PuuuMEA.pdf',
    size: '7.8 MB',
    format: 'PDF',
    category: 'Practice Question',
  },
  {
    id: 'mea-9',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Prof. Dr. Md. Zulfiker Mahmud',
    title: 'Official MEA Course Syllabus & Marking Breakdown Part 1',
    filename: 'Syllabus-1.jpeg',
    url: '/notes/MEA/Syllabus-1.jpeg',
    size: '66 KB',
    format: 'IMAGE',
    category: 'Syllabus',
  },
  {
    id: 'mea-10',
    course: 'MEA',
    courseCode: 'ICE-3204',
    courseTitle: 'Microwave Engineering and Antenna',
    faculty: 'Prof. Dr. Md. Zulfiker Mahmud',
    title: 'Official MEA Course Syllabus & Marking Breakdown Part 2',
    filename: 'syllabus-2.jpeg',
    url: '/notes/MEA/syllabus-2.jpeg',
    size: '55 KB',
    format: 'IMAGE',
    category: 'Syllabus',
  },
];

export const ALL_COMBINED_NOTES: AcademicNoteItem[] = [
  ...BUP_MIDTERM_NOTES_CATALOG.map((n) => ({ ...n, level: '3.2' as const })),
  ...BUP_3_1_NOTES_CATALOG,
];

export const AcademicNotesHub: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | '3.2' | '3.1'>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<'ALL' | 'SRE' | 'WT' | 'MCA' | 'MEA' | 'DC' | 'DSP' | 'OS' | 'TS'>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<'ALL' | 'PDF' | 'IMAGE' | 'DOCX' | 'PPTX'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingImageModal, setViewingImageModal] = useState<any | null>(null);

  // Filter notes
  const filteredNotes = ALL_COMBINED_NOTES.filter((item) => {
    if (selectedLevel !== 'ALL' && item.level !== selectedLevel) return false;
    if (selectedCourse !== 'ALL' && item.course !== selectedCourse) return false;
    if (selectedFormat !== 'ALL' && item.format !== selectedFormat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesFile = item.filename.toLowerCase().includes(q);
      const matchesCourse = item.courseTitle.toLowerCase().includes(q) || item.courseCode.toLowerCase().includes(q);
      const matchesFaculty = item.faculty.toLowerCase().includes(q);
      if (!matchesTitle && !matchesFile && !matchesCourse && !matchesFaculty) return false;
    }
    return true;
  });

  const countForCourse = (course: string) => {
    if (course === 'ALL') {
      if (selectedLevel === 'ALL') return ALL_COMBINED_NOTES.length;
      return ALL_COMBINED_NOTES.filter((n) => n.level === selectedLevel).length;
    }
    return ALL_COMBINED_NOTES.filter((n) => n.course === course).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Hero Card */}
      <div className="bg-gradient-to-r from-bup-900 via-slate-900 to-bup-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/60">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> BUP Department of ICT • Level 3 (3.1 & 3.2)
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Official FST Syllabus Verified
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Academic Notes, Lectures & Exam Repository
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official faculty lecture slides, handwritten study sheets, class test papers, and reference documents published directly from both <strong className="text-cyan-300">Level 3.1 (DC, DSP, OS, TS)</strong> and <strong className="text-amber-300">Level 3.2 (MCA, MEA, SRE, WT)</strong> departmental folders.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:self-center">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block">
                {ALL_COMBINED_NOTES.length}
              </span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                Total Files Published
              </span>
            </div>
          </div>
        </div>

        {/* Level Switcher */}
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Academic Level:
          </span>
          {[
            { id: 'ALL', label: 'All Semesters' },
            { id: '3.1', label: 'Level 3, Term 1 (3.1 DC • DSP • OS • TS)' },
            { id: '3.2', label: 'Level 3, Term 2 (3.2 MCA • MEA • SRE • WT)' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => {
                setSelectedLevel(lvl.id as any);
                setSelectedCourse('ALL');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLevel === lvl.id
                  ? 'bg-white text-slate-950 shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Course Quick Switcher Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 text-xs font-bold">
          {[
            { id: 'ALL', label: 'All Courses', sub: 'Unified View' },
            { id: 'DC', label: 'DC (ICE-3103)', sub: 'Data Communication' },
            { id: 'DSP', label: 'DSP (ICE-3107)', sub: 'Digital Signal Proc' },
            { id: 'OS', label: 'OS (ICE-3105)', sub: 'Operating Systems' },
            { id: 'TS', label: 'TS (ICE-3109)', sub: 'Telecom Switching' },
            { id: 'SRE', label: 'SRE (ICE-3201)', sub: 'Software & Req' },
            { id: 'WT', label: 'WT (ICE-3205)', sub: 'Web Technologies' },
            { id: 'MCA', label: 'MCA (ICE-3203)', sub: 'Microprocessor' },
            { id: 'MEA', label: 'MEA (ICE-3204)', sub: 'Microwave & Ant' },
          ]
            .filter((item) => {
              if (selectedLevel === 'ALL') return true;
              if (item.id === 'ALL') return true;
              if (selectedLevel === '3.1') return ['DC', 'DSP', 'OS', 'TS'].includes(item.id);
              if (selectedLevel === '3.2') return ['SRE', 'WT', 'MCA', 'MEA'].includes(item.id);
              return true;
            })
            .map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedCourse(item.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedCourse === item.id
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black scale-102'
                    : 'bg-white/5 text-white hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCourse === item.id
                        ? 'bg-slate-950/20 text-slate-950 font-black'
                        : 'bg-white/10 text-amber-300'
                    }`}
                  >
                    {countForCourse(item.id)}
                  </span>
                </div>
                <span
                  className={`text-[10px] block mt-0.5 font-normal truncate ${
                    selectedCourse === item.id ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {item.sub}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* 2. HANDWRITTEN EXAM NOTES SHOWCASE (from User Uploads) */}
      {(selectedCourse === 'ALL' || selectedCourse === 'SRE') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Featured SRE Handwritten Study Note Cards
                </h3>
                <p className="text-[10px] text-slate-400">
                  High-yield illustrated exam notes uploaded by students for Spring 2026 Mid-Terms
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              5 High-Res Study Sheets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SRE_HANDWRITTEN_NOTES.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/40 hover:border-amber-400 transition-all group flex flex-col justify-between"
              >
                <div
                  onClick={() => setViewingImageModal(note)}
                  className="relative aspect-[4/3] bg-slate-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={note.thumb}
                    alt={note.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" /> Click to Zoom
                    </span>
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
                    {note.lecture}
                  </span>
                </div>

                <div className="p-3.5 space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {note.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {note.topic}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewingImageModal(note)}
                      className="text-bup-700 dark:text-bup-400 hover:underline font-bold text-[11px] flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <a
                      href={note.url}
                      download
                      className="btn-motion btn-bup-primary px-3 py-1 rounded-xl text-[11px] font-bold text-white flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Search & Format Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by lecture, topic, course code, or filename..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-bup-600 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-bold">
          {(['ALL', 'PDF', 'PPTX', 'DOCX', 'IMAGE'] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                selectedFormat === fmt
                  ? 'btn-bup-primary text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-bup-400'
              }`}
            >
              {fmt === 'ALL' ? 'All Formats' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Complete Notes List Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-700 dark:text-slate-300">
            Showing {filteredNotes.length} Academic Resource Files
          </span>
          <span className="text-slate-400">Direct instant download links</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredNotes.map((note) => {
            const isPdf = note.format === 'PDF';
            const isDoc = note.format === 'DOCX';
            const isPpt = note.format === 'PPTX';
            const isImg = note.format === 'IMAGE';

            return (
              <div
                key={note.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-bup-500/60 shadow-xs transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  {/* File Format Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                      isPdf
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                        : isDoc
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                        : isPpt
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-900'
                        : isImg
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {note.format}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                        {note.courseCode}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Level {note.level || '3.2'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {note.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 ml-auto">
                        {note.size}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug group-hover:text-bup-600 transition-colors">
                      {note.title}
                    </h4>

                    <p className="text-[10px] text-slate-400 truncate">
                      File: <strong className="font-mono text-slate-600 dark:text-slate-300">{note.filename}</strong>
                    </p>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Faculty / Source: <span>{note.faculty}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open / Preview</span>
                  </a>

                  <a
                    href={note.url}
                    download={note.filename}
                    className="btn-motion btn-bup-gold px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Fullscreen High-Resolution Image Preview Modal */}
      {viewingImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                  {viewingImageModal.lecture || 'Study Note'}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {viewingImageModal.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={viewingImageModal.url}
                  download
                  className="btn-motion btn-bup-primary px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </a>

                <button
                  type="button"
                  onClick={() => setViewingImageModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center">
              <img
                src={viewingImageModal.url}
                alt={viewingImageModal.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
