import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema(
  {
    hostUser: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      studentId: { type: String },
      phone: { type: String },
      avatar: { type: String },
    },
    type: {
      type: String,
      enum: ['Offer', 'Request'],
      default: 'Offer',
    },
    origin: { type: String, required: true }, // e.g. "Mirpur 12"
    destination: { type: String, required: true, default: 'BUP Campus, Mirpur Cantonment' },
    pickupPoint: { type: String, default: 'Bus Stand' },
    departureTime: { type: String, required: true }, // "08:15 AM"
    rideDate: { type: String, required: true },
    transportMode: {
      type: String,
      enum: ['Bike', 'Car', 'CNG Share', 'Rickshaw Share', 'BUP Bus Commute'],
      default: 'Bike',
    },
    seatsAvailable: { type: Number, default: 1 },
    estimatedCost: { type: String, default: 'Shared (BDT 30-50)' },
    notes: { type: String },
    // Direct link metadata to BUP-GO project
    bupGoIntegration: {
      isIntegrated: { type: Boolean, default: true },
      bupGoUrl: { type: String, default: 'https://bup-go-project-8njl.vercel.app/' },
      targetModule: { type: String, default: 'campus-rides' },
    },
    status: {
      type: String,
      enum: ['active', 'filled', 'completed', 'cancelled'],
      default: 'active',
    },
    passengers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        contact: { type: String },
        status: { type: String, default: 'joined' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Ride || mongoose.model('Ride', rideSchema);
