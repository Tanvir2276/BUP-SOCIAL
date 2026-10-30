import express from 'express';
import { prisma } from '../config/prisma.js';

const router = express.Router();

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await prisma.departmentEntity.findMany({
      orderBy: { code: 'asc' },
    });
    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get courses by department code
router.get('/:code/courses', async (req, res) => {
  try {
    const { code } = req.params;
    const courses = await prisma.courseEntity.findMany({
      where: { departmentCode: code.toUpperCase() },
      include: { sections: true },
      orderBy: { code: 'asc' },
    });
    res.json({ success: true, departmentCode: code.toUpperCase(), courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all courses across all departments
router.get('/all/courses', async (req, res) => {
  try {
    const courses = await prisma.courseEntity.findMany({
      include: { sections: true },
      orderBy: { code: 'asc' },
    });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
