import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Lost', 'Found'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true }, // "Cafeteria Ground Floor", "ICT Lab 402"
    dateReported: { type: String, required: true },
    itemCategory: { type: String, default: 'Electronics / ID / Document' },
    status: { type: String, enum: ['Open', 'Claimed', 'Resolved'], default: 'Open' },
    reportedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      contact: { type: String, required: true },
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.LostFound || mongoose.model('LostFound', lostFoundSchema);
