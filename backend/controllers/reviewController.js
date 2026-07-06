import Review from "../models/Review.js";

// ✅ User review save (Public / Logged-in both possible)
export const addReview = async (req, res) => {
  try {
    const { userName, message, rating, course } = req.body;

    if (!userName || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = await Review.create({
      userName,
      message,
      rating: rating || 5,
      course: course || null,
    });

    res.status(201).json({
      message: "✅ Review saved successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to save review", error: error.message });
  }
};

// ✅ Admin can view all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// ✅ Admin can delete review/message
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    await review.deleteOne();

    res.status(200).json({ message: "✅ Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
};

