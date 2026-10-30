import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    faculty: { type: String, required: true }, // e.g. "Faculty of Science & Technology"
    description: { type: String },
    coursesCount: { type: Number, default: 0 },
    icon: { type: String, default: 'Cpu' },
  },
  { timestamps: true }
);

export default mongoose.models.Department || mongoose.model('Department', departmentSchema);
