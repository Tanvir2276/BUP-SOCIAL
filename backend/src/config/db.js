import mongoose from 'mongoose';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongodProcess = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bupsoc';

  try {
    // Attempt standard connection first
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected successfully to: ${mongoUri}`);
    return;
  } catch (err) {
    console.log('⚠️ Local MongoDB service not active on port 27017, checking for local mongod binary...');
  }

  // Check if C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe exists
  const possiblePaths = [
    'C:\\Program Files\\MongoDB\\Server\\9.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
  ];

  let mongodBin = possiblePaths.find((p) => fs.existsSync(p));

  if (mongodBin) {
    const dataDir = path.resolve(__dirname, '../../../data/db');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    console.log(`🚀 Starting local MongoDB instance from ${mongodBin} using dbpath: ${dataDir}`);
    try {
      mongodProcess = spawn(mongodBin, ['--dbpath', dataDir, '--port', '27017'], {
        detached: false,
        stdio: 'ignore',
      });

      // Wait 3 seconds for mongod to initialize
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Auto-Spawned and Connected: ${mongoUri}`);
      return;
    } catch (spawnErr) {
      console.error('❌ Failed to spawn local MongoDB process:', spawnErr.message);
    }
  }

  console.log('ℹ️ Operating in adaptive mode: checking again or connecting to remote URI...');
};

process.on('SIGINT', () => {
  if (mongodProcess) {
    try {
      mongodProcess.kill();
    } catch (e) {}
  }
  process.exit(0);
});
