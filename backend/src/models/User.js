import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'faculty', 'club_admin', 'moderator', 'admin'],
      default: 'student',
    },
    // Specific academic identification
    studentId: { type: String, trim: true },
    facultyId: { type: String, trim: true },
    department: { type: String, default: 'Department of ICT' },
    program: { type: String, default: 'BICE (B.Sc. in Information & Communication Engineering)' },
    batch: { type: String, default: 'BICE-2024' },
    section: { type: String, default: 'A' },
    designation: { type: String, default: 'Student' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: 'BUPian proud learner.' },
    isVerified: { type: Boolean, default: true },
    otpCode: { type: String },
    otpExpires: { type: Date },

    // Teacher Feedback: Custom reminder setting (time, device)
    reminderSettings: {
      leadTimeMinutes: { type: Number, default: 15 },
      deviceType: { type: String, default: 'browser' }, // 'browser', 'android_pwa', 'ios_pwa', 'email_push'
      soundEnabled: { type: Boolean, default: true },
      classReminders: { type: Boolean, default: true },
      examReminders: { type: Boolean, default: true },
      noticeAlerts: { type: Boolean, default: true },
    },

    // Teacher Feedback: Favorite club & course selection preference
    favoriteClubs: [{ type: String }],
    coursePreferences: [{ type: String }], // e.g. ["ICT-2201", "CSE-3101"]

    // E2EE Public Key (for end-to-end encrypted messaging)
    publicKey: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
