import express from "express";
import {
  getAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} from "../controllers/alumniController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer storage for alumni images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `alumni-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// USER + ADMIN (VIEW)
router.get("/", getAlumni);

// ADMIN CRUD (auth temporarily disabled for local admin panel)
router.post("/", upload.single("image"), createAlumni);
router.put("/:id", upload.single("image"), updateAlumni);
router.delete("/:id", deleteAlumni);

export default router;
