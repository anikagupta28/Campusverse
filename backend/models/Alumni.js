import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    field: { type: String, required: true },   // e.g. Computer Science
    year: { type: String, required: true },    // e.g. "2024"
    role: String,
    company: String,
    linkedin: String,
    image: String
  },
  { timestamps: true }
);

export default mongoose.model("Alumni", alumniSchema);
