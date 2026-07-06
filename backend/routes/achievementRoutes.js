import express from "express";
import upload from "../middleware/upload.js";
import {
  createAchievement,
  getAchievements,
  deleteAchievement,
  updateAchievementLikes,
  addAchievementComment,
} from "../controllers/achievementController.js";

const router = express.Router();

/* GET all achievements */
router.get(
  "/",
  (req, res, next) => {
    console.log("GET /api/achievements - Fetching achievements");
    next();
  },
  getAchievements
);

/* POST new achievement with images (optional) */
router.post(
  "/",
  (req, res, next) => {
    console.log("POST /api/achievements - Received request");

    // Use upload.any() to accept any field name, making it more flexible
    upload.any()(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err.message);
        // Even on error, continue - files are optional
        req.files = req.files || [];
      } else {
        // Filter files to only include images (field name "images")
        if (req.files && req.files.length > 0) {
          req.files = req.files.filter((file) => file.fieldname === "images");
          console.log("Files uploaded:", req.files.length);
        } else {
          req.files = [];
          console.log("No files in request");
        }
      }
      next();
    });
  },
  createAchievement
);

/* DELETE an achievement (admin panel - no auth for local admin) */
router.delete("/:id", deleteAchievement);

/* Update likes on an achievement (public) */
router.post("/:id/like", updateAchievementLikes);

/* Add a comment to an achievement (public) */
router.post("/:id/comments", addAchievementComment);

/* ✅ THIS LINE IS CRITICAL */
export default router;