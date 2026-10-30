import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected successfully to MySQL database via Prisma ORM!');
  } catch (err) {
    console.error('❌ Failed to connect to MySQL database:', err.message);
  }
};
