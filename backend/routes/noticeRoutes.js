import express from "express";
import Notice from "../models/Notice.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* =========================
   MULTER STORAGE
========================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =========================
   GET NOTICES
========================= */

router.get("/", async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  res.json(notices);
});

/* =========================
   CREATE NOTICE
========================= */

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, category, department, fileType, date } = req.body;

    let attachment = "";

    if (req.file) {
      attachment = "/uploads/" + req.file.filename;
    }

    const notice = await Notice.create({
      title,
      description,
      category,
      department,
      fileType,
      attachment,
      date
    });

    res.json(notice);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create notice" });
  }
});

/* =========================
   DELETE NOTICE
========================= */

router.delete("/:id", async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;