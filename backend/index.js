import bcrypt from "bcryptjs";
import { spawn } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import path from "path";
import User from "./models/User.js";
import { exec } from "child_process";

// ✅ IMPORT YOUR ROUTES
import alumniRoutes from "./routes/alumniRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import risewallRoutes from "./routes/risewallRoutes.js";
import talknestRoutes from "./routes/talknestRoutes.js";

dotenv.config();
const app = express();

const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@banasthali\.in$/;

// Ensure uploads directory exists
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (req,res)=>res.json({status:"OK"}));

// ================= MAIL CONFIG =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// ================= CONNECT MONGODB =================

  const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

console.log("Mongo URI:", uri);

mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ================= SIGNUP =================
const generateUniqueAnonId = async () => {
  let anonId, exists = true;
  while(exists){
    anonId = Math.floor(1000 + Math.random()*99000);
    exists = !!(await User.findOne({anonId}));
  }
  return anonId;
};

app.post("/signup", async (req,res)=>{
  const {email,password} = req.body;
  if(!collegeEmailRegex.test(email)) return res.status(400).json({error:"Only college email (@banasthali.in) allowed"});

  const existingUser = await User.findOne({email});
  const hashed = await bcrypt.hash(password,10);
  const otp = Math.floor(100000 + Math.random()*900000).toString();
  const expires = new Date(Date.now() + 5*60*1000);
  let anonId;

  if(!existingUser) anonId = await generateUniqueAnonId();

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { password: hashed, otp, otpExpires: expires, ...(anonId && {anonId}) },
    { upsert:true, new:true }
  );

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your account",
    text: `Your OTP is ${otp}`
  });

  res.json({success:true, message:"OTP sent", email, anonId: updatedUser.anonId});
});

// ================= LOGIN =================
app.post("/login", async (req,res)=>{
  const {email,password} = req.body;
  if(!collegeEmailRegex.test(email)) return res.status(400).json({error:"Only college email allowed"});

  const user = await User.findOne({email});
  if(!user) return res.status(400).json({error:"User not found"});

  const ok = await bcrypt.compare(password,user.password);
  if(!ok) return res.status(401).json({error:"Wrong password"});

  const otp = Math.floor(100000 + Math.random()*900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5*60*1000);
  await user.save();

  await transporter.sendMail({from: process.env.EMAIL_USER, to: email, subject:"Login OTP", text:`Your OTP is ${otp}`});
  res.json({success:true,email});
});

// ================= VERIFY OTP =================
app.post("/verify-otp", async(req,res)=>{
  const {email,otp} = req.body;
  const user = await User.findOne({email});
  if(!user || user.otp !== otp || user.otpExpires < Date.now()) return res.status(401).json({error:"Invalid or expired OTP"});

  user.otp = null;
  await user.save();

  const token = jwt.sign({id:user._id,email}, process.env.JWT_SECRET, {expiresIn:"1h"});
  res.json({token,email});
});

// ================= ADMIN FUNCTIONAL ROUTES =================
app.use("/api/notices", noticeRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/risewall", risewallRoutes);
app.use("/api/talknest", talknestRoutes);
app.use("/api/reviews", reviewRoutes);

// ================= LAUNCH UNITY TOUR =================
// ================= LAUNCH UNITY TOUR =================
app.post("/launch-tour", (req,res)=>{
  try{

    // backend folder ka parent = TOTAL_CAMPUS
    const exePath = path.join(process.cwd(), "..", "CampusTour.exe");

    console.log("Launching EXE:", exePath);

    const child = spawn("cmd.exe", ["/c","start","",exePath], {
      detached:true,
      stdio:"ignore"
    });

    child.unref();

    console.log("🚀 Unity Tour Launched");
    res.json({success:true});

  } catch(error){
    console.error("❌ Error launching EXE:",error);
    res.status(500).json({success:false});
  }
});                                    