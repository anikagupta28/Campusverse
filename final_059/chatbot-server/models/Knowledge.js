import mongoose from "mongoose";

const KnowledgeSchema = new mongoose.Schema({
  keywords: [String],
  question: String,
  answer: String
});

export default mongoose.model("Knowledge", KnowledgeSchema);