import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  // Legacy field (kept for backward compatibility)
  student: String,
  // New explicit fields
  studentName: String,
  studentClass: String,
  images: [String],
  likes: { type: Number, default: 0 },
  comments: [
    {
      user: { type: String, default: "Anonymous" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Achievement", AchievementSchema);
