import express from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const getCanonicalId = (id1, id2) => {
  return [id1, id2].sort().join('_');
};

// 1. Send E2EE Encrypted Message
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { recipientId, ciphertext, iv, salt, keyFingerprint, plainPreviewForDemo } = req.body;

    if (!recipientId || !ciphertext || !iv) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID, ciphertext, and IV are required for E2EE delivery.',
      });
    }

    const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found.' });
    }

    const canonicalId = getCanonicalId(req.user.id, recipient.id);

    // Find or create conversation in MySQL
    let conversation = await prisma.conversation.findUnique({
      where: { canonicalId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          canonicalId,
          isGroup: false,
          title: `${req.user.name} & ${recipient.name}`,
        },
      });
    }

    // Save encrypted message record (never saves plaintext or private keys!)
    const messageRecord = await prisma.encryptedMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: req.user.id,
        senderName: req.user.name,
        recipientId: recipient.id,
        recipientName: recipient.name,
        isEncrypted: true,
        ciphertext,
        iv,
        salt: salt || null,
        keyFingerprint: keyFingerprint || 'AES-256-GCM-SHA256',
        plainPreviewForDemo: plainPreviewForDemo || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Message delivered with End-to-End Encryption.',
      messageRecord: {
        _id: messageRecord.id,
        id: messageRecord.id,
        ...messageRecord,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Get messages for conversation with specific user
router.get('/conversation/:otherUserId', authenticateToken, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const canonicalId = getCanonicalId(req.user.id, otherUserId);

    const conversation = await prisma.conversation.findUnique({
      where: { canonicalId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      return res.json({ success: true, count: 0, messages: [] });
    }

    res.json({
      success: true,
      count: conversation.messages.length,
      messages: conversation.messages.map((m) => ({
        _id: m.id,
        id: m.id,
        ...m,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Get Verified Contacts List
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { id: { not: req.user.id } },
      select: {
        id: true,
        name: true,
        role: true,
        studentId: true,
        facultyId: true,
        departmentCode: true,
        designation: true,
        avatar: true,
      },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
    });

    res.json({
      success: true,
      contacts: users.map((u) => ({
        _id: u.id,
        id: u.id,
        name: u.name,
        role: u.role.toLowerCase(),
        studentId: u.studentId,
        facultyId: u.facultyId,
        department: u.departmentCode,
        designation: u.designation,
        avatar: u.avatar,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
