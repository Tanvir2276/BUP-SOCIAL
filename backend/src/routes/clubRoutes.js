import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all verified clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        events: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, clubs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all events
router.get('/events', async (req, res) => {
  try {
    const { clubName } = req.query;
    const where = {};
    if (clubName) where.clubName = clubName;

    const events = await prisma.clubEvent.findMany({
      where,
      include: {
        registrations: true,
      },
      orderBy: { date: 'asc' },
    });

    res.json({
      success: true,
      events: events.map((e) => ({
        _id: e.id,
        id: e.id,
        clubName: e.clubName,
        title: e.title,
        description: e.description,
        date: e.date,
        time: e.time,
        venue: e.venue,
        category: e.category,
        posterUrl: e.posterUrl,
        registeredParticipants: e.registrations.map((r) => ({
          userId: r.userId,
          name: r.userName,
          studentId: r.studentId,
        })),
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Register for an event
router.post('/events/:id/register', authenticateToken, async (req, res) => {
  try {
    const event = await prisma.clubEvent.findUnique({
      where: { id: req.params.id },
      include: { registrations: true },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const alreadyRegistered = event.registrations.some((r) => r.userId === req.user.id);
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event!' });
    }

    await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        userId: req.user.id,
        userName: req.user.name,
        studentId: req.user.studentId || null,
      },
    });

    await prisma.clubEvent.update({
      where: { id: event.id },
      data: { registeredCount: { increment: 1 } },
    });

    res.json({ success: true, message: 'Successfully registered for event!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle Favorite Club (Teacher Requirement: Favorite Club Preference)
router.post('/:clubName/favorite', authenticateToken, async (req, res) => {
  try {
    const { clubName } = req.params;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let clubs = user.favoriteClubs ? JSON.parse(user.favoriteClubs) : [];
    const idx = clubs.indexOf(clubName);

    if (idx > -1) {
      clubs.splice(idx, 1);
    } else {
      clubs.push(clubName);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { favoriteClubs: JSON.stringify(clubs) },
    });

    res.json({
      success: true,
      message: idx > -1 ? `Removed ${clubName} from favorites.` : `Added ${clubName} to favorite clubs!`,
      favoriteClubs: clubs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
