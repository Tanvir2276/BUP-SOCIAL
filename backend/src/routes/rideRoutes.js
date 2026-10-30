import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const BUPGO_LIVE_URL = process.env.BUPGO_URL || 'https://bup-go-project-8njl.vercel.app/';

// 1. Get all rides
router.get('/', async (req, res) => {
  try {
    const { type, transportMode, origin } = req.query;

    const where = { status: 'ACTIVE' };
    if (type && type !== 'All') where.type = type.toUpperCase();
    if (transportMode) where.transportMode = transportMode;
    if (origin) where.origin = { contains: origin };

    const rides = await prisma.rideOffer.findMany({
      where,
      include: {
        passengers: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: rides.length,
      rides: rides.map((r) => ({
        _id: r.id,
        id: r.id,
        hostUser: {
          userId: r.hostUserId,
          name: r.hostName,
          studentId: r.hostStudentId,
          phone: r.hostPhone,
          avatar: r.hostAvatar,
        },
        type: r.type === 'OFFER' ? 'Offer' : 'Request',
        origin: r.origin,
        destination: r.destination,
        pickupPoint: r.pickupPoint,
        departureTime: r.departureTime,
        rideDate: r.rideDate,
        transportMode: r.transportMode,
        seatsAvailable: r.seatsAvailable,
        estimatedCost: r.estimatedCost,
        notes: r.notes,
        bupGoUrl: r.bupGoUrl || BUPGO_LIVE_URL,
        status: r.status.toLowerCase(),
        passengers: r.passengers.map((p) => ({
          userId: p.userId,
          name: p.name,
          contact: p.contact,
          status: p.status,
        })),
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Post a new ride offer / request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { origin, destination, pickupPoint, departureTime, rideDate, transportMode, seatsAvailable, estimatedCost, notes, type } =
      req.body;

    if (!origin || !departureTime) {
      return res.status(400).json({ success: false, message: 'Origin and departure time are required.' });
    }

    const rideType = (type || 'OFFER').toUpperCase() === 'REQUEST' ? 'REQUEST' : 'OFFER';

    const ride = await prisma.rideOffer.create({
      data: {
        hostUserId: req.user.id,
        hostName: req.user.name,
        hostStudentId: req.user.studentId || null,
        hostPhone: req.user.phone || '017XXXXXXXX',
        hostAvatar: req.user.avatar || null,
        type: rideType,
        origin,
        destination: destination || 'BUP Campus, Mirpur Cantonment',
        pickupPoint: pickupPoint || 'Bus Stand',
        departureTime,
        rideDate: rideDate || new Date().toISOString().split('T')[0],
        transportMode: transportMode || 'Bike',
        seatsAvailable: seatsAvailable || 1,
        estimatedCost: estimatedCost || 'Shared (BDT 30-50)',
        notes: notes || null,
        bupGoUrl: BUPGO_LIVE_URL,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Ride posted successfully with BUP-GO bridge ready!',
      ride: {
        _id: ride.id,
        id: ride.id,
        ...ride,
        passengers: [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Join a ride
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const ride = await prisma.rideOffer.findUnique({
      where: { id: req.params.id },
      include: { passengers: true },
    });

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({ success: false, message: 'Sorry, no available seats remaining.' });
    }

    const alreadyJoined = ride.passengers.some((p) => p.userId === req.user.id);
    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'You have already joined this ride.' });
    }

    await prisma.ridePassenger.create({
      data: {
        rideId: ride.id,
        userId: req.user.id,
        name: req.user.name,
        contact: req.user.email,
        status: 'CONFIRMED',
      },
    });

    const newSeats = ride.seatsAvailable - 1;
    const updatedRide = await prisma.rideOffer.update({
      where: { id: ride.id },
      data: {
        seatsAvailable: newSeats,
        status: newSeats === 0 ? 'FILLED' : 'ACTIVE',
      },
      include: { passengers: true },
    });

    res.json({
      success: true,
      message: 'Successfully reserved your seat on this ride!',
      ride: updatedRide,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. BUP-GO Bridge Endpoint
router.get('/bupgo-bridge', async (req, res) => {
  res.json({
    success: true,
    platform: 'BUP-GO Ride System Integration',
    targetUrl: BUPGO_LIVE_URL,
    deepLinkParams: {
      origin: 'Mirpur 12',
      destination: 'BUP Campus',
      timestamp: Date.now(),
    },
    message: 'BUP-GO live integration active. Click to launch external BUP-GO application.',
  });
});

export default router;
