import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "Section A", "Section B"
  instructor: { type: String, required: true },
  instructorEmail: { type: String },
  room: { type: String, default: 'Block 2, Room 402' },
  schedule: [{ type: String }], // e.g. ["Sun 10:30-12:00", "Tue 10:30-12:00"]
  capacity: { type: Number, default: 45 },
  enrolledStudentsCount: { type: Number, default: 38 },
});

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true }, // "ICT-2201"
    title: { type: String, required: true },
    departmentCode: { type: String, required: true, uppercase: true }, // "ICT", "CSE", "BBA"
    departmentName: { type: String, required: true },
    semester: { type: String, default: 'Spring 2026' },
    level: { type: String, default: 'Undergraduate' },
    credits: { type: Number, default: 3.0 },
    description: { type: String },
    sections: [sectionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
