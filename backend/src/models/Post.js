import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'student' },
    authorAvatar: { type: String },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      role: { type: String, default: 'student' },
      avatar: { type: String },
      department: { type: String },
      batch: { type: String },
      studentId: { type: String },
    },
    communityType: {
      type: String,
      enum: ['Campus', 'Department', 'Course', 'Club', 'Batch'],
      default: 'Campus',
    },
    communityTarget: { type: String, default: 'General Campus' }, // e.g. "ICT-2201 Algorithms", "BUP Robotics Club"
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    imageUrl: { type: String },
    likes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
      },
    ],
    comments: [commentSchema],
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model('Post', postSchema);
