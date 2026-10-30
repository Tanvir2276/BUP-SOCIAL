import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all lost and found items
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const where = {};
    if (type && type !== 'All') where.type = type.toUpperCase();
    if (status) where.status = status.toUpperCase();

    const items = await prisma.lostFoundItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: items.length,
      items: items.map((i) => ({
        _id: i.id,
        id: i.id,
        type: i.type === 'LOST' ? 'Lost' : 'Found',
        title: i.title,
        description: i.description,
        location: i.location,
        dateReported: i.dateReported,
        itemCategory: i.itemCategory,
        status: i.status,
        reportedBy: {
          id: i.reportedByUserId,
          name: i.reportedByName,
          contact: i.contactInfo,
        },
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Report an item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, title, description, location, contact, itemCategory, imageUrl } = req.body;

    if (!type || !title || !location) {
      return res.status(400).json({ success: false, message: 'Type, title, and location are required.' });
    }

    const itemType = (type || 'LOST').toUpperCase() === 'FOUND' ? 'FOUND' : 'LOST';

    const item = await prisma.lostFoundItem.create({
      data: {
        type: itemType,
        title,
        description: description || '',
        location,
        dateReported: new Date().toLocaleDateString(),
        itemCategory: itemCategory || 'General',
        reportedByUserId: req.user.id,
        reportedByName: req.user.name,
        contactInfo: contact || req.user.email,
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Campus Lost & Found listing recorded in MySQL database!',
      item: {
        _id: item.id,
        id: item.id,
        ...item,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
