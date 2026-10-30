import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken, requireFacultyOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get routines with filters
router.get('/', async (req, res) => {
  try {
    const { department, batch, section, dayOfWeek } = req.query;

    const where = {};
    if (department) where.departmentCode = department;
    if (batch) where.batchName = batch;
    if (section && section !== 'ALL') where.sectionName = section;
    if (dayOfWeek) where.dayOfWeek = dayOfWeek;

    const routines = await prisma.routineEntry.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    res.json({
      success: true,
      count: routines.length,
      routines: routines.map((r) => ({
        _id: r.id,
        id: r.id,
        department: r.departmentCode,
        program: r.programName,
        batch: r.batchName,
        courseCode: r.courseCode,
        courseTitle: r.courseTitle,
        section: r.sectionName,
        instructor: r.instructorName,
        dayOfWeek: r.dayOfWeek,
        startTime: r.startTime,
        endTime: r.endTime,
        room: r.room,
        isUpdated: r.isUpdated,
        updateNote: r.updateNote,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update routine slot (Faculty or Admin only)
router.put('/:id', authenticateToken, requireFacultyOrAdmin, async (req, res) => {
  try {
    const { room, startTime, endTime, instructor, updateNote } = req.body;

    const routine = await prisma.routineEntry.update({
      where: { id: req.params.id },
      data: {
        room: room || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        instructorName: instructor || undefined,
        isUpdated: true,
        updateNote: updateNote || `Updated by ${req.user.name} on ${new Date().toLocaleDateString()}`,
      },
    });

    res.json({
      success: true,
      message: 'Routine slot updated in MySQL database!',
      routine,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
