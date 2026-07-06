import mongoose from "mongoose";
import dotenv from "dotenv";
import Knowledge from "../models/Knowledge.js";
import { chatbotKnowledgeBase } from "../data/knowledge.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Knowledge.deleteMany(); // optional reset

await Knowledge.insertMany(chatbotKnowledgeBase);

console.log("Knowledge imported successfully");

process.exit();