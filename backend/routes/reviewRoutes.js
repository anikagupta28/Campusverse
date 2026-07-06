import express from "express";
import {
  addReview,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import filterAbusiveLanguage from "../middleware/filterAbusiveLanguage.js";

const router = express.Router();

// ✅ user message save (with abusive language filter)
router.post("/add", filterAbusiveLanguage, addReview);

// ✅ public: fetch all reviews (for review page)
router.get("/", getAllReviews);

// ✅ admin panel: fetch all reviews
//    (currently open without auth because admin login is local only)
router.get("/all", getAllReviews);

// ✅ admin panel: delete review
//    (currently open without auth because admin login is local only)
router.delete("/:id", deleteReview);

export default router;
