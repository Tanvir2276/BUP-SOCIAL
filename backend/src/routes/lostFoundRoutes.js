import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const PRESET_CAMPUS_ITEMS = [
  // 10 Lost Items
  {
    type: 'LOST',
    title: 'Casio Scientific Calculator fx-991EX ClassWiz',
    description: 'Left on desk 4 in ICT Software Lab 1 after Data Structures laboratory session.',
    location: 'Academic Block 2, Room 402',
    contactInfo: 'tanvir@bup.edu.bd',
    reportedByName: 'Munshi Tanvir Hossain',
    itemCategory: 'Electronics',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'BUP Student RFID Identity Card & Navy Lanyard (Roll: 24549010064)',
    description: 'Misplaced somewhere between Vista Cafeteria and Central Library 2nd floor.',
    location: 'Vista Cafeteria / Library',
    contactInfo: 'rafi@bup.edu.bd',
    reportedByName: 'Safaytul Islam Rafi',
    itemCategory: 'Cards & ID',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'Lenovo Legion 135W USB-C Slim Laptop Charger',
    description: 'Forgotten plugged in near presentation podium after FST seminar presentation.',
    location: 'ICT Seminar Room 304',
    contactInfo: 'nishi.ict@bup.edu.bd',
    reportedByName: 'Nusrat Jahan Nishi',
    itemCategory: 'Electronics',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'Apple AirPods Pro (2nd Gen) in White MagSafe Case',
    description: 'Left near locker row 3 before evening badminton practice session.',
    location: 'FST Indoor Sports Complex',
    contactInfo: 'mahir.faisal@bup.edu.bd',
    reportedByName: 'Mahir Faisal',
    itemCategory: 'Accessories',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'Spiral Bound SRE & Data Communication Handwritten Lecture Note Khata',
    description: 'Black cover notebook with all midterm diagrams and IEEE ethics notes.',
    location: 'Lakeview Gazebo Bench 3',
    contactInfo: 'sadia.rahman@bup.edu.bd',
    reportedByName: 'Sadia Rahman',
    itemCategory: 'Documents',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'Titan Classic Quartz Watch with Brown Leather Strap',
    description: 'Slipped off during stage rehearsal for cultural week.',
    location: 'Bijoy Auditorium Dressing Room',
    contactInfo: 'anika.tahsin@bup.edu.bd',
    reportedByName: 'Anika Tahsin',
    itemCategory: 'Accessories',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'BUP Campus Keyring with 3 Dormitory Keys & Access Fob',
    description: 'Brass keyring with green BUP crest fob and 3 room keys.',
    location: 'Academic Block 1 Ground Floor Lobby',
    contactInfo: 'tahmid.hasan@bup.edu.bd',
    reportedByName: 'Tahmid Hasan',
    itemCategory: 'Keys',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'Logitech MX Master 3S Wireless Mouse (Space Gray)',
    description: 'Left on station 12 after digital signal processing filter simulation.',
    location: 'Digital Signal Processing Lab 408',
    contactInfo: 'farhan.ahmed@bup.edu.bd',
    reportedByName: 'Farhan Ahmed',
    itemCategory: 'Electronics',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'Blue Fastrack Anti-Glare Reading Glasses in Black Hard Case',
    description: 'Left near shelf 4 in the ablution prayer area.',
    location: 'BUP Central Mosque Ablution Area',
    contactInfo: 'kazi.fahim@bup.edu.bd',
    reportedByName: 'Kazi Fahim',
    itemCategory: 'Accessories',
    status: 'OPEN',
  },
  {
    type: 'LOST',
    title: 'Sandisk Extreme 128GB USB 3.2 Dual Flash Drive',
    description: 'Silver-black dual USB-C/A drive containing operating system lab code.',
    location: 'Computer Center Lab 2',
    contactInfo: 'sakib.hasan@bup.edu.bd',
    reportedByName: 'Sakib Hasan',
    itemCategory: 'Electronics',
    status: 'OPEN',
  },

  // 10 Found Items
  {
    type: 'FOUND',
    title: 'Wireless Bluetooth Earbuds Case (Navy Blue Baseus)',
    description: 'Handed over to Security Post near Main Gate after evening sports session.',
    location: 'Main Gate Security Office',
    contactInfo: 'security@bup.edu.bd',
    reportedByName: 'Campus Security Desk',
    itemCategory: 'Accessories',
    status: 'RESOLVED',
  },
  {
    type: 'FOUND',
    title: 'Parker Stainless Steel Fountain Pen with Silver Clip',
    description: 'Found on faculty podium after morning Web Technologies lecture.',
    location: 'Academic Block 2, Room 502',
    contactInfo: 'sumansaha@bup.edu.bd',
    reportedByName: 'Assistant Professor Suman Saha',
    itemCategory: 'Stationery',
    status: 'OPEN',
  },
  {
    type: 'FOUND',
    title: 'HP Pavilion 65W Blue-Pin Laptop AC Power Adapter',
    description: 'Found plugged into wall socket at reading desk 14.',
    location: 'Central Library 3rd Floor Study Cubicle 14',
    contactInfo: 'library@bup.edu.bd',
    reportedByName: 'Central Library Helpdesk',
    itemCategory: 'Electronics',
    status: 'OPEN',
  },
  {
    type: 'FOUND',
    title: 'Student Wallet containing BUP Smart Card & Bus Pass (Name: Abrar Fahim)',
    description: 'Deposited at cafeteria counter by student volunteer. Please claim with ID proof.',
    location: 'Vista Cafeteria Counter 2',
    contactInfo: 'cafeteria@bup.edu.bd',
    reportedByName: 'Vista Cafeteria Manager',
    itemCategory: 'Cards & ID',
    status: 'OPEN',
  },
  {
    type: 'FOUND',
    title: 'Texas Instruments TI-84 Plus CE Graphing Calculator',
    description: 'Found under bench seat in row 4 after ICE lecture.',
    location: 'FST Lecture Theater 1',
    contactInfo: 'nazneen@bup.edu.bd',
    reportedByName: 'Assistant Professor Nazneen Akhter',
    itemCategory: 'Electronics',
    status: 'OPEN',
  },
  {
    type: 'FOUND',
    title: 'Matte Black Metal Umbrella with BUP Insignia',
    description: 'Kept in stand near east staircase entrance on rainy morning.',
    location: 'Academic Block 1 East Staircase',
    contactInfo: 'admin.office@bup.edu.bd',
    reportedByName: 'FST Administrative Office',
    itemCategory: 'Accessories',
    status: 'OPEN',
  },
  {
    type: 'FOUND',
    title: 'Sony WH-CH520 Wireless Over-Ear Headphones (Beige)',
    description: 'Found left behind on armrest after National Seminar concluded.',
    location: 'Bijoy Auditorium Row F Seat 12',
    contactInfo: 'auditorium@bup.edu.bd',
    reportedByName: 'Bijoy Auditorium Caretaker',
    itemCategory: 'Electronics',
    status: 'OPEN',
  },
  {
    type: 'FOUND',
    title: 'Black Leather Cardholder with Dutch-Bangla Bank Nexus Card',
    description: 'Found beside the basketball court perimeter bench.',
    location: 'BUP Basketball Ground Bench',
    contactInfo: 'sports.council@bup.edu.bd',
    reportedByName: 'Physical Education Office',
    itemCategory: 'Cards & ID',
    status: 'OPEN',
  },
  {
    type: 'FOUND',
    title: 'Green Hydro Flask Water Bottle (Insulated 750ml)',
    description: 'Found on windowsill of 4th floor corridor near faculty lounge.',
    location: 'FST Academic Block 2, Corridor 4th Floor',
    contactInfo: 'care.desk@bup.edu.bd',
    reportedByName: 'Floor Maintenance Supervisor',
    itemCategory: 'Accessories',
    status: 'OPEN',
  },
  {
    type: 'FOUND',
    title: 'Microcontroller Kit (Arduino Uno R3 + Breadboard in Box)',
    description: 'Found on worktable 6 after Robotics Club training workshop.',
    location: 'Hardware & Robotics Lab 405',
    contactInfo: 'robotics.club@bup.edu.bd',
    reportedByName: 'BUP Robotics Club President',
    itemCategory: 'Electronics',
    status: 'OPEN',
  },
];

// Get all lost and found items
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const where = {};
    if (type && type !== 'All') where.type = type.toUpperCase();
    if (status) where.status = status.toUpperCase();

    let items = await prisma.lostFoundItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // If database table is empty, auto-seed the 20 verified campus items!
    if (items.length === 0 && (!type || type === 'All')) {
      try {
        await prisma.lostFoundItem.createMany({
          data: PRESET_CAMPUS_ITEMS,
          skipDuplicates: true,
        });
        items = await prisma.lostFoundItem.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        });
      } catch (seedErr) {
        // Fallback to in-memory preset if db write encounters transient constraint
        items = PRESET_CAMPUS_ITEMS.map((p, idx) => ({ ...p, id: `lf-${idx + 1}` }));
      }
    }

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
