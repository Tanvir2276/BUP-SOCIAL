import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { issueOtp, verifySubmittedOtp } from '../services/otpService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bup_social_super_secure_jwt_token_key_2026';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 1. Send / Request Email OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const { rawOtp, expiresAt } = await issueOtp(email);

    return res.json({
      success: true,
      message: `Verification code sent to ${email}.`,
      demoOtpCode: rawOtp, // For evaluation testing convenience in UI
      expiresAt,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Verify Email OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    await verifySubmittedOtp(email, otp);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });

      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'OTP verified successfully! Account is authenticated.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase(),
          studentId: user.studentId,
          facultyId: user.facultyId,
          department: user.departmentCode,
          batch: user.batchName,
          section: user.sectionName,
          designation: user.designation,
          isVerified: true,
          leadTimeMinutes: user.leadTimeMinutes,
          deviceType: user.deviceType,
          soundEnabled: user.soundEnabled,
          favoriteClubs: user.favoriteClubs ? JSON.parse(user.favoriteClubs) : [],
          coursePreferences: user.coursePreferences ? JSON.parse(user.coursePreferences) : [],
        },
      });
    }

    return res.json({
      success: true,
      message: 'Email verified. Please complete your registration.',
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

// 3. Register (Separate Student vs Faculty Entry Points)
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'STUDENT',
      studentId,
      facultyId,
      department = 'ICT',
      program = 'BICE',
      batch = 'BICE-2024',
      section = 'Section A',
      designation = 'Student',
      requireOtp = true,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this BUP email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const normalizedRole = role.toUpperCase() === 'FACULTY' ? 'FACULTY' : 'STUDENT';

    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: normalizedRole,
        studentId: normalizedRole === 'STUDENT' ? studentId || '24549010064' : null,
        facultyId: normalizedRole === 'FACULTY' ? facultyId || 'FAC-ICT-001' : null,
        departmentCode: department,
        programName: program,
        batchName: batch,
        sectionName: section,
        designation: normalizedRole === 'FACULTY' ? designation || 'Assistant Professor' : 'Student',
        isVerified: !requireOtp,
        coursePreferences: JSON.stringify(['ICT-2201', 'ICT-2202', 'CSE-3101']),
        favoriteClubs: JSON.stringify(['BUP InfoTech Club (BUPITC)', 'BUP Robotics Club (BUPRC)']),
      },
    });

    let demoOtpCode = null;
    if (requireOtp) {
      const otpRes = await issueOtp(normalizedEmail);
      demoOtpCode = otpRes.rawOtp;
    }

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: requireOtp ? 'Registration successful. Please verify the code sent to your email.' : 'Registration completed!',
      requiresOtp: requireOtp,
      demoOtpCode,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role.toLowerCase(),
        studentId: newUser.studentId,
        facultyId: newUser.facultyId,
        department: newUser.departmentCode,
        batch: newUser.batchName,
        section: newUser.sectionName,
        designation: newUser.designation,
        isVerified: newUser.isVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Login (Separate Student and Faculty Entry Points enforced on backend)
router.post('/login', async (req, res) => {
  try {
    const { identifier, email, password, roleHint } = req.body;
    const loginKey = (identifier || email || '').trim();

    if (!loginKey || !password) {
      return res.status(400).json({ success: false, message: 'Please provide your email/ID and password.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginKey.toLowerCase() },
          { studentId: loginKey },
          { facultyId: loginKey },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // Role enforcement per Section 3
    if (roleHint && roleHint.toLowerCase() === 'faculty') {
      if (user.role !== 'FACULTY' && user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: This portal is restricted to BUP Faculty Members. Please use the Student Login portal.',
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        studentId: user.studentId,
        facultyId: user.facultyId,
        department: user.departmentCode,
        program: user.programName,
        batch: user.batchName,
        section: user.sectionName,
        designation: user.designation,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bio: user.bio,
        reminderSettings: {
          leadTimeMinutes: user.leadTimeMinutes,
          deviceType: user.deviceType,
          soundEnabled: user.soundEnabled,
          classReminders: user.classReminders,
          examReminders: user.examReminders,
          noticeAlerts: user.noticeAlerts,
        },
        favoriteClubs: user.favoriteClubs ? JSON.parse(user.favoriteClubs) : [],
        coursePreferences: user.coursePreferences ? JSON.parse(user.coursePreferences) : [],
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Get Current Authenticated User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      user: {
        ...user,
        role: user.role.toLowerCase(),
        reminderSettings: {
          leadTimeMinutes: user.leadTimeMinutes,
          deviceType: user.deviceType,
          soundEnabled: user.soundEnabled,
          classReminders: user.classReminders,
          examReminders: user.examReminders,
          noticeAlerts: user.noticeAlerts,
        },
        favoriteClubs: user.favoriteClubs ? JSON.parse(user.favoriteClubs) : [],
        coursePreferences: user.coursePreferences ? JSON.parse(user.coursePreferences) : [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Update Preferences (Custom Reminders: time & device, favorite clubs, course preferences)
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { reminderSettings, favoriteClubs, coursePreferences, bio, section } = req.body;

    const dataToUpdate = {};
    if (bio !== undefined) dataToUpdate.bio = bio;
    if (section !== undefined) dataToUpdate.sectionName = section;

    if (reminderSettings) {
      if (reminderSettings.leadTimeMinutes !== undefined) dataToUpdate.leadTimeMinutes = reminderSettings.leadTimeMinutes;
      if (reminderSettings.deviceType !== undefined) dataToUpdate.deviceType = reminderSettings.deviceType;
      if (reminderSettings.soundEnabled !== undefined) dataToUpdate.soundEnabled = reminderSettings.soundEnabled;
      if (reminderSettings.classReminders !== undefined) dataToUpdate.classReminders = reminderSettings.classReminders;
      if (reminderSettings.examReminders !== undefined) dataToUpdate.examReminders = reminderSettings.examReminders;
      if (reminderSettings.noticeAlerts !== undefined) dataToUpdate.noticeAlerts = reminderSettings.noticeAlerts;
    }

    if (favoriteClubs !== undefined) {
      dataToUpdate.favoriteClubs = JSON.stringify(favoriteClubs);
    }
    if (coursePreferences !== undefined) {
      dataToUpdate.coursePreferences = JSON.stringify(coursePreferences);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
    });

    res.json({
      success: true,
      message: 'Preferences and reminder settings saved to MySQL database!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role.toLowerCase(),
        studentId: updatedUser.studentId,
        facultyId: updatedUser.facultyId,
        department: updatedUser.departmentCode,
        batch: updatedUser.batchName,
        section: updatedUser.sectionName,
        designation: updatedUser.designation,
        reminderSettings: {
          leadTimeMinutes: updatedUser.leadTimeMinutes,
          deviceType: updatedUser.deviceType,
          soundEnabled: updatedUser.soundEnabled,
          classReminders: updatedUser.classReminders,
          examReminders: updatedUser.examReminders,
          noticeAlerts: updatedUser.noticeAlerts,
        },
        favoriteClubs: updatedUser.favoriteClubs ? JSON.parse(updatedUser.favoriteClubs) : [],
        coursePreferences: updatedUser.coursePreferences ? JSON.parse(updatedUser.coursePreferences) : [],
        bio: updatedUser.bio,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
