import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  text: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});

const talkNestSchema = new mongoose.Schema({
  text: String,
  author: String,

  status: {
    type: String,
    enum: ["approved", "flagged"],
    default: "approved",
  },

 likes: {
  type: [String],   // ✅ store email or userId
  default: []
},

fires: {
  type: [String],
  default: []
},

  // ✅ NEW: replies stored inside post
replies: [
  {
    text: String,
    author: String,
    likes: { type: [String], default: [] },   // ✅ ADD
    fires: { type: [String], default: [] }    // ✅ ADD
  }
],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TalkNest", talkNestSchema);