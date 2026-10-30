import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bup_social_super_secure_jwt_token_key_2026';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        studentId: true,
        facultyId: true,
        designation: true,
        facultyName: true,
        departmentCode: true,
        programName: true,
        batchName: true,
        sectionName: true,
        avatar: true,
        bio: true,
        isVerified: true,
        leadTimeMinutes: true,
        deviceType: true,
        soundEnabled: true,
        classReminders: true,
        examReminders: true,
        noticeAlerts: true,
        coursePreferences: true,
        favoriteClubs: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or session expired.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireFacultyOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (req.user.role === 'FACULTY' || req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Faculty or Administrator access required.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Administrator access required.' });
  }
  next();
};
