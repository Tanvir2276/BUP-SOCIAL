import mongoose from 'mongoose';

const routineSchema = new mongoose.Schema(
  {
    department: { type: String, required: true }, // "ICT"
    program: { type: String, default: 'BICE' },
    batch: { type: String, required: true }, // "BICE-2024"
    courseCode: { type: String, required: true }, // "ICT-2201"
    courseTitle: { type: String, required: true }, // "Data Structures & Algorithms"
    section: { type: String, required: true }, // "Section A" or "Section B"
    instructor: { type: String, required: true },
    dayOfWeek: {
      type: String,
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    startTime: { type: String, required: true }, // "10:30"
    endTime: { type: String, required: true }, // "12:00"
    room: { type: String, required: true }, // "Block 2 - Room 402"
    isUpdated: { type: Boolean, default: false },
    updateNote: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Routine || mongoose.model('Routine', routineSchema);
