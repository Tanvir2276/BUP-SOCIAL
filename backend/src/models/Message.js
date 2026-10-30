import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: { type: String, required: true },
    // E2EE Data
    isEncrypted: { type: Boolean, default: true },
    ciphertext: { type: String, required: true }, // Encrypted payload
    iv: { type: String, required: true }, // Initialization Vector
    keyFingerprint: { type: String, default: 'AES-256-GCM-SHA256' },
    plainPreviewForDemo: { type: String }, // For convenience if testing in development
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
