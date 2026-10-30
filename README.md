# BUP Social (BUPSoCo) 🎓
### *A University-Centered Social Network, Academic Governance & Campus Services Platform*
**Faculty of Science and Technology (FST) | Bangladesh University of Professionals (BUP)**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%2F%20Prisma%20ORM-orange)](https://www.prisma.io/)
[![Security](https://img.shields.io/badge/Security-3--Tier%20AES--256%20E2EE-emerald)](https://bup.edu.bd)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Ready-black)](https://vercel.com)

---

## 🌟 Architecture & Stack Overview

This application has been developed to the highest academic software engineering standards following the **BUP Social Project Proposal** and the master requirements:

| Component | Technology | Description |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Web Crypto API | Facebook-inspired modern, responsive UI with prestige navy university branding, spring tactile motion buttons, and dark/light modes. |
| **Backend** | Node.js, Express.js REST APIs, Socket.IO, JWT, bcryptjs | Modular 3-layer architecture handling authentication, academic structure, notices, feeds, reminders, and encrypted messaging. |
| **Database** | **MySQL 8.0 / MariaDB** via **Prisma ORM** | 24 normalized relational tables with indexes, foreign keys, and 1,008 pre-seeded realistic student & faculty accounts. *(No MongoDB)* |
| **Email OTP** | Server-side cryptographic OTP, hashed single-use records, 5-minute expiry, Nodemailer SMTP service with live UI simulation fallback | Full 2FA verification for student and faculty onboarding. |
| **Chatbox Messenger** | Web Crypto API (AES-GCM 256-bit + PBKDF2-SHA256) | Facebook Messenger style messaging with Emojis, Campus Photos, Stickers, and GIFs with client-side envelope encryption. |
| **Campus Mobility** | Integrated RideShare & BUP-GO Connector | Route matching + one-click deep link to live BUP-GO: `https://bup-go-project-8njl.vercel.app/`. |
| **Security Architecture**| 3-Tier Military & Academic Defense | Level 1: Network & Perimeter (IP Rate Limiting & Brute Force Lockout); Level 2: Zero-Trust Auth & OTP; Level 3: AES-256 Vault. |
| **Deployment** | Vercel (`vercel.json`) & Render | Pre-configured SPA routing and environment variables. |

---

## 🏛️ Academic Hierarchy & Key Features

1. **Official FST Leadership & Governance (`https://bup.edu.bd/faculty_home/3`):**
   - **Dean of FST:** Brigadier General Sufi Md Ataur Rahman, ndc, psc
   - **Departments:** Department of ICT, Department of CSE, Department of Environmental Science, Department of Data Science.
   - **Programs:** B.Sc. in ICT, B.Sc. in CSE, B.Sc. in Environmental Science, MICE, MICT, MISS, MCSE, MCS, MES, MESM.
2. **Section-Segregated Notices:**
   - Faculty members publish notices for a specific department, course, and section.
   - Section A students see Section A notices; Section B students see Section B notices.
3. **Official BUP Admission Announcements:**
   - Undergraduate Admission Circular Session 2026-2027 (FST: ICT, CSE, ES) with written exam dates, eligibility, and direct portal links (`admission.bup.edu.bd`).
   - Postgraduate Professional Masters (MICT, MCSE, MISS, MESM) Spring 2026 intake notices.
4. **Chatbox Messenger:**
   - Direct messaging with Emojis, Real Campus Photos, Stickers (👍, ❤️, 🎓, 💻, 🔥, 🚀), and GIFs with AES-256-GCM envelope encryption.
5. **Interactive Academic Tools:**
   - **BUP Semester CGPA Calculator:** Real-time GPA calculation based on official 4.00 max scale.
   - **Class Timetable Alarms:** 1-click alarm sync to trigger device alerts 15 minutes before classes.
6. **Custom Reminder Center:**
   - Configure reminder lead times (**5, 10, 15, 30, 60 minutes**).
   - Target devices (**Web Browser, Android PWA, iOS PWA, Email/SMS**).
7. **Verified Campus Organizations:**
   - BUP InfoTech Club (BUPITC), BUP Robotics Club (BUPRC), BUP IEEE Student Branch, BUP Career Club (BCLC), BUP Environmental Club (BUPEC), BUP Debate Club (BUPDC).

---

## 👥 Verified Pre-seeded Test Accounts

Use the one-click demo cards on the Login page or sign in directly:

### 🏛️ Leadership & Faculty Portals:
- **Dean of FST (Brigadier General Sufi Md Ataur Rahman)**: `dean.fst@bup.edu.bd` / `faculty123`
- **Associate Professor Dr. Md. Sabir Hossain (Chairman, CSE)**: `sabir@bup.edu.bd` / `faculty123`
- **Assistant Professor Nazneen Akhter (Supervisor, ICT)**: `nazneen@bup.edu.bd` / `faculty123`
- **Assistant Professor Suman Saha (Co-Supervisor, ICT)**: `sumansaha@bup.edu.bd` / `faculty123`

### 🎓 Students:
- **Safaytul Islam Rafi** *(Section A CR)*: `rafi@bup.edu.bd` / `bup123` *(ID: 24549010064)*
- **Munshi Tanvir Hossain** *(Section B Lead)*: `tanvir@bup.edu.bd` / `bup123` *(ID: 22549010076)*
- **Mahim Ismail** *(CSE Section A)*: `mahim@bup.edu.bd` / `bup123` *(ID: 24549010045)*
- **Bulk Students:** 1,000 seeded accounts (`student24549010001@bup.edu.bd` to `student24549011000@bup.edu.bd` / `bup123`).

---

## 🚀 Local Quickstart Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- MySQL / MariaDB (e.g., via XAMPP on port 3306)

### 2. Database Setup
```bash
# In MySQL, create database
CREATE DATABASE bupsoc;

# Inside backend/
cd backend
npm install
npx prisma db push
node src/seed/seedData.js
node src/seed/seedFstEcosystem.js
```

### 3. Start Backend API
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## ☁️ Deployment

### Vercel (Frontend)
1. Push this repository to GitHub.
2. Import project in Vercel.
3. Set Root Directory to `frontend`.
4. Framework Preset: `Vite`.
5. Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://bupsoc-api.onrender.com/api`)
   - `VITE_SOCKET_URL`: Your deployed backend URL
6. Click **Deploy**.

---

© 2026 Bangladesh University of Professionals (BUP). All rights reserved.
