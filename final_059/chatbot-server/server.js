import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import chatbotRoutes from "./routes/chatbot.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err);
});

app.get("/", (req,res)=>{
    res.send("Campus Chatbot Backend Running");
});

/* CHATBOT ROUTE */
app.use("/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});