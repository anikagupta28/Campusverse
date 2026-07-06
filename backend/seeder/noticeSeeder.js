import mongoose from "mongoose";
import dotenv from "dotenv";
import Notice from "../models/Notice.js";
import connectDB from "../config/db.js";

dotenv.config();

await connectDB();

const notices = [
  {
    title: "Semester Examination Datesheet DEC 2025-MAY 2026",
    description: "Semester exams schedule released for all departments.",
    category: "Examination",
    department: "All",
    fileType: "PDF",
    attachment: "/uploads/SemExam.pdf",
    date: new Date("2026-02-28"),
  },
  {
    title: "Full Stack Development Workshop",
    description: "Workshop on full stack development.",
    category: "Workshop",
    department: "Computer Science",
    fileType: "IMAGE",
    attachment: "/uploads/sdaud.jpeg",
    date: new Date("2026-01-18"),
  },
  {
    title: "Sports Meet Poster",
    description: "Annual sports meet poster released.",
    category: "Sports",
    department: "Sports Committee",
    fileType: "IMAGE",
    attachment: "/uploads/sdaud.jpeg",
    date: new Date("2026-01-20"),
  },
  {
    title: "Placement Drive - Google",
    description: "Google recruitment for final year students.",
    category: "Placement",
    department: "Placement Cell",
    fileType: "PDF",
    attachment: "/uploads/waciis.pdf",
    date: new Date("2026-01-25"),
  },
  {
    title: "Research Paper Competition",
    description: "Submit papers for annual competition.",
    category: "Academic",
    department: "Research Cell",
    fileType: "PDF",
    attachment: "/uploads/hackfin.pdf",
    date: new Date("2026-01-28"),
  },
  {
    title: "Library Timing Update",
    description: "Library open till 9 PM during exams.",
    category: "Library",
    department: "Library",
    fileType: "PDF",
    attachment: "/uploads/waciis.pdf",
    date: new Date("2026-01-22"),
  },
  {
    title: "Fee Payment Deadline",
    description: "Last date for semester fee payment.",
    category: "Fee",
    department: "Accounts",
    fileType: "PDF",
    attachment: "/uploads/waciis.pdf",
    date: new Date("2026-01-24"),
  },
  {
    title: "Hostel Maintenance Notice",
    description: "Hostel maintenance from Jan 1–7.",
    category: "Hostel",
    department: "Hostel Office",
    fileType: "PDF",
    attachment: "/uploads/waciis.pdf",
    date: new Date("2026-01-29"),
  }
];

const seedData = async () => {
  try {
    await Notice.deleteMany(); // 🔥 Clear old broken data
    await Notice.insertMany(notices);

    console.log("🔥 Notices Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
};

seedData();