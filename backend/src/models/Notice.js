import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['General', 'Exam', 'Assignment', 'Routine Change', 'Class Postponement', 'Make-up Class', 'Emergency'],
      default: 'General',
    },
    // Distinct hierarchy for separation
    scope: {
      type: String,
      enum: ['Campus', 'Department', 'CourseSection'],
      default: 'CourseSection',
    },
    departmentCode: { type: String, default: 'ALL', uppercase: true },
    courseCode: { type: String, default: 'ALL', uppercase: true }, // e.g. "ICT-2201"
    sectionName: { type: String, default: 'ALL' }, // "Section A", "Section B", or "ALL"

    // Faculty information
    publishedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      role: { type: String, default: 'faculty' },
      designation: { type: String, default: 'Faculty Member' },
      department: { type: String },
    },

    urgency: {
      type: String,
      enum: ['normal', 'important', 'urgent'],
      default: 'normal',
    },
    attachmentName: { type: String },
    attachmentUrl: { type: String },
    acknowledgedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Notice || mongoose.model('Notice', noticeSchema);
