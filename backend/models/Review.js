import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true }, // user name or anonymous
    // email optional now (form se hata diya)
    userEmail: { type: String, required: false },
    course: { type: String, required: false }, // course field
    message: { type: String, required: true },

    // ✅ optional rating
    rating: { type: Number, default: 5 },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
