import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, prisma } from './config/prisma.js';
import { securityPerimeterMiddleware, getSecurityTelemetry } from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import routineRoutes from './routes/routineRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import lostFoundRoutes from './routes/lostFoundRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);

// Socket.IO configuration per Section 11 & 15
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(securityPerimeterMiddleware);

// 3-Tier Security Telemetry Endpoint
app.get('/api/security/status', getSecurityTelemetry);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'BUP Social (BUPSoCo)',
    institution: 'Bangladesh University of Professionals',
    database: 'MySQL 8.0 / MariaDB (via Prisma ORM)',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/lost-found', lostFoundRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BUP Social API (BUPSoCo) - Bangladesh University of Professionals',
    database: 'MySQL Relational Engine',
    docs: '/api/health',
  });
});

// Real-Time Socket.IO Handlers
io.on('connection', (socket) => {
  console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`);

  // Join user-specific conversation room
  socket.on('join_conversation', (room) => {
    socket.join(room);
    console.log(`💬 Socket ${socket.id} joined conversation: ${room}`);
  });

  // Handle incoming encrypted message broadcast
  socket.on('send_encrypted_message', (payload) => {
    // Broadcast ciphertext only to participants
    io.to(payload.conversationId).emit('receive_encrypted_message', payload);
  });

  // Typing indicator
  socket.on('typing_indicator', ({ conversationId, userId, isTyping }) => {
    socket.to(conversationId).emit('user_typing', { userId, isTyping });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🎓 BUP SOCIAL (BUPSoCo) Server running on port ${PORT}`);
      console.log(`🐬 Database Engine: MySQL / MariaDB (Port 3306)`);
      console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/health`);
      console.log(`🚗 BUP-GO Live Bridge: https://bup-go-project-8njl.vercel.app/`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
