import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  fileType: {
    type: String,
    enum: ["IMAGE", "PDF"],   // ❌ NONE removed
    required: true            // 🔥 mandatory
  },

  attachment: {
    type: String,
    required: true            // 🔥 file must exist
  },

  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Notice", noticeSchema);