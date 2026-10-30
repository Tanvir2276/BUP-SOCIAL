import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    shortCode: { type: String, required: true }, // "BUPRC", "BUPITC", "BUPDC"
    category: { type: String, default: 'Technology & Science' },
    description: { type: String, required: true },
    advisor: { type: String, default: 'Faculty Advisor' },
    president: { type: String, default: 'Student President' },
    banner: { type: String },
    logo: { type: String },
    membersCount: { type: Number, default: 120 },
    upcomingEventsCount: { type: Number, default: 2 },
  },
  { timestamps: true }
);

export default mongoose.models.Club || mongoose.model('Club', clubSchema);
