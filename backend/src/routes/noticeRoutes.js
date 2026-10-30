import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken, requireFacultyOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get notices with flexible filtering: department, course, section
router.get('/', async (req, res) => {
  try {
    const { departmentCode, courseCode, sectionName, category, scope } = req.query;

    const whereConditions = [];

    if (scope) {
      whereConditions.push({ scope: scope.toUpperCase() });
    }

    if (category) {
      whereConditions.push({ category: category.toUpperCase() });
    }

    if (courseCode && courseCode !== 'ALL') {
      whereConditions.push({
        OR: [{ courseCode: courseCode.toUpperCase() }, { courseCode: 'ALL' }],
      });
    }

    if (sectionName && sectionName !== 'ALL') {
      whereConditions.push({
        sectionName: { in: [sectionName, 'ALL'] },
      });
    }

    if (departmentCode && departmentCode !== 'ALL') {
      whereConditions.push({
        departmentCode: { in: [departmentCode.toUpperCase(), 'ALL'] },
      });
    }

    const whereClause = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const notices = await prisma.facultyNotice.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: notices.length,
      notices: notices.map((n) => ({
        _id: n.id,
        id: n.id,
        title: n.title,
        content: n.content,
        category: n.category,
        scope: n.scope,
        departmentCode: n.departmentCode,
        courseCode: n.courseCode,
        sectionName: n.sectionName,
        urgency: n.urgency.toLowerCase(),
        attachmentName: n.attachmentName,
        attachmentUrl: n.attachmentUrl,
        publishedBy: {
          id: n.authorId,
          name: n.authorName,
          role: n.authorRole.toLowerCase(),
          designation: n.authorDesignation || 'Faculty Member',
        },
        createdAt: n.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Post a new official notice (Faculty Member or Admin only)
router.post('/', authenticateToken, requireFacultyOrAdmin, async (req, res) => {
  try {
    const {
      title,
      content,
      category = 'GENERAL',
      scope = 'SECTION',
      departmentCode = 'ICT',
      courseCode = 'ALL',
      sectionName = 'ALL',
      urgency = 'NORMAL',
      attachmentName,
      attachmentUrl,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Notice title and content are required.' });
    }

    const catKey = (category || 'GENERAL').toUpperCase().replace(/\s+/g, '_');
    const scopeKey = (scope || 'SECTION').toUpperCase();
    const urgKey = (urgency || 'NORMAL').toUpperCase();

    const notice = await prisma.facultyNotice.create({
      data: {
        title,
        content,
        category: catKey in prisma.NoticeCategory ? catKey : 'GENERAL',
        scope: scopeKey in prisma.NoticeScope ? scopeKey : 'SECTION',
        departmentCode: (departmentCode || 'ICT').toUpperCase(),
        courseCode: (courseCode || 'ALL').toUpperCase(),
        sectionName: sectionName || 'ALL',
        urgency: urgKey in prisma.UrgencyLevel ? urgKey : 'NORMAL',
        attachmentName: attachmentName || null,
        attachmentUrl: attachmentUrl || null,
        authorId: req.user.id,
        authorName: req.user.name,
        authorRole: req.user.role,
        authorDesignation: req.user.designation || 'Assistant Professor',
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        actionType: 'PUBLISH_NOTICE',
        entityType: 'FACULTY_NOTICE',
        entityId: notice.id,
        details: `Published notice: ${notice.title} to ${notice.sectionName}`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Official academic notice published successfully to MySQL database!',
      notice: {
        _id: notice.id,
        id: notice.id,
        ...notice,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete notice (Author or Admin)
router.delete('/:id', authenticateToken, requireFacultyOrAdmin, async (req, res) => {
  try {
    const notice = await prisma.facultyNotice.findUnique({
      where: { id: req.params.id },
    });

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }

    if (req.user.role !== 'ADMIN' && notice.authorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this notice.' });
    }

    await prisma.facultyNotice.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: 'Notice deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
